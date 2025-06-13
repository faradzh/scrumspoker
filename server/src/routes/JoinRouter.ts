import express from "express";
import path from "path";

import { checkIfIdentified } from "../middleware/validationMiddleware";
import { mongoRoomRepository } from "../interfaceAdapters/controllers/constants";

const joinRouter = express.Router();

joinRouter.get("/:id", checkIfIdentified, async (req, res) => {
  const roomId = req.params.id;
  const roomSettings = await mongoRoomRepository.findRoomById?.(roomId);
  if (roomSettings) {
    return res.sendFile(
      path.join(__dirname, "..", "..", "public", "room.html")
    );
  }
  res
    .status(404)
    .sendFile(path.join(__dirname, "..", "..", "public", "404.html"));
});

export default joinRouter;
