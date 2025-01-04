import { User } from "../../entities/types";
import { Data } from "./types";

export interface RoomRepository {
    saveRoom(data: unknown): Promise<void>;
    joinRoom(roomId: string, participant: User): Promise<void>;
    findRoomById(roomId: string): Promise<Data>;
    deleteRoom(roomId: string): Promise<void>;
    getAllRooms?(): Promise<[]>;
} 