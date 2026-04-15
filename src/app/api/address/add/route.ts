import connectionToDB from "@/config/db";
import UserModel from "@/models/User.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
  try { 
    const{fullName,phone,city,state,pincode,country,street}=await request.json()
    
    if(!fullName || !phone || !city || !state || !pincode || !country || !street){
      return NextResponse.json(
        {message:"All Fields are required"},
        {status:500}
      )
    }
    
    if (phone.length !== 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    await connectionToDB();

     const newAddress=await UserModel.create({
      fullName,phone,city,state,pincode,country,street
     })

     return NextResponse.json(
      {
        message:"Address added Successfully",
        newData:newAddress
      },
      {status:200})
  } 
  catch (error) {
   return NextResponse.json(
    { message: "Error adding address", error },
    { status: 500 }
    )  
  }

}