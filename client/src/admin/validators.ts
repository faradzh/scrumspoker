import { z } from "zod";

export const EstimationMethodEnum = z.enum([
  "fibbonachi",
  "powerOfTwo",
  "tshirtSizes",
]);

export const CreateRoomSchema = z.object({
  name: z.string().min(1, "Room name is required."),
  estimationMethod: EstimationMethodEnum.default("fibbonachi"),
  integration: z.object({
    id: z.string().min(1, "Integration ID is required."),
    projectName: z.string().optional(),
    filterLabel: z.string().min(1, "Filter Label is required."),
  }),
});

export function extractErrorMessage(field: any) {
  return field ? field._errors?.[0] : "";
}
