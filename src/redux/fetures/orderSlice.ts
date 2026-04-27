import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem{
    id?:string,
    product?: string;
    name?: string;
    title?:string,
    price:number,
    quantity:number
    image?: string;
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

export const getUserOrders = createAsyncThunk<OrderResponse[], void, { rejectValue: string }>(
  "order/get-user-orders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/order/get-order");
      return res.data.orders || [];
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to get orders");
    }
  }
);

export const cancelOrder = createAsyncThunk<OrderResponse, string, { rejectValue: string }>(
  "order/cancel-order",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/order/cancel-order?id=${orderId}`);
      return res.data.order;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to cancel order");
    }
  }
);

interface OrderState{
    order: OrderResponse | null;
    orders: OrderResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
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
        .addCase(getUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserOrders.fulfilled, (state, action: PayloadAction<OrderResponse[]>) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(getUserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to get orders";
        })
        .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
            state.orders = state.orders.map((order) =>
                order._id === action.payload._id ? action.payload : order
            );
        })
    }
})

export default orderSlice.reducer;
