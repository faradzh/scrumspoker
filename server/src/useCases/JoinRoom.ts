import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { User } from "../entities/types";

class JoinRoom {
    private persistedRepo: RoomRepository;
    private tempRepo: RoomRepository;

    constructor(persistedRepo: RoomRepository, tempRepo: RoomRepository) {
        this.persistedRepo = persistedRepo;
        this.tempRepo = tempRepo;
    }

    async execute(roomId: string, participant: User): Promise<Room> {
        const roomSettings = await this.persistedRepo.findRoomById?.(roomId);
        if (!roomSettings) {
            throw new Error("Room settings not found");
        }

        const room = await this.tempRepo.joinRoom?.(roomSettings)!;

        if (!room.hasParticipant(participant)) {
            room.addParticipant(participant);
            this.tempRepo.saveParticipant?.(roomId, participant);
        }

        return room;
    }
}

export default JoinRoom;