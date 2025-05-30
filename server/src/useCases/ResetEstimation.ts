import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { Estimation } from "../types";

class ResetEstimation {
  private roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  public async execute(roomId: string, issueId: string) {
    await this.roomRepository.removeEstimationByIssue?.(roomId, {
      issueId,
    } as Estimation);
    await this.roomRepository.hideEstimation?.(roomId, issueId);
    await this.roomRepository.removeEstimatedIssue?.(roomId, issueId);
    await this.roomRepository.removeIssueTotalEstimation?.(roomId, issueId);
  }
}

export default ResetEstimation;
