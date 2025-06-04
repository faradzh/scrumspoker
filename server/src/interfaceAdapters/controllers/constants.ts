import RedisClient from "../../infrastructure/redis/RedisClient";
import EstimateTask from "../../useCases/EstimateTask";
import GetAllIssues from "../../useCases/GetAllIssues";
import LeaveRoom from "../../useCases/LeaveRoom";
import RefreshTokens from "../../useCases/RefreshTokens";
import ResetEstimation from "../../useCases/ResetEstimation";
import Session from "../../useCases/Session";
import TestIntegration from "../../useCases/TestIntegration";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import MongoIntegrationRepository from "../repositories/MongoIntegrationRepository";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";
import MongoUserRepository from "../repositories/MongoUserRepository";
import RedisRoomRepository from "../repositories/RedisRoomRepository";
import RoomController from "./RoomController";

export const redisRoomRepository = new RedisRoomRepository(RedisClient);
export const mongoIntegrationRepository = new MongoIntegrationRepository();
export const mongoUserRepository = new MongoUserRepository();

export const mongoRoomRepository = new MongoRoomRepository(
  mongoIntegrationRepository,
  mongoUserRepository
);

export const refreshTokens = new RefreshTokens(mongoUserRepository);

export const testIntegrationUseCase = new TestIntegration();

export const getAllIssues = new GetAllIssues(
  mongoIntegrationRepository,
  redisRoomRepository,
  mongoRoomRepository
);

export const apiRoomPresenter = new ApiRoomPresenter();

export const roomController = new RoomController(
  mongoRoomRepository,
  apiRoomPresenter
);

export const estimateTask = new EstimateTask(redisRoomRepository);
export const leaveRoom = new LeaveRoom(
  mongoRoomRepository,
  redisRoomRepository
);
export const session = new Session(redisRoomRepository);
export const resetEstimation = new ResetEstimation(redisRoomRepository);
