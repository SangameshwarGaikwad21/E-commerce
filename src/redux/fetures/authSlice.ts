import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";

interface Register{
    username:string,
    email:string,
    password:string
}

interface AuthState{
    user:User | null
    loading:boolean
    error:string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser=createAsyncThunk<User,Register,{ rejectValue: string }>(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const res=await axiosInstance.post("/auth/register",userData);
            return res.data.user
        } 
        catch (error:any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Register User went wrong"
            )
        }
     }
)

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder

        .addCase(registerUser.pending,(state)=>{
            state.loading=true
            state.error=null
        })

        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false
            state.user=action.payload
        })

        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload || "Something went wrong"
        })
    }
})




export default authSlice.reducer;