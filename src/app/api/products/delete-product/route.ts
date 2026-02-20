import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";


export async function DELETE(request:NextRequest) {
    try {
        
    } 
    catch (error) {
    return NextResponse.json(
      { message: "Not Product deleted", error },
      { status: 500 }
    );
    }
}