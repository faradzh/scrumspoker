import { Request, Response } from "express";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";
import JoinRoom from "../../useCases/JoinRoom";
import GetAllRooms from "../../useCases/GetAllRooms";
import {
  mongoIntegrationRepository,
  mongoUserRepository,
  redisRoomRepository,
  testIntegrationUseCase,
} from "./constants";
import { RoomRepository } from "../repositories/RoomRepository";
import { RequestUser } from "../../infrastructure/auth/types";
import DeleteRoom from "../../useCases/DeleteRoom";
import UpdateRoom from "../../useCases/UpdateRoom";

class RoomController {
  private createRoomUseCase;
  private getAllRoomsUseCase;
  private joinRoomUseCase;
  private updateRoomUseCase;
  private deleteRoomUseCase;
  private roomPresenter;

  public constructor(
    roomRepository: RoomRepository,
    roomPresenter: RoomPresenter
  ) {
    this.createRoomUseCase = new CreateRoom(
      roomRepository,
      mongoIntegrationRepository,
      mongoUserRepository,
      testIntegrationUseCase
    );
    this.getAllRoomsUseCase = new GetAllRooms(roomRepository);
    this.joinRoomUseCase = new JoinRoom(roomRepository, redisRoomRepository);
    this.updateRoomUseCase = new UpdateRoom(roomRepository);
    this.deleteRoomUseCase = new DeleteRoom(roomRepository);
    this.roomPresenter = roomPresenter;
  }

  public async createRoomHandler(
    req: CreateRoomRequest,
    res: Response
  ): Promise<void> {
    const formData = req.validatedBody!;
    const user = req.user as RequestUser;

    try {
      const room = await this.createRoomUseCase.execute(formData, user);
      const roomResponse = this.roomPresenter.presentRoom(room);
      res.status(201).json(roomResponse);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async updateRoomHandler(req: Request, res: Response): Promise<void> {
    const roomId = req.params.id;
    const formData = req.body;

    try {
      const room = await this.updateRoomUseCase.execute(roomId, formData);
      const roomResponse = this.roomPresenter.presentRoom(room);
      res.status(200).json(roomResponse);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async deleteRoomHandler(req: Request, res: Response): Promise<void> {
    const roomId = req.params.id;
    try {
      await this.deleteRoomUseCase.execute(roomId);
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async getAllRoomsHandler(req: Request, res: Response): Promise<void> {
    const user = req.user as RequestUser;
    const moderator = user?.profile;
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

export default RoomController;
