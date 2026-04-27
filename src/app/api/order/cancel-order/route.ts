import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import { Order } from "@/models/Order.models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    await connectionToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Order ID required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.orderStatus)) {
      return NextResponse.json(
        { message: "This order cannot be cancelled now" },
        { status: 400 }
      );
    }

    order.orderStatus = "CANCELLED";
    if (order.paymentStatus === "PENDING") {
      order.paymentStatus = "FAILED";
    }

    await order.save();

    return NextResponse.json(
      { message: "Order cancelled successfully", order },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Cancel failed" },
      { status: 500 }
    );
  }
}
