import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { User } from "../entities/types";

class LeaveRoom {
  private persistedRepo: RoomRepository;
  private tempRepo: RoomRepository;

  constructor(persistedRepo: RoomRepository, tempRepo: RoomRepository) {
    this.persistedRepo = persistedRepo;
    this.tempRepo = tempRepo;
  }

  async execute(roomId: string, participant: User): Promise<Room | undefined> {
    const roomSettings = await this.persistedRepo.findRoomById?.(roomId);
    if (!roomSettings) {
      return;
    }

    const room = await this.tempRepo.joinRoom?.(roomSettings)!;

    if (!room.hasParticipant(participant)) {
      return;
    }

    room.setParticipantOnline(participant, false);
    this.tempRepo.setParticipantOnline?.(roomId, participant, false);

    return room;
  }
}

export default LeaveRoom;
