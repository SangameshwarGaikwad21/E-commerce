import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";
import UserModel from "@/models/User.models";
import { Order } from "@/models/Order.models";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const dayKey = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectionToDB();

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentProducts,
      recentOrders,
      ordersByDay,
    ] = await Promise.all([
      Products.countDocuments(),
      UserModel.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $match: {
            paymentStatus: { $ne: "FAILED" },
            orderStatus: { $ne: "CANCELLED" },
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: { $ifNull: ["$totalPrice", "$totalAmount"] },
            },
          },
        },
      ]),
      Products.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title price images stock category createdAt")
        .lean(),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("totalPrice totalAmount paymentStatus orderStatus paymentMethod createdAt")
        .lean(),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            paymentStatus: { $ne: "FAILED" },
            orderStatus: { $ne: "CANCELLED" },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            orders: { $sum: 1 },
            revenue: {
              $sum: { $ifNull: ["$totalPrice", "$totalAmount"] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const chartMap = new Map<string, { orders: number; revenue: number }>();
    ordersByDay.forEach((item) => {
      chartMap.set(item._id, {
        orders: item.orders,
        revenue: item.revenue,
      });
    });

    const orderChart = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      const value = chartMap.get(key);

      return {
        day: dayKey(date),
        orders: value?.orders || 0,
        revenue: value?.revenue || 0,
      };
    });

    return NextResponse.json({
      counts: {
        products: totalProducts,
        users: totalUsers,
        orders: totalOrders,
        revenue: totalRevenue[0]?.revenue || 0,
      },
      recentProducts,
      recentOrders,
      orderChart,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Dashboard data failed" },
      { status: 500 }
    );
  }
}
