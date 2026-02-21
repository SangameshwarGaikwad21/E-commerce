import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: string;
  totalPrice: number;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus:  | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"    | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
  },
});


const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    orderStatus: {
      type: String,
      enum: [ "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED",],
     default: "PENDING",
    },
  },
  { timestamps: true }
);


export const Order: Model<IOrder> =  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);