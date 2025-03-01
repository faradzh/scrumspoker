import RedisClient from "../../infrastructure/redis/RedisClient";
import RedisRoomRepository from "../repositories/RedisRoomRepository";

export const redisRoomRepository = new RedisRoomRepository(RedisClient);