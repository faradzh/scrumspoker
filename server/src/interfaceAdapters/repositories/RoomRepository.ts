import Room from "../../entities/Room";
import { User } from "../../entities/types";
import { Estimation } from "../../types";

export interface RoomRepository {
    saveRoom?(data: unknown): Promise<Room | void>;
    saveParticipant?(roomId: string, participant: User): Promise<void>;
    joinRoom?(room: Room): Promise<Room>;
    findRoomById?(roomId: string): Promise<Room | undefined>;
    deleteRoom?(roomId: string): Promise<void>;
    getAllRooms?(): Promise<Room[]>;
    addEstimate?(roomId: string, estimation: Estimation): Promise<void>;
    revealEstimation?(roomId: string): Promise<void>;
} 