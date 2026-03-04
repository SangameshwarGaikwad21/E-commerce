import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";

interface ProductState{
  products:Product[],
  loading:boolean,
  error:string | null

  createLoading: boolean
  createError: string | null
  createSuccess: boolean
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,

  createLoading: false,
  createError: null,
  createSuccess: false
};

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

export const createProduct = createAsyncThunk<Product,FormData,{ rejectValue: string }
  >(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
          "/products/add-product",
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      console.log(res.data.product)
      return res.data.product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

const productSlice=createSlice({
    name:"products",
    initialState,
    reducers: {
    resetCreateState: (state) => {
    state.createLoading = false;
    state.createError = null;
    state.createSuccess = false;
      },
    },
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

        .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
        })

        .addCase(createProduct.fulfilled, (state, action) => {
          state.createLoading = false;
          state.createSuccess = true;
          state.products.unshift(action.payload);
        })

        .addCase(createProduct.rejected, (state, action) => {
          state.createLoading = false;
          state.createError =
            action.payload || "Failed to create product";
        });
    }
})

export default productSlice.reducer;
export const { resetCreateState } = productSlice.actions;