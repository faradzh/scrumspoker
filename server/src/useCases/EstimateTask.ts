import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { Estimation } from "../types";

class EstimateTask {
  private temporaryRepository: RoomRepository;

  constructor(temporaryRepository: RoomRepository) {
    this.temporaryRepository = temporaryRepository;
  }

  async execute(
    roomId: string,
    estimation: Estimation
  ): Promise<Room | undefined> {
    const room = await this.temporaryRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room was not found");
    }

    room.addEstimate(estimation);
    await this.temporaryRepository.addEstimateByIssue?.(room.id, estimation);

    return room;
  }
}

export default EstimateTask;
