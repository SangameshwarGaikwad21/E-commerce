import connectionToDB from "@/config/db";
import UserModel from "@/models/User.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const{username,email,password}=await request.json()
        if(!username || !email || !password){
            return NextResponse.json(
                {message:"All Fields are required"},
                {status:401}
            )
        }

        await connectionToDB()

        const userExisted=await UserModel.findOne({email})
        if(userExisted){
            return NextResponse.json(
                {message:"User Already Registered with this Email"}
            )
        }

        const user= await UserModel.create({
            username:username,
            email:email,
            password:password,
        })

        return NextResponse.json(
            {message:"User is registred Successfully",user},
            {status:201}
        )

    } 
    catch (error) {
        return NextResponse.json(
            {message:"User is registration Failed",error},
            {status:500}
        )
    }
}