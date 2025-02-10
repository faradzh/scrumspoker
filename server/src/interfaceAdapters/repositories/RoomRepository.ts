import Room from "../../entities/Room";
import { User } from "../../entities/types";
import { Estimation } from "../../types";

export interface RoomRepository {
    saveRoom?(data: unknown): Promise<Room | void>;
    joinRoom?(room: Room, participant: User): Promise<Room | undefined>;
    findRoomById?(roomId: string): Promise<Room | undefined>;
    deleteRoom?(roomId: string): Promise<void>;
    getAllRooms?(): Promise<Room[]>;
    addEstimate?(roomId: string, estimation: Estimation): Promise<void>;
    revealEstimation?(roomId: string): Promise<void>;
} 