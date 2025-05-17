import RedisClient from "../../infrastructure/redis/RedisClient";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import MongoIntegrationRepository from "../repositories/MongoIntegrationRepository";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";
import RedisRoomRepository from "../repositories/RedisRoomRepository";

export const redisRoomRepository = new RedisRoomRepository(RedisClient);
export const mongoIntegrationRepository = new MongoIntegrationRepository();
export const mongoRoomRepository = new MongoRoomRepository(
  mongoIntegrationRepository
);
export const apiRoomPresenter = new ApiRoomPresenter();
