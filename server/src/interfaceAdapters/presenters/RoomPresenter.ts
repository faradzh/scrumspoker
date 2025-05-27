import { Integration } from "../../entities/Integration";
import { Estimates, User } from "../../entities/types";

interface RoomPresenter {
  presentRoom(data: unknown): void;
}

export type RoomResponse = {
  id: string;
  name: string;
  estimationMethod: string;
  participants: Array<User>;
  link: string;
  moderatorId: string;
  estimates?: Estimates;
  revealedIssues?: string[];
  estimatedIssues?: string[];
  currentIssue: null | string;
  integration: Integration | null;
};

export default RoomPresenter;
