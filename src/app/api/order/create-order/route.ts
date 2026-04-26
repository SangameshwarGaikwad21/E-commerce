import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";
import { Order } from "@/models/Order.models";

export async function POST(req: NextRequest) {
  try {
    await connectionToDB();

    const body = await req.json();

    const { user, orderItems, shippingAddress, paymentMethod } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { message: "No order items provided" },
        { status: 400 }
      );
    }

    const items = [];
    let totalPrice = 0;

    for (const item of orderItems) {
      const product = await Products.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }

      const orderItem = {
        product: product._id,
        name: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0],
      };

      totalPrice += product.price * item.quantity;
      items.push(orderItem);
    }

    const order = await Order.create({
      user,
      orderItems: items,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "RAZORPAY" ? "PENDING" : "PENDING",
      orderStatus: paymentMethod === "RAZORPAY" ? "PENDING" : "PROCESSING",
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
