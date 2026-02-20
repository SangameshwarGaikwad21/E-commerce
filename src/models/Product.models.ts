import mongoose, { Schema,model,models } from "mongoose";

export interface Product{
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand?: string;
    stock: number;
    images: string[];
    ratings: number;
    numReviews: number;
    isFeatured: boolean;
    isPublished: boolean;
}

const ProductSchema=new Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        discountPrice: {
            type: Number,
        },
        category:{
            type:String,
            required:true
        },
        brand:{
            type: String,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        images: [
            {
                type: String,
            },
        ],

        ratings: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isPublished: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps:true
    }
)

const Products=models.Product || model<Product>("Product",ProductSchema)
export default Products;
