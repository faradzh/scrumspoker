import { describe, it, expect } from 'vitest';

import Room from './Room';

describe('Room', () => {
    it('should be able to add participants', () => {
        const room = new Room('id', 'RE test room', 'fibbonachi');
        const newParticipant = {id: 'new id'};
        room.addParticipant(newParticipant);
        
        expect(room.participants).toContain(newParticipant);
    })
})