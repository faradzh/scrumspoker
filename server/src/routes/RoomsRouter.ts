import express from "express";

import { createRoomController } from "../interfaceAdapters/controllers/RoomController";
import { CreateRoomSchema, validateRoom } from "../middleware/validationMiddleware";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom(CreateRoomSchema), async (req, res) => {
    createRoomController.createRoomHandler(req, res);
});

export default roomsRouter;