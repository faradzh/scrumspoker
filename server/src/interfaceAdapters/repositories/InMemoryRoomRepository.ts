import Room from "../../entities/Room";
import {  User } from "../../entities/types";
import { RoomRepository } from "./RoomRepository";

class InMemoryRoomRepository implements RoomRepository {
    private client = new Map();

    public async saveRoom(data: Room): Promise<void> {
        const {id} = data;
        this.client.set(id, data);
    }

    public async deleteRoom(roomId: string): Promise<void> {
        if (!this.client.get(roomId)) {
            throw new Error("The room doesn't exists!");
        } 
        this.client.delete(roomId);
    }

    // public async joinRoom(data: Room): Promise<void> {
    //     if (!this.client.get(data.id)) {
    //         throw new Error("The room doesn't exists!");
    //     } 
    //     const room = this.client.get(data.id);
    //     room.participants.push(participant);
    // }

    public async findRoomById(roomId: string): Promise<Room> {
        return this.client.get(roomId);
    }
    
    public async getAllRooms(): Promise<Room[]> {
        return Array.from(this.client.values());
    }
}

export default InMemoryRoomRepository;