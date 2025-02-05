import { Request, Response } from "express";
import { Profile } from "passport";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
import InMemoryRoomRepository from "../repositories/InMemoryRoomRepository";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";
import RedisRoomRepository from "../repositories/RedisRoomRepository";
import JoinRoom from "../../useCases/JoinRoom";
import { RoomUseCase } from "../../types";
import RedisClient from "../../infrastructure/redis/RedisClient";
import GetAllRooms from "../../useCases/GetAllRooms";

class RoomController {
    public useCase;
    public roomPresenter;

    public constructor(useCase: RoomUseCase, roomPresenter: RoomPresenter) {
        this.useCase = useCase;
        this.roomPresenter = roomPresenter;
    }

    public async createRoomHandler(req: CreateRoomRequest, res: Response): Promise<void> {
        const initialData = req.validatedBody!;
        try {
            const room = await (this.useCase as CreateRoom).execute(initialData);
            const roomResponse = this.roomPresenter.presentRoom(room);
            res.status(201).json(roomResponse);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    }

    public async getAllRoomsHandler(_: Request, res: Response): Promise<void> {
        try {
            const allRooms = await (this.useCase as GetAllRooms).execute();
            const response = allRooms.map(room => this.roomPresenter.presentRoom(room));
            res.status(200).json(response);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    } 

    public async joinRoomHandler(req: Request, res: Response): Promise<void> {
        const roomId = req.params.id;
        const participant = req.user as Profile;
        try {
            const room = await (this.useCase as JoinRoom).execute(roomId, participant);
            const roomResponse = this.roomPresenter.presentRoom(room);
            res.status(200).json(roomResponse);
        } catch (error) {         
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    };
}

const inMemoryRoomRepository = new InMemoryRoomRepository();

export const createRoomController = new RoomController(new CreateRoom(inMemoryRoomRepository), new ApiRoomPresenter());
export const getAllRoomsController = new RoomController(new GetAllRooms(inMemoryRoomRepository), new ApiRoomPresenter());
export const joinRoomController = new RoomController(new JoinRoom(inMemoryRoomRepository, new RedisRoomRepository(RedisClient)), new ApiRoomPresenter());

export default RoomController;