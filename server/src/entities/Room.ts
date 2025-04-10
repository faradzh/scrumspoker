import { Estimation } from "../types";
import { Estimates, EstimationMethod, User } from "./types";

class Room {
  public id;
  public name;
  public estimationMethod;
  public participants;
  public moderator;
  public estimates: Estimates;
  public estimatedIssues: string[];
  public currentIssue: string | null;

  constructor(
    id: string,
    name: string,
    estimationMethod: EstimationMethod,
    participants: User[] = [],
    estimatedIssues = [],
    currentIssue: any,
    moderator?: User
  ) {
    this.id = id;
    this.name = name;
    this.estimationMethod = estimationMethod;
    this.participants = participants;
    this.moderator = moderator;
    this.estimates = {};
    this.estimatedIssues = estimatedIssues;
    this.currentIssue = currentIssue;
  }

  public addParticipant(participant: User): void {
    if (this.participants.find((p) => p.id === participant.id)) {
      return;
    }
    this.participants?.push(participant);
  }

  public removeParticipant(participant: User): void {
    const targetParticipant = this.participants.find(
      (p) => p.id === participant.id
    );
    if (!targetParticipant) {
      return;
    }
    this.participants = this.participants?.filter(
      (p) => p.id != participant.id
    );
  }

  public hasParticipant(participant: User): boolean {
    return !!this.participants.find((p) => p.id === participant.id);
  }

  public addEstimate(estimation: Estimation): void {
    const targetParticipant = this.participants.find(
      (p) => p.id === estimation.userId
    );
    if (!targetParticipant) {
      throw new Error("The participant is NOT in the room!");
    }
    this.estimates[estimation.issueId!] = {
      [estimation.userId]: estimation.value.toString(),
    };
  }

  public userHasEstimated(userId: string, issueId: string): boolean {
    return !!this.estimates[issueId]?.[userId];
  }

  public setEstimatedIssues(issueId: string) {
    this.estimatedIssues.push(issueId);
  }
}

export default Room;
