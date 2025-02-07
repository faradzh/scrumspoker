import { Server, Socket } from "socket.io";

// let moderatorId: string | undefined;

export function listen(io: Server) {
  io.on("connection", (socket: Socket) => {
    const roomId = socket.handshake.query.roomId!;
    console.log('The user joined the room:', roomId);

    if (roomId) {
      socket.join(roomId);
    }
    
    // socket.on("ready", () => {
    //   if (!moderatorId) {
    //     moderatorId = socket.id;
    //   }
    //   socket.emit("ready", { moderatorId });
    // });

    socket.on("estimation", (data) => {
      socket.to(roomId).emit("estimation", data);
    });

    socket.on("reveal", () => {
      socket.to(roomId).emit("reveal");
    });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected: ", socket.id);
    //   if (moderatorId === socket.id) {
    //     moderatorId = undefined;
    //   }
    // });

    io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  });
}
