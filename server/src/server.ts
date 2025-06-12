import http from "http";
import { Server } from "socket.io";

require("dotenv").config();

import api from "./api";
import * as sockets from "./sockets";
import { connectDB } from "./infrastructure/database/mongodb";

const PORT = process.env.HTTP_PORT;

async function startServer() {
  const server = http.createServer(api);

  await connectDB();

  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}...`);
  });

  const io = new Server(server, { transports: ["websocket"] });

  sockets.listen(io);
}

startServer();
