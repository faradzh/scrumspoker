import { describe, it, expect } from "vitest";

import InMemoryRoomRepository from "./InMemoryRoomRepository";
import Room from "../../entities/Room";

describe("InMemoryRoomRepository", () => {
  it("should save rooms to in-memory store", async () => {
    const roomRepository = new InMemoryRoomRepository();
    const roomData = {
      roomId: "room#1",
      name: "RE room#1",
      participants: [],
      estimationMethod: "fibbonachi" as const,
    };
    const newRoom = new Room(
      roomData.roomId,
      roomData.name,
      roomData.estimationMethod,
      [],
      [],
      null
    );

    roomRepository.saveRoom(newRoom);

    expect(await roomRepository.findRoomById(roomData.roomId)).toBeDefined();
  });

  it("should delete rooms from in-memory store", async () => {
    const roomRepository = new InMemoryRoomRepository();
    const roomData = {
      roomId: "room#1",
      name: "RE room#1",
      participants: [],
      estimationMethod: "fibbonachi" as const,
    };
    const newRoom = new Room(
      roomData.roomId,
      roomData.name,
      roomData.estimationMethod,
      [],
      [],
      null
    );

    roomRepository.saveRoom(newRoom);
    roomRepository.deleteRoom(roomData.roomId);

    expect(await roomRepository.findRoomById(roomData.roomId)).toBeUndefined();
  });
});
