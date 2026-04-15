import connectionToDB from "@/config/db";
import AddressModel from "@/models/Address.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, city, state, pincode, country, street,userId } =
      await request.json();

    console.log("BODY:", { fullName, phone, city, state, pincode, country, street });

    if (!fullName || !phone || !city || !state || !pincode || !street) {
      return NextResponse.json(
        { message: "All Fields are required" },
        { status: 400 }
      );
    }

    if (phone.length !== 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectionToDB();

    const newAddress = await AddressModel.create({
      userId,
      fullName,
      phone,
      city,
      state,
      pincode,
      country: country || "India",
      street,
    });

    return NextResponse.json(
      {
        message: "Address added Successfully",
        data: newAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR:", error); // 🔥 VERY IMPORTANT

    return NextResponse.json(
      { message: "Error adding address", error },
      { status: 500 }
    );
  }
}