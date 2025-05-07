import mongoose, { Schema } from "mongoose";

import { UserSchema } from "./UserSchema";

const RoomSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    estimationMethod: { type: String, required: true },
    moderator: UserSchema,
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Integration",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", RoomSchema);
