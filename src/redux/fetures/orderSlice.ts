import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem{
    id:string,
    title:string,
    price:number,
    quantity:number
}

export interface CreateOrderPayload {
  user: string;

  orderItems: {
    product: string;
    quantity: number;
  }[];

  totalAmount: number;

  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  paymentMethod: "COD" | "RAZORPAY";
}

export interface OrderResponse {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  totalPrice: number;

  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  createdAt: string;
  updatedAt: string;
}

export const createOrder=createAsyncThunk<OrderResponse,CreateOrderPayload,{rejectValue:string}>(
    "order/create-order",
    async(data,{rejectWithValue})=>{
        try {
            const res=await axiosInstance.post("/order/create-order",data)
            return res.data.order
        } 
        catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            return rejectWithValue(axiosError.response?.data?.message || "Something went wrong");
        }
    }    
)

interface OrderState{
    order: OrderResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
};

const orderSlice=createSlice({
    name:"order",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createOrder.fulfilled,(state,action:PayloadAction<OrderResponse>)=>{
            state.loading=false;
            state.order=action.payload;
        })
        .addCase(createOrder.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Failed Something Went Wrong" 
        })
    }
})

export default orderSlice.reducer;
