import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {Order} from "@/models/Order.models";
import connectionToDB from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectionToDB();

    const {razorpay_order_id,razorpay_payment_id, razorpay_signature, } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      _id: razorpay_order_id,
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "PROCESSING";
    order.paidAt = new Date();

    await order.save();

    return NextResponse.json({
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}