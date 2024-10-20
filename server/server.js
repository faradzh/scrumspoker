const https = require("https");
const fs = require("fs");

const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT;

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH),
  key: fs.readFileSync(process.env.KEY_PATH),
};

const server = https.createServer(options, app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(`A user ${socket.id} connected`);

  socket.on("estimation", (data) => {
    socket.broadcast.emit("estimation", data);
  });
});

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});
