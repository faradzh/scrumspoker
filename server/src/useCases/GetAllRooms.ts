import { Profile } from "passport";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class GetAllRooms {
  private roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(moderator: Profile): Promise<Room[] | undefined> {
    if (this.roomRepository.getAllRooms === undefined) {
      return;
    }
    const allRooms = await this.roomRepository.getAllRooms();
    const myRooms = allRooms.filter(
      (room) => room.moderator?.id === moderator.id
    );

    return myRooms;
  }
}

export default GetAllRooms;
