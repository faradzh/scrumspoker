import express from "express";
import path from "path";

import { checkIfIdentified } from "../middleware/validationMiddleware";

const joinRouter = express.Router();

joinRouter.get("/:id", checkIfIdentified, async (_, res) => {
  return res.sendFile(path.join(__dirname, "..", "..", "public", "room.html"));
});

export default joinRouter;
