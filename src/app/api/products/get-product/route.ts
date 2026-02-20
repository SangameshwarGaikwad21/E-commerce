import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";


export async function GET(request:NextRequest) {
    try {
      await connectionToDB();
      
      const getProduct=await Products.find({})
      if(!getProduct){
        return NextResponse.json(
          {message:"Product is not get"},
          {status:401}
        )
      }

      return NextResponse.json(
        {message:"Product get Successfully",getProduct},
        {status:200}
      )

    } 
    catch (error) {
    return NextResponse.json(
      { message: "Not Get the product", error },
      { status: 500 }
    );
    }
}