import connectionToDB from "@/config/db";
import AddressModel from "@/models/Address.models";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    await connectionToDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Address ID required" }, { status: 400 });
    }

    const deletedAddress = await AddressModel.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Address delete failed" }, { status: 500 });
  }
}
