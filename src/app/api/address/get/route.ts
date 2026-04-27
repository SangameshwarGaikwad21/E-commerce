import connectionToDB from "@/config/db";
import AddressModel from "@/models/Address.models";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    await connectionToDB();

    const address = await AddressModel.findOne({ userId: session.user.id }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ message: "Address fetch failed" }, { status: 500 });
  }
}
