import { Schema, models, model, Document, Types, Model } from "mongoose";
import { IMessage } from "./message.model";

// interface representing a user document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}

// Schema corresponding to the User document interface
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
  },
  password: { type: String, required: [true, "password is required"] },
  verifyCode: { type: String, required: [true, "verify code is required"]},
  verifyCodeExpiry: { type: Date, required: [true, "verify code expiry is required"]},
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: {type: Boolean, default: true },
  messages: [{ type: Types.ObjectId, ref: "Message" }],
});

// export the User model
export const User = models.User as Model<IUser> || model<IUser>("User", userSchema);
