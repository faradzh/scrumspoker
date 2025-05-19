import express from "express";

import {
  checkIfIdentified,
  validateRoom,
} from "../middleware/validationMiddleware";
import { roomController } from "../interfaceAdapters/controllers/constants";

const roomsRouter = express.Router();

roomsRouter.post("/", validateRoom, async (req, res) => {
  roomController.createRoomHandler(req, res);
});

roomsRouter.get("/", async (req, res) => {
  roomController.getAllRoomsHandler(req, res);
});

roomsRouter.put("/:id", async (req, res) => {
  roomController.updateRoomHandler(req, res);
});

roomsRouter.delete("/:id", async (req, res) => {
  roomController.deleteRoomHandler(req, res);
});

roomsRouter.get("/:id", checkIfIdentified, async (req, res) => {
  const acceptHeader = req.headers.accept;
  if (acceptHeader && acceptHeader.includes("application/json")) {
    roomController.joinRoomHandler(req, res);
  }
});

export default roomsRouter;
