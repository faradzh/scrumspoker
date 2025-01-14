import https from "https";
import http from "http";
import fs from "fs";

require("dotenv").config();

import api from "./api";
import * as sockets from "./sockets";


const PORT = process.env.PORT;

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

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});

const io = require("socket.io")(server);

sockets.listen(io);
