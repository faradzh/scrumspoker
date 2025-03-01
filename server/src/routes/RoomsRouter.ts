import express from "express";
import path from "path";

import { roomController } from "../interfaceAdapters/controllers/RoomController";
import { CreateRoomSchema, validateRoom } from "../middleware/validationMiddleware";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom(CreateRoomSchema), async (req, res) => {
    roomController.createRoomHandler(req, res);
});

roomsRouter.get("/", async (req, res) => {
    roomController.getAllRoomsHandler(req, res);
});

roomsRouter.get("/:id", async (req, res) => {
    const acceptHeader = req.headers.accept;
    if (acceptHeader && acceptHeader.includes("application/json")) {
        roomController.joinRoomHandler(req, res);
    } else {
        res.sendFile(path.join(__dirname, "..", "..", "public", "room.html"));
    }
});

export default roomsRouter;