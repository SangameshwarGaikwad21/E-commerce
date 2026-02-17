import bcrypt from "bcryptjs";
import mongoose,{Schema,model,models} from "mongoose";

export interface User{
    _id:mongoose.Types.ObjectId,
    username:string,
    email:string,
    password:string,
    role:string,
    refreshToken:string,
    createdAt:Date,
    updatedAt:Date
}

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
            type: [
                {
                    fullName: String,
                    phone: String,
                    city: String,
                    state: String,
                    pincode: String,
                    country: String,
                    street: String,
                    isDefault: Boolean
                }
            ],
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