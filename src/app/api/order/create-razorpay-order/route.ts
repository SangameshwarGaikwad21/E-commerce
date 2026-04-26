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

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { message: "Razorpay keys are not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

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
