import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";

export const getProducts = createAsyncThunk<Product[],void,{ rejectValue: string }>(
        "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/products/get-product"
      );
      return res.data.getProduct;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
);

interface ProductState{
    products:Product[],
    loading:boolean,
    error:string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice=createSlice({
    name:"products",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder

        .addCase(getProducts.pending,(state)=>{
            state.loading=true
        })

        .addCase(getProducts.fulfilled,(state,action)=>{
            state.loading=false
            state.products=action.payload
        })

        .addCase(getProducts.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })
    }
})

export default productSlice.reducer;