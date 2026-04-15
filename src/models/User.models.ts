import bcrypt from "bcryptjs";
import mongoose,{Schema,model,models} from "mongoose";

export interface Address {
    _id?: mongoose.Types.ObjectId,
    fullName: string,
    phone: string,
    city: string,
    state: string,
    pincode: string,
    country: string,
    street: string,
    isDefault: boolean
}

export interface User {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    role: string,
    refreshToken: string,
    addresses: Address[], // 👈 ADD THIS
    createdAt: Date,
    updatedAt: Date
}

const userAddress=new Schema(
    {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    street: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
)

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:[true,"username is required"]
        },
        email:{
            type:String,
            required:[true,"username is required"],
            unique:true
        },
        password:{
            type:String,
            required:[true,"username is required"]
        },
        role:{
            type:String,
            enum:["user" ,"admin"],
            default:"user"
        },
        refreshToken:{
            type:String,
            required:false
        }, 
        addresses: {
            type: [userAddress],
                default: []
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(){
    if(this.isModified("password")) {
        this.password= await bcrypt.hash(this.password,10)
    }
})


const UserModel = models.User || model<User>("User", userSchema);
export default UserModel;