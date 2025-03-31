import { Server, Socket } from "socket.io";
import {
  estimateTask,
  revealEstimation,
} from "./interfaceAdapters/controllers/RoomController";

export function listen(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const roomId = socket.handshake.query.roomId as string;
    console.log("The user joined the room:", roomId);

    socket.on("joinRoom", ({ user }) => {
      if (roomId) {
        socket.join(roomId);
        socket.to(roomId).emit("joinRoom", { user });
      }
    });

    socket.on("leaveRoom", ({ user }) => {
      socket.to(roomId).emit("leaveRoom", { user });
    });

    socket.on("estimation", (data) => {
      const { selectedCard } = data;

      estimateTask.execute(roomId, {
        userId: selectedCard.userId,
        value: selectedCard.value,
      });

      socket.to(roomId).emit("estimation", data);
    });

    socket.on("reveal", (callback) => {
      try {
        revealEstimation.execute(roomId);
        socket.to(roomId).emit("reveal");
        callback({ status: "success", message: "The estimation was revealed" });
      } catch (error: unknown) {
        // @ts-ignore
        callback({ status: "error", message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("The user has left the room!");
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
}
