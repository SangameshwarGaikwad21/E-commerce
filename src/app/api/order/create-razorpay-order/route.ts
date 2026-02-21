import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import {Order} from "@/models/Order.models";
import connectionToDB from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectionToDB();

    const { orderId } = await req.json();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: order.totalPrice * 100, // paisa
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}