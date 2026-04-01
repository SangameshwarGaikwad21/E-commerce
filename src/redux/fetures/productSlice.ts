import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;

  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,

  createLoading: false,
  createError: null,
  createSuccess: false,
};

// 🔥 GET PRODUCTS
export const getProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/getProducts", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/products/get-product");

    // ✅ SAFETY CHECK
    return res.data?.getProduct || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Something went wrong"
    );
  }
});

// 🔥 CREATE PRODUCT
export const createProduct = createAsyncThunk<
  Product,
  FormData,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
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

    return res.data?.product; // ✅ safe
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create product"
    );
  }
});

// 🔥 DELETE PRODUCT
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(
      `/products/delete-product?productId=${productId}`
    );

    return productId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete product"
    );
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ GET PRODUCTS
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 IMPORTANT FIX
        state.products = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Get product went wrong";
      })

      // ✅ CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;

        // 🔥 SAFE ADD
        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          action.payload || "Failed to create product";
      })

      // ✅ DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (product) => product?._id !== action.payload
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "delete product failed";
      });
  },
});

export default productSlice.reducer;
export const { resetCreateState } = productSlice.actions;