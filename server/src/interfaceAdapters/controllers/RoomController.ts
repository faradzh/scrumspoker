import { Request, Response } from "express";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";
import JoinRoom from "../../useCases/JoinRoom";
import GetAllRooms from "../../useCases/GetAllRooms";
import EstimateTask from "../../useCases/EstimateTask";
import {
  apiRoomPresenter,
  mongoIntegrationRepository,
  mongoRoomRepository,
  redisRoomRepository,
} from "./constants";
import { RoomRepository } from "../repositories/RoomRepository";
import { RequestUser } from "../../infrastructure/auth/types";
import Session from "../../useCases/Session";
import LeaveRoom from "../../useCases/LeaveRoom";

class RoomController {
  private createRoomUseCase;
  private getAllRoomsUseCase;
  private joinRoomUseCase;
  private roomPresenter;

  public constructor(
    roomRepository: RoomRepository,
    roomPresenter: RoomPresenter
  ) {
    this.createRoomUseCase = new CreateRoom(
      roomRepository,
      mongoIntegrationRepository
    );
    this.getAllRoomsUseCase = new GetAllRooms(roomRepository);
    this.joinRoomUseCase = new JoinRoom(roomRepository, redisRoomRepository);
    this.roomPresenter = roomPresenter;
  }

  public async createRoomHandler(
    req: CreateRoomRequest,
    res: Response
  ): Promise<void> {
    const formData = req.validatedBody!;

    const user = req.user as RequestUser;
    const moderator = user.profile;

    try {
      const room = await this.createRoomUseCase.execute(
        {
          ...formData,
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

export default RoomController;
