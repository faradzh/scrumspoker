import { Server, Socket } from "socket.io";
import { estimateTask } from "./interfaceAdapters/controllers/RoomController";

export function listen(io: Server) {
  io.on("connection", (socket: Socket) => {
    const roomId = socket.handshake.query.roomId as string;
    console.log('The user joined the room:', roomId);

    if (roomId) {
      socket.join(roomId);
    }
    
    socket.on("estimation", (data) => {
      const {userId, selectedCard} = data;

      estimateTask.execute(roomId, {userId, value: selectedCard.value});
      
      socket.to(roomId).emit("estimation", data);
    });

    socket.on("reveal", () => {
      socket.to(roomId).emit("reveal");
    });

    io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  });
}
