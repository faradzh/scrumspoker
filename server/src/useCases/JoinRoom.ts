import { Profile } from "passport";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";

class JoinRoom {
    private persistedRepository: RoomRepository;
    private temporaryRepository: RoomRepository;

    constructor(persistedRepository: RoomRepository, temporaryRepository: RoomRepository) {
        this.persistedRepository = persistedRepository;
        this.temporaryRepository = temporaryRepository;
    }

    async execute(roomId: string, participant: Profile): Promise<Room | undefined> {
        const roomSettings = await this.persistedRepository.findRoomById?.(roomId);
        if (!roomSettings) {
            throw new Error("Room settings not found");
        }

        // add participant to redis
        const room = this.temporaryRepository.joinRoom?.(roomSettings, participant);

        return room;
    }
}

export default JoinRoom;