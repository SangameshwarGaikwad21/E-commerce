import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
import connectionToDB from "@/config/db";
import Products from "@/models/Product.models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request:NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
        return NextResponse.json(
            { message: "Admin access only" },
            { status: 403 }
        );
    }

        await connectionToDB()

        const formData = await request.formData();
 
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const imageFiles = formData.getAll("images") as File[];
        const fallbackImage = formData.get("image") as File | null;
        const images = imageFiles.length > 0 ? imageFiles : fallbackImage ? [fallbackImage] : [];
       

        if (!title || !description || !price || !category || images.length === 0) {
            return NextResponse.json(
            { error: "All required fields must be filled" },
            { status: 400 }
        )}

        const uploadedImages = await Promise.all(
            images.map((image) => uploadImageToCloudinary(image))
        );

        const newProduct=await Products.create({
            title,
            description,
            price,
            category,
            images: uploadedImages.map((image) => image.secure_url)
        })

        return NextResponse.json(
            {
                message:"Product is created Successfully",
                product:newProduct
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
