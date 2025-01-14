import { v4 as uuidv4 } from 'uuid';

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from '../types';

class CreateRoom {
    private roomRepository;

    constructor(roomRepository: RoomRepository) {
        this.roomRepository = roomRepository;
    }

    public async execute(initialData: RoomData): Promise<Room> {
        const roomId = uuidv4();

        const newRoom = new Room(roomId, initialData.name, initialData.estimationMethod);

        await this.roomRepository.saveRoom(newRoom);

        return newRoom;
    }
}

export default CreateRoom;