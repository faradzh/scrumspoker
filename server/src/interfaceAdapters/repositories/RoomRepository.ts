import Room from "../../entities/Room";
import { RoomData } from "../../types";

export interface RoomRepository {
    saveRoom?(data: unknown): Promise<void>;
    joinRoom?(room: Room): Promise<void>;
    findRoomById?(roomId: string): Promise<RoomData | undefined>;
    deleteRoom?(roomId: string): Promise<void>;
    getAllRooms?(): Promise<Room[]>;
} 