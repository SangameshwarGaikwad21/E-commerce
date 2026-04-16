import axiosInstance from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AddressState {
  loading: boolean;
  addresses: any[];
  error: string | null;
}

const initialState: AddressState = {
  loading: false,
  addresses: [],
  error: null,
};

export const addAddress = createAsyncThunk(
  "address/add",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/address/add", data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add address";
      });
  },
});

export default addressSlice.reducer;