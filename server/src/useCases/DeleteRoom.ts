import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class DeleteRoom {
  constructor(private roomRepository: RoomRepository) {}

  async execute(roomId: string): Promise<void> {
    const room = await this.roomRepository.findRoomById?.(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    await this.roomRepository.deleteRoom?.(roomId);
  }
}

export default DeleteRoom;
