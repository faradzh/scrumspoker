import https from "https";
import http from "http";
import fs from "fs";
import {Server} from "socket.io";

require("dotenv").config();

import api from "./api";
import * as sockets from "./sockets";

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH ?? "certs/fullchain1.pem"),
  key: fs.readFileSync(process.env.KEY_PATH ?? "certs/privkey1.pem"),
};

const isProduction = process.env.NODE_ENV === 'production';

let server;

if (isProduction) {
  server = https.createServer(options, api);
} else {
  server = http.createServer(api);
}

const PORT = isProduction ? process.env.HTTPS_PORT : process.env.HTTP_PORT;

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});

const io = new Server(server, {transports: ['websocket']});

sockets.listen(io);
