import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class Session {
  private temporaryRepository: RoomRepository;

  constructor(temporaryRepository: RoomRepository) {
    this.temporaryRepository = temporaryRepository;
  }

  async revealEstimation(
    roomId: string,
    issueId: string
  ): Promise<Room | undefined> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      return;
    }

    room.setRevealedIssue(issueId);
    await this.temporaryRepository.revealEstimation?.(roomId, issueId);

    return room;
  }

  async setCurrentIssue(
    roomId: string,
    issueId: string
  ): Promise<Room | undefined> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      return;
    }

    await this.temporaryRepository.setCurrentIssue?.(roomId, issueId);

    return room;
  }
}

export default Session;
