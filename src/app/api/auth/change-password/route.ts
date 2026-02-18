import connectionToDB from "@/config/db";
import UserModel from "@/models/User.models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectionToDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } =
      await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      email: session.user?.email,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Reminder failed" },
      { status: 500 }
    );
  }
}