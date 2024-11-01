const https = require("https");
const fs = require("fs");

const api = require("./api");
const sockets = require("./sockets");

require("dotenv").config();

const PORT = process.env.PORT;

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH),
  key: fs.readFileSync(process.env.KEY_PATH),
};

const server = https.createServer(options, api);
const io = require("socket.io")(server);

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});

sockets.listen(io);
