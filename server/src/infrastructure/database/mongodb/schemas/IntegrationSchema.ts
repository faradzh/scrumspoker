import mongoose, { Schema } from "mongoose";

import { IntegrationTypeEnum } from "../../../../useCases/constants";

export interface IntegrationDocument extends Document {
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

export const IntegrationModel = mongoose.model<IntegrationDocument>(
  "Integration",
  IntegrationSchema
);

export default IntegrationSchema;
