import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { Data } from "../interfaceAdapters/repositories/types";

class CreateRoom {
    private roomRepository;

    constructor(roomRepository: RoomRepository) {
        this.roomRepository = roomRepository;
    }

    public async execute(roomId: string, initialData: Data): Promise<Room> {
        const existingRoom = await this.roomRepository.findRoomById(roomId);

        if (existingRoom) {
            throw new Error('The room already exists!')
        } 

        const newRoom = new Room(roomId, initialData.name, initialData.estimationMethod, initialData.participants);

        await this.roomRepository.saveRoom(newRoom);

        return newRoom;
    }
}

export default CreateRoom;