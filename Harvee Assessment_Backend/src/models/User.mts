import mongoose, { Schema, model, Document } from "mongoose";

// Define a TypeScript interface for your document
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profile_image?: string;
  address?: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  role: "user" | "admin";
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      match: [/^[a-zA-Z\s]+$/, "Name must contain only alphabets"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, "Phone must be 10-15 digits"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    profile_image: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      maxlength: [150, "Address must not exceed 150 characters"],
      default: null,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      index: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{4,10}$/, "Pincode must be 4-10 digits"],
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Mongoose model
const User = model<IUser>("User", userSchema);

export default User;
