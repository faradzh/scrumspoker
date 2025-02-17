import { Server, Socket } from "socket.io";
import { estimateTask, revealEstimation } from "./interfaceAdapters/controllers/RoomController";

export function listen(io: Server) {
  io.on("connection", (socket: Socket) => {
    const roomId = socket.handshake.query.roomId as string;
    console.log('The user joined the room:', roomId);

    if (roomId) {
      socket.join(roomId);
    }
    
    socket.on("estimation", (data) => {
      const {selectedCard} = data;

      estimateTask.execute(roomId, {user: selectedCard.user, value: selectedCard.value});
      
      socket.to(roomId).emit("estimation", data);
    });

    socket.on("reveal", (callback) => {
      try {
        revealEstimation.execute(roomId);
        socket.to(roomId).emit("reveal");
        callback({status: "success", message: "The estimation was revealed"});
      } catch (error: unknown) {
        // @ts-ignore
        callback({status: "error", message: error.message});
      }
    });

    io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  });
}
