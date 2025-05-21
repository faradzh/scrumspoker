import { z } from "zod";
import { Profile } from "passport";

import CreateRoom from "./useCases/CreateRoom";
import JoinRoom from "./useCases/JoinRoom";
import GetAllRooms from "./useCases/GetAllRooms";
import GetAllIssues from "./useCases/GetAllIssues";
import TestIntegration from "./useCases/TestIntegration";
import { IntegrationTypeEnum } from "./useCases/constants";
import { EstimationMethod } from "./entities/types";

export interface RoomData {
  id?: string;
  name: string;
  estimationMethod: EstimationMethod;
  integration: IntegrationRequestData;
  moderator: Profile;
}

export interface IntegrationRequestData {
  id: IntegrationTypeEnum;
  filterLabel: string;
  projectName: string;
}

export const EstimationMethodEnum = z.enum([
  "fibbonachi",
  "powerOfTwo",
  "tshirtSizes",
]);

export type RoomUseCase = CreateRoom | JoinRoom | GetAllRooms;

export type IntegrationUseCase = TestIntegration;

export type IssueUseCase = GetAllIssues;

export const ProfileSchema: z.ZodType<Profile> = z.object({
  id: z.string(),
  displayName: z.string(),
  provider: z.string(),
});

export type Estimation = {
  userId: string;
  value: number;
  issueId?: string;
};
