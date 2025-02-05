import { Profile } from "passport";

import InMemoryRoomRepository from "../interfaceAdapters/repositories/InMemoryRoomRepository";
import Room from "../entities/Room";

class GetAllRooms {
    private inMemoryRoomRepository: InMemoryRoomRepository;

    constructor(inMemoryRoomRepository: InMemoryRoomRepository) {
        this.inMemoryRoomRepository = inMemoryRoomRepository;
    }

    async execute(moderator?: Profile): Promise<Room[]> {
        return await this.inMemoryRoomRepository.getAllRooms();
    }
}

export default GetAllRooms;