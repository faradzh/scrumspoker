import Redis from 'ioredis-mock';
import { describe, expect } from "vitest";

import RedisRoomRepository from './RedisRoomRepository';
import Room from '../../entities/Room';
import { EstimationMethod, User } from '../../entities/types';

describe('RedisRoomRepository', () => {
    const redis = new Redis();
    const redisRoomRepository = new RedisRoomRepository(redis);

    beforeEach(() => {
        redis.flushall();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should save room', () => {
        const room = new Room('1', 'Room 1', 'fibonacci' as EstimationMethod, [{ id: '1' } as User, {id: '2'} as User], { id: '1' } as User);
        redisRoomRepository.saveRoom(room);

        redis.hgetall('room:1', (err, res) => {
            expect(res).toEqual({
                name: 'Room 1',
                estimationMethod: 'fibonacci',
                moderatorId: '1'
            });
        });

        redis.smembers('room:1:participants', (err, res) => {
            expect(res).toEqual(['{"id":"1"}', '{"id":"2"}']);
        });

        redis.get('room:1:estimationIsRevealed', (err, res) => {
            expect(res).toEqual('0');
        });            
    });

    it('should find room by id', () => {
        const room = new Room('1', 'Room 1', 'fibonacci' as EstimationMethod, [{ id: '1' } as User, {id: '2'} as User], { id: '1' } as User);
        redisRoomRepository.saveRoom(room);

        redisRoomRepository.findRoomById('1').then((res) => {
            expect(res).toEqual(room);
        });
    });

    it('should join room for the first time', async () => {
        const roomEntity = new Room('1', 'Room 1', 'fibonacci' as EstimationMethod, [{ id: '1' } as User, {id: '2'} as User], { id: '1' } as User);

        const foundRoom = await redisRoomRepository.joinRoom(roomEntity);

        expect(foundRoom).toEqual(roomEntity);
        
        redis.hgetall('room:1', (err, res) => {
            expect(res).toEqual({
                name: 'Room 1',
                estimationMethod: 'fibonacci',
                moderatorId: '1'
            });
        });
    });
});