import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class DeleteRoom {
  constructor(
    private persistedRepository: RoomRepository,
    private tempRoomRepository: RoomRepository
  ) {}

  async execute(roomId: string): Promise<void> {
    const room = await this.persistedRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    await this.persistedRepository.deleteRoom?.(roomId);
    await this.tempRoomRepository.deleteRoom?.(roomId);
  }
}

export default DeleteRoom;
