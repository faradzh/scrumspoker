import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    estimationMethod: { type: String, required: true },
    moderator: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    integration: {
      ref: "Integration",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", RoomSchema);
