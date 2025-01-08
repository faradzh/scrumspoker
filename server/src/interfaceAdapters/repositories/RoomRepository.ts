import { User } from "../../entities/types";
import { RoomData } from "./types";

export interface RoomRepository {
    saveRoom(data: unknown): Promise<void>;
    joinRoom(roomId: string, participant: User): Promise<void>;
    findRoomById(roomId: string): Promise<RoomData>;
    deleteRoom(roomId: string): Promise<void>;
    getAllRooms?(): Promise<[]>;
} 