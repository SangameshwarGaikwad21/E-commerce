import connectionToDB from "@/config/db";
import UserModel from "@/models/User.models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/options";

export async function GET(request:NextRequest){
    try {
        await connectionToDB();
         const session = await getServerSession(authOptions);
        
            if (!session) {
              return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
              );
            }

        const userFind=await UserModel.findById(session.user.id).select("-password")

        if(!userFind){
            return NextResponse.json(
                {message:"User is not Found"},
                {status:401}
            )
        }

        return NextResponse.json(
            {message:"Successfully get the user profile"},
            {status:200}
        )

    } 
    catch (error) {
        return NextResponse.json(
            {message:"User is not found her"},
            {status:500}
    )
    }
}