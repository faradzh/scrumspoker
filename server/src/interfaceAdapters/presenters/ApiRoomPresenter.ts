import Room from "../../entities/Room";
import RoomPresenter, { RoomResponse } from "./RoomPresenter";

class ApiRoomPresenter implements RoomPresenter {
  public presentRoom(room: Room): RoomResponse {
    return {
      id: room.id,
      name: room?.name ?? "",
      estimationMethod: room?.estimationMethod ?? "",
      participants: room?.participants ?? [],
      link: `/rooms/${room?.id}`,
      moderatorId: room?.moderator?.id ?? "",
      estimates: room.estimates,
      estimatedIssues: room.estimatedIssues ?? [],
      currentIssue: room.currentIssue,
    };
  }
}

export default ApiRoomPresenter;
