import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from "../types";

class UpdateRoom {
  private roomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  public async execute(
    roomId: string,
    data: RoomData
  ): Promise<Room | undefined> {
    return await this.updateRoomData(roomId, data);
  }

  private async updateRoomData(
    roomId: string,
    data: RoomData
  ): Promise<Room | undefined> {
    const roomData = {
      id: roomId,
      ...data,
    };

    return await this.roomRepository.updateRoom?.(roomData);
  }
}

export default UpdateRoom;
