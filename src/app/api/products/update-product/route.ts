import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PATCH(request: NextRequest) {
  try {
    await connectionToDB();
    const session = await getServerSession(authOptions);
            
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") as string;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File | null;

    const existingProduct = await Products.findById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    let imagesArray = existingProduct.images;

    if (imageFile && imageFile.size > 0) {
      const uploaded = await uploadImageToCloudinary(imageFile);
      imagesArray = [uploaded.secure_url];
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        category,
        images: imagesArray,
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Product Updated Successfully",
        updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Product not updated", error },
      { status: 500 }
    );
  }
}