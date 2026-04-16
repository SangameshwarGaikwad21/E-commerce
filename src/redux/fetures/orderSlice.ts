import axiosInstance from "@/lib/axios";
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

  paymentMethod: "COD" | "ONLINE";
}

export interface OrderResponse {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;

  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  paymentMethod: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

  createdAt: string;
  updatedAt: string;
}

export const createOrder=createAsyncThunk<OrderResponse,CreateOrderPayload,{rejectValue:string}>(
    "order/create-order",
    async(data,{rejectWithValue})=>{
        try {
            const res=await axiosInstance.post("/order/create-order",data)
            return res.data.data
        } 
        catch (error:any) {
              return rejectWithValue(error.response?.data || "Something went wrong");
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