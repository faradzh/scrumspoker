import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    isModerator: { type: Boolean, default: false },
    name: String,
    accessToken: String,
    refreshToken: String,
  },
  {
    timestamps: true, // Add timestamps for consistency
  }
);

export default mongoose.model("User", UserSchema);
