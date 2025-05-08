import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  isModerator: { type: Boolean, default: false },
  refreshToken: String,
});

export default mongoose.model("User", UserSchema);
