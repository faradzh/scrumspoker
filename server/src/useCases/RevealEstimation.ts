import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class RevealEstimation {
  private temporaryRepository: RoomRepository;

  constructor(temporaryRepository: RoomRepository) {
    this.temporaryRepository = temporaryRepository;
  }

  async execute(roomId: string, issueId: string): Promise<Room> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room was not found");
    }

    room.setRevealedIssue(issueId);
    await this.temporaryRepository.revealEstimation?.(roomId, issueId);

    return room;
  }
}

export default RevealEstimation;
