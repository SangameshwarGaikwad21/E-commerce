import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import { Order } from "@/models/Order.models";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  try {
    await connectionToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
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

   
    if (
      order.orderStatus === "SHIPPED" ||
      order.orderStatus === "DELIVERED"
    ) {
      return NextResponse.json(
        {
          message:
            "Order already processed, cannot cancel",
        },
        { status: 400 }
      );
    }

    
    order.orderStatus = "CANCELLED";
    await order.save();

    return NextResponse.json(
      {
        message: "Order Cancelled Successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Error:", error);

    return NextResponse.json(
      { message: "Order is not cancelled" },
      { status: 500 }
    );
  }
}