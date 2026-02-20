import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";

export async function POST(request:NextRequest) {
    try {
        await connectionToDB()

        const formData = await request.formData();
 
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const images = formData.get("image") as File | null;
        

        if (!title || !description || !price || !category ||  !images) {
            return NextResponse.json(
            { error: "All required fields must be filled" },
            { status: 400 }
        )}

        const uploadOnCloudinary= await uploadImageToCloudinary(images)

        const newProduct=await Products.create({
            title,
            description,
            price,
            category,
            image: {
                url: uploadOnCloudinary.secure_url,
                public_id: uploadOnCloudinary.public_id,
            },
        })

        return NextResponse.json(
            {
                message:"Product is created Successfully",
                prodct:newProduct
            },
            {status:201}
        )

    } 
    catch (error) {
        return NextResponse.json(
            {message:"Product is not created",error},
            {status:500}
        )    
    }
}