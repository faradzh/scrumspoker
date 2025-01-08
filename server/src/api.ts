import express from "express";
import path from "path";

import roomsRouter from "./routes/RoomsRouter";

const api = express();

api.use(express.static(path.join(__dirname,  "../", "public")));
api.use(express.json());

api.use('/rooms', roomsRouter);

api.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public",  "../", "index.html"));
});

api.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "public",  "../", "admin.html"));
});


export default api;