import { describe, it, expect } from "vitest";

import Room from "./Room";
import { User } from "./types";

describe("Room", () => {
  it("should be able to add participants", () => {
    const room = new Room("id", "RE test room", "fibbonachi", [], [], null);
    const newParticipant = { id: "new id" } as User;
    room.addParticipant(newParticipant);

    expect(room.participants).toContain(newParticipant);
  });
});
