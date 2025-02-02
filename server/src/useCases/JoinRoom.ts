import { Profile } from "passport";

import InMemoryRoomRepository from "../interfaceAdapters/repositories/InMemoryRoomRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import Room from "../entities/Room";

class JoinRoom {
    private inMemoryRoomRepository: InMemoryRoomRepository;
    private redisRoomRepository: RedisRoomRepository;

    constructor(inMemoryRoomRepository: InMemoryRoomRepository, redisRoomRepository: RedisRoomRepository) {
        this.inMemoryRoomRepository = inMemoryRoomRepository;
        this.redisRoomRepository = redisRoomRepository;
    }

    async execute(roomId: string, participant: Profile): Promise<Room> {
        const baseRoom = await this.inMemoryRoomRepository.findRoomById?.(roomId);
        if (!baseRoom) {
            throw new Error("Room settings not found");
        }
        baseRoom.addParticipant(participant);

        // add participant to redis
        this.redisRoomRepository.joinRoom?.(baseRoom);

        return baseRoom;
    }
}

export default JoinRoom;