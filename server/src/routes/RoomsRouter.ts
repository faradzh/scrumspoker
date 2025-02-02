import express from "express";

import { createRoomController, joinRoomController } from "../interfaceAdapters/controllers/RoomController";
import { CreateRoomSchema, validateRoom } from "../middleware/validationMiddleware";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom(CreateRoomSchema), async (req, res) => {
    createRoomController.createRoomHandler(req, res);
});

roomsRouter.post("/:id", async (req, res) => {
    joinRoomController.joinRoomHandler(req, res);
});

export default roomsRouter;