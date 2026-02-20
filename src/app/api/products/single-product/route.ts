import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectionToDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") as string;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const product = await Products.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Single product fetched successfully",
        product,
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}