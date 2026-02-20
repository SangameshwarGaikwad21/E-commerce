import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";


export async function GET(request:NextRequest) {
    try {
        
    } 
    catch (error) {

    return NextResponse.json(
      { message: "Not Get the product", error },
      { status: 500 }
    );
    }
}