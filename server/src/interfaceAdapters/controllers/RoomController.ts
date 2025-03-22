import { Request, Response } from "express";
import { Profile } from "passport";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
import InMemoryRoomRepository from "../repositories/InMemoryRoomRepository";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";
import JoinRoom from "../../useCases/JoinRoom";
import GetAllRooms from "../../useCases/GetAllRooms";
import EstimateTask from "../../useCases/EstimateTask";
import RevealEstimation from "../../useCases/RevealEstimation";
import Integration from "../../useCases/Integration";
import { redisRoomRepository } from "./constants";
import { RoomRepository } from "../repositories/RoomRepository";
import { IntegrationRepository } from "../repositories/IntegrationRepository";
import { IntegrationRequestData } from "../../entities/Integration";
import RedisRoomRepository from "../repositories/RedisRoomRepository";
import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";

class RoomController {
    private createRoomUseCase;
    private integrationUseCases;
    private getAllRoomsUseCase;
    private joinRoomUseCase;
    private roomPresenter;

    public constructor(roomRepository: RoomRepository, redisRoomRepository: RedisRoomRepository, integrationRepository: IntegrationRepository, roomPresenter: RoomPresenter) {
        this.createRoomUseCase = new CreateRoom(roomRepository);
        this.integrationUseCases = new Integration(integrationRepository);
        this.getAllRoomsUseCase = new GetAllRooms(roomRepository);
        this.joinRoomUseCase = new JoinRoom(roomRepository, redisRoomRepository);
        this.roomPresenter = roomPresenter;
    }

    public async createRoomHandler(req: CreateRoomRequest, res: Response): Promise<void> {
        const initialData = req.validatedBody!;
        const moderator = req.user as Profile;
        try {
            const room = await this.createRoomUseCase.execute({...initialData, moderator});
            if (initialData.integration) {
                await this.integrationUseCases.addIntegration(room.id, initialData.integration as IntegrationRequestData);
            }
            const roomResponse = this.roomPresenter.presentRoom(room);
            res.status(201).json(roomResponse);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    }

    public async getAllRoomsHandler(_: Request, res: Response): Promise<void> {
        try {
            const allRooms = await this.getAllRoomsUseCase.execute();
            const response = allRooms?.map(room => this.roomPresenter.presentRoom(room));
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
            const room = await this.joinRoomUseCase.execute(roomId, participant);
            const roomResponse = this.roomPresenter.presentRoom(room);
            res.status(200).json(roomResponse);
        } catch (error) {         
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    };
}

const inMemoryRoomRepository = new InMemoryRoomRepository();
const apiRoomPresenter = new ApiRoomPresenter();
export const inMemoryIntegrationRepository = new InMemoryIntegrationRepository();

export const roomController = new RoomController(inMemoryRoomRepository, redisRoomRepository, inMemoryIntegrationRepository, apiRoomPresenter);

export const estimateTask = new EstimateTask(redisRoomRepository);
export const revealEstimation = new RevealEstimation(redisRoomRepository);

export default RoomController;