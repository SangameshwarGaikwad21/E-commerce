import connectionToDB from "@/config/db";
import AddressModel from "@/models/Address.models";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const { id, fullName, phone, city, state, pincode, country, street } =
      await request.json();

    if (!fullName || !phone || !city || !state || !pincode || !street) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectionToDB();

    const address = await AddressModel.findOneAndUpdate(
      id ? { _id: id, userId: session.user.id } : { userId: session.user.id },
      {
        fullName,
        phone,
        city,
        state,
        pincode,
        country: country || "India",
        street,
      },
      { new: true }
    );

    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address updated successfully", data: address });
  } catch {
    return NextResponse.json({ message: "Address update failed" }, { status: 500 });
  }
}
