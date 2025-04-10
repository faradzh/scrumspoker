import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class Session {
  private temporaryRepository: RoomRepository;

  constructor(temporaryRepository: RoomRepository) {
    this.temporaryRepository = temporaryRepository;
  }

  async revealEstimation(roomId: string, issueId: string): Promise<Room> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room was not found");
    }

    room.setEstimatedIssues(issueId);
    await this.temporaryRepository.revealEstimation?.(roomId, issueId);

    return room;
  }

  async setCurrentIssue(roomId: string, issueId: string): Promise<Room> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room was not found");
    }

    await this.temporaryRepository.setCurrentIssue?.(roomId, issueId);

    return room;
  }
}

export default Session;
