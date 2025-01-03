import https  from "https";
import fs from "fs";

import api from "./api";
import * as sockets from "./sockets";

require("dotenv").config();

const PORT = process.env.PORT;

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH ?? "certs/fullchain1.pem"),
  key: fs.readFileSync(process.env.KEY_PATH ?? "certs/privkey1.pem"),
};

const server = https.createServer(options, api);
const io = require("socket.io")(server);

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});

sockets.listen(io);
