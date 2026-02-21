import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import { Order } from "@/models/Order.models";

export async function GET(request:NextRequest) {
    try {
        await connectionToDB(); 
        
        const orders=await Order.find({})
        if(!orders || orders.length === 0){
            return NextResponse.json(
                {message:"There is no order"}
            )
        }

        return NextResponse.json(
            {message:"Your are All Order is here",orders},
            {status:201}
        )

    } 
    catch (error) {
        return NextResponse.json(
            {message:"Order are not get"},
            {status:500}
        )
    }
}