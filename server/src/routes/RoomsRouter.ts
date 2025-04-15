import express from "express";

import { roomController } from "../interfaceAdapters/controllers/RoomController";
import {
  checkIfIdentified,
  validateRoom,
} from "../middleware/validationMiddleware";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom, async (req, res) => {
  roomController.createRoomHandler(req, res);
});

roomsRouter.get("/", async (req, res) => {
  roomController.getAllRoomsHandler(req, res);
});

roomsRouter.get("/:id", checkIfIdentified, async (req, res) => {
  const acceptHeader = req.headers.accept;
  if (acceptHeader && acceptHeader.includes("application/json")) {
    roomController.joinRoomHandler(req, res);
  }
});

export default roomsRouter;
