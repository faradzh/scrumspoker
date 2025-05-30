import Room from "../../entities/Room";
import { User } from "../../entities/types";
import { RequestUser } from "../../infrastructure/auth/types";
import { Estimation } from "../../types";

export interface RoomRepository {
  saveRoom?(data: unknown): Promise<Room | void>;
  saveParticipant?(roomId: string, participant: User): Promise<void>;
  setParticipantOnline?(
    roomId: string,
    participant: User,
    online: boolean
  ): Promise<void>;
  joinRoom?(room: Room): Promise<Room>;
  findRoomById?(roomId: string): Promise<Room | undefined>;
  findRefreshToken?(user: RequestUser): Promise<string | undefined | null>;
  deleteRoom?(roomId: string): Promise<void>;
  updateRoom?(data: unknown): Promise<Room | undefined>;
  getAllRooms?(): Promise<Room[]>;
  addEstimate?(roomId: string, estimation: Estimation): Promise<void>;
  addEstimateByIssue?(roomId: string, estimation: Estimation): Promise<void>;
  removeEstimationByIssue?(
    roomId: string,
    estimation: Estimation
  ): Promise<void>;
  addEstimatedIssue?(roomId: string, issueId: string): Promise<void>;
  removeEstimatedIssue?(roomId: string, issueId: string): Promise<void>;
  addIssueTotalEstimation?(
    roomId: string,
    issueId: string,
    value: number
  ): Promise<void>;
  removeIssueTotalEstimation?(roomId: string, issueId: string): Promise<void>;
  revealEstimation?(roomId: string, issueId: string): Promise<void>;
  hideEstimation?(roomId: string, issueId: string): Promise<void>;
  setCurrentIssue?(roomId: string, issueId: string): Promise<void>;
}
