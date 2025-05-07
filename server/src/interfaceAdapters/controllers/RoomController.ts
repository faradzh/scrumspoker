import { Request, Response } from "express";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
// import InMemoryRoomRepository from "../repositories/InMemoryRoomRepository";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";
import JoinRoom from "../../useCases/JoinRoom";
import GetAllRooms from "../../useCases/GetAllRooms";
import EstimateTask from "../../useCases/EstimateTask";
// import Integration from "../../useCases/AddIntegration";
import { redisRoomRepository } from "./constants";
import { RoomRepository } from "../repositories/RoomRepository";
import { IntegrationRepository } from "../repositories/IntegrationRepository";
import RedisRoomRepository from "../repositories/RedisRoomRepository";
// import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";
import { RequestUser } from "../../infrastructure/auth/types";
import Session from "../../useCases/Session";
import LeaveRoom from "../../useCases/LeaveRoom";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";
import MongoIntegrationRepository from "../repositories/MongoIntegrationRepository";

class RoomController {
  private createRoomUseCase;
  // private integrationUseCases;
  private getAllRoomsUseCase;
  private joinRoomUseCase;
  private roomPresenter;

  public constructor(
    roomRepository: RoomRepository,
    integrationRepository: IntegrationRepository,
    roomPresenter: RoomPresenter
  ) {
    this.createRoomUseCase = new CreateRoom(
      roomRepository,
      integrationRepository
    );
    // this.integrationUseCases = new Integration(integrationRepository);
    this.getAllRoomsUseCase = new GetAllRooms(roomRepository);
    this.joinRoomUseCase = new JoinRoom(roomRepository, redisRoomRepository);
    this.roomPresenter = roomPresenter;
  }

  public async createRoomHandler(
    req: CreateRoomRequest,
    res: Response
  ): Promise<void> {
    const initialData = req.validatedBody!;

    const user = req.user as RequestUser;
    const moderator = user.profile;

    try {
      const room = await this.createRoomUseCase.execute(
        {
          ...initialData,
          moderator,
        },
        user
      );

      const roomResponse = this.roomPresenter.presentRoom(room);
      res.status(201).json(roomResponse);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async getAllRoomsHandler(req: Request, res: Response): Promise<void> {
    const user = req.user as RequestUser;
    const moderator = user.profile;
    try {
      const allRooms = await this.getAllRoomsUseCase.execute(moderator);
      const response = allRooms?.map((room) =>
        this.roomPresenter.presentRoom(room)
      );
      res.status(200).json(response);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async joinRoomHandler(req: Request, res: Response): Promise<void> {
    const roomId = req.params.id;
    const participant =
      (req.user as RequestUser)?.profile || req.session?.guestUser;
    try {
      const room = await this.joinRoomUseCase.execute(roomId, participant);
      const roomResponse = this.roomPresenter.presentRoom(room);
      res.status(200).json(roomResponse);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

const mongoRoomRepository = new MongoRoomRepository();
const apiRoomPresenter = new ApiRoomPresenter();
export const mongoIntegrationRepository = new MongoIntegrationRepository();

export const roomController = new RoomController(
  mongoRoomRepository,
  mongoIntegrationRepository,
  apiRoomPresenter
);

export const estimateTask = new EstimateTask(redisRoomRepository);
export const leaveRoom = new LeaveRoom(
  mongoRoomRepository,
  redisRoomRepository
);
export const session = new Session(redisRoomRepository);

export default RoomController;
