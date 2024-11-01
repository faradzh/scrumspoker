let moderatorId;

function listen(io) {
  io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`);

    socket.on("ready", () => {
      if (!moderatorId) {
        moderatorId = socket.id;
      }
      socket.emit("ready", { moderatorId });
    });

    socket.on("estimation", (data) => {
      socket.broadcast.emit("estimation", data);
    });

    socket.on("reveal", () => {
      socket.broadcast.emit("reveal");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);
      if (moderatorId === socket.id) {
        moderatorId = undefined;
      }
    });
  });
}

module.exports = { listen };
