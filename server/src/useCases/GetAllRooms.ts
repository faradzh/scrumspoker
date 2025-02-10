import { Profile } from "passport";

import InMemoryRoomRepository from "../interfaceAdapters/repositories/InMemoryRoomRepository";
import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class GetAllRooms {
    private roomRepository: RoomRepository;

    constructor(roomRepository: RoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(moderator?: Profile): Promise<Room[] | undefined> {
        if (this.roomRepository.getAllRooms === undefined) {
            return;
        }
        return await this.roomRepository.getAllRooms();
    }
}

export default GetAllRooms;