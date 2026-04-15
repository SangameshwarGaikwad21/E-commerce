import mongoose, { Schema, model, models } from "mongoose";

export interface Address {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // 🔥 link to user
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  street: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const addressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔥 important
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    street: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AddressModel =
  models.Address || model<Address>("Address", addressSchema);

export default AddressModel;