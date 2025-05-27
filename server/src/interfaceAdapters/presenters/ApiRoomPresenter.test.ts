import { describe, it, expect } from "vitest";

import ApiRoomPresenter from "./ApiRoomPresenter";
import Room from "../../entities/Room";

describe("ApiRoomPresenter", () => {
  it("should present room data in API format", () => {
    const roomData = {
      id: "room#1",
      name: "RE room#1",
      participants: [],
      estimationMethod: "fibbonachi",
    } as const;

    const room = new Room(
      roomData.id,
      roomData.name,
      roomData.estimationMethod,
      [],
      [],
      [],
      null
    );

    const roomResponse = new ApiRoomPresenter().presentRoom(room);

    expect(roomResponse).toEqual({
      id: roomData.id,
      estimates: {},
      name: "RE room#1",
      estimationMethod: "fibbonachi",
      participants: [],
      moderatorId: "",
      link: `/rooms/${roomData.id}`,
      estimatedIssues: [],
      currentIssue: null,
    });
  });
});
