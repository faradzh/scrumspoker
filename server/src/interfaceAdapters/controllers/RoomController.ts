import { Request, Response } from "express";

import CreateRoom from "../../useCases/CreateRoom";
import RoomPresenter from "../presenters/RoomPresenter";
import InMemoryRoomRepository from "../repositories/InMemoryRoomRepository";
import ApiRoomPresenter from "../presenters/ApiRoomPresenter";
import { CreateRoomRequest } from "../../middleware/validationMiddleware";

class RoomController {
    public createRoom;
    public roomPresenter;

    public constructor(createRoom: CreateRoom, roomPresenter: RoomPresenter) {
        this.createRoom = createRoom;
        this.roomPresenter = roomPresenter;
    }

    public async createRoomHandler(req: CreateRoomRequest, res: Response): Promise<void> {
        const initialData = req.validatedBody!;
        try {
            const room = await this.createRoom.execute(initialData);
            const roomResponse = this.roomPresenter.presentRoom(room);
            res.status(201).json(roomResponse);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({message: error.message});
        }
    }
}


export const createRoomController = new RoomController(new CreateRoom(new InMemoryRoomRepository()), new ApiRoomPresenter());

export default RoomController;