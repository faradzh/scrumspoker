import mongoose, { InferSchemaType, Schema } from "mongoose";

import { IntegrationTypeEnum } from "../../../../useCases/constants";

export interface IntegrationDocument extends Document {
  _id: string;
  type: IntegrationTypeEnum;
  projectName: string;
  filterLabel: string;
  domainUrl: string;
  email?: string;
  apiToken?: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IntegrationDocument>(
  {
    type: {
      type: String,
      enum: Object.values(IntegrationTypeEnum),
      required: true,
    },
    projectName: { type: String, required: true },
    filterLabel: { type: String, required: true },
    domainUrl: { type: String, required: true },
    email: { type: String },
    apiToken: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IntegrationDocument>(
  "Integration",
  IntegrationSchema
);
