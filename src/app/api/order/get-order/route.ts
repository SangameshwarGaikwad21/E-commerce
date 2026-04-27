import { NextRequest, NextResponse } from "next/server";
import connectionToDB from "@/config/db";
import { Order } from "@/models/Order.models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Login required" },
                { status: 401 }
            );
        }

        await connectionToDB(); 

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const isAdmin = session.user.role === "admin";
        const filter = isAdmin && userId === "all" ? {} : { user: session.user.id };

        const orders = await Order.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(
            { message: "Orders fetched successfully", orders },
            { status: 200 }
        )

    } 
    catch {
        return NextResponse.json(
            {message:"Order are not get"},
            {status:500}
        )
    }
}
