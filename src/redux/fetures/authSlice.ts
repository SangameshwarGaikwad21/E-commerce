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

// Register User 
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

// ChangePassword
export const changePassword = createAsyncThunk<string,
    {oldPassword: string; newPassword: string },{ rejectValue: string }>(
        "auth/changePassword",
        async (data, { rejectWithValue }) => {
        try {
        const res = await axiosInstance.post(
            "/auth/change-password",
            data
        );
            return res.data.message;
        } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message ||
            "Password change failed"
        );
        }
  }
);


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

        .addCase(changePassword.pending,(state)=>{
            state.loading=true
            state.error=null
        })

        .addCase(changePassword.fulfilled,(state)=>{
            state.loading=false
        })

        .addCase(changePassword.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || "Password change failed";
        })
    }
})




export default authSlice.reducer;