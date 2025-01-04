import { describe, it, expect } from 'vitest';

import InMemoryRoomRepository from '../interfaceAdapters/repositories/InMemoryRoomRepository';
import CreateRoom from './CreateRoom';

describe('CreateRoom', () => {
    it('should create a new room entity and add it to the store', async () => {
        const roomRepository = new InMemoryRoomRepository();
        const createRoom = new CreateRoom(roomRepository);

        const roomData = {roomId: 'room#1', name: 'RE room#1', participants: [], estimationMethod: 'fibbonachi' as const};

        const newRoom = await createRoom.execute(roomData.roomId, roomData);
        
        expect(newRoom.id).toEqual(roomData.roomId);
    });

    it('should throw an error if the room already exists', async () => {
        const roomData = {roomId: 'room#1', name: 'RE room#1', participants: [], estimationMethod: 'fibbonachi' as const};
        const roomRepository = new InMemoryRoomRepository();

        const createRoom = new CreateRoom(roomRepository);

        await createRoom.execute(roomData.roomId, roomData);

        // creating duplicate room
        await expect(createRoom.execute(roomData.roomId, roomData)).rejects.toThrow('The room already exists!');
    });
})