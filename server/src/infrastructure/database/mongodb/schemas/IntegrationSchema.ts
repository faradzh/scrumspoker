import mongoose, { Schema } from "mongoose";

import { IntegrationTypeEnum } from "../../../../useCases/constants";

export interface IntegrationDocument extends Document {
  _id: string;
  type: IntegrationTypeEnum;
  projectName: string;
  filterLabel: string;
  domainUrl: string;
  cloudId: string;
  email?: string;
  apiToken?: string;
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
    cloudId: { type: String, required: true },
    email: { type: String },
    apiToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IntegrationDocument>(
  "Integration",
  IntegrationSchema
);
