import { describe, expect } from "vitest";

import JoinRoom from "./JoinRoom";
import { User } from "../entities/types";
import Room from "../entities/Room";

describe("JoinRoom", () => {
  it("should join room", async () => {
    const persistedRepo = { findRoomById: vi.fn(), joinRoom: vi.fn() };
    const roomSettings = new Room(
      "1",
      "New room",
      "fibbonachi",
      [{ id: "1" } as User],
      [],
      null
    );

    persistedRepo.findRoomById.mockResolvedValue(roomSettings);

    const tempRepo = { joinRoom: vi.fn() };
    tempRepo.joinRoom.mockResolvedValue(
      new Room("1", "New room", "fibbonachi", [{ id: "1" } as User], [], null, {
        id: "1",
      } as User)
    );

    const joinRoom = new JoinRoom(persistedRepo, tempRepo);
    const activeRoom = await joinRoom.execute("1", { id: "2" } as User);

    expect(activeRoom.participants).toEqual([
      { id: "1" },
      { id: "2", online: true },
    ]);
  });
});
