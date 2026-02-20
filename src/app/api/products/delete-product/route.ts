import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";


export async function DELETE(request:NextRequest,{ params }: { params: { id: string } }) {
    try {
        await connectionToDB();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");
        if(!productId){
          return NextResponse.json(
            {message:"Product ID required"},
            {status:401}
          )
        }

        const deleteProduct=await Products.findByIdAndDelete(productId)
         if (!deleteProduct) {
          return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { message: "Product deleted successfully", deleteProduct },
          { status: 200 }
        );

    } 
    catch (error) {
    return NextResponse.json(
      { message: "Not Product deleted", error },
      { status: 500 }
    );
    }
}