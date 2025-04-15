import { Server, Socket } from "socket.io";
import {
  estimateTask,
  leaveRoom,
  session,
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
      const timeout = setTimeout(() => {
        leaveRoom.execute(roomId, user);
      }, 5000);
      // @ts-ignore
      global._timeout = timeout;
    });

    socket.on("issueSelect", ({ id }) => {
      session.setCurrentIssue(roomId, id);
      socket.to(roomId).emit("issueSelect", { id });
    });

    socket.on("estimation", (data) => {
      const { selectedCard } = data;

      estimateTask.execute(roomId, {
        userId: selectedCard.userId,
        value: selectedCard.value,
        issueId: selectedCard.issueId,
      });

      socket.to(roomId).emit("estimation", data);
    });

    socket.on("reveal", ({ issueId }, callback) => {
      try {
        session.revealEstimation(roomId, issueId);
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
