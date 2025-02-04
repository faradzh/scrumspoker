import express from "express";
import path from "path";

import { createRoomController, joinRoomController } from "../interfaceAdapters/controllers/RoomController";
import { CreateRoomSchema, validateRoom } from "../middleware/validationMiddleware";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom(CreateRoomSchema), async (req, res) => {
    createRoomController.createRoomHandler(req, res);
});

roomsRouter.get("/:id", async (req, res) => {
    const acceptHeader = req.headers.accept;
    if (acceptHeader && acceptHeader.includes("application/json")) {
        joinRoomController.joinRoomHandler(req, res);
    } else {
        res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
    }
});

export default roomsRouter;