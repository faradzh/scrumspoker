import { Integration } from "../../entities/Integration";
import Room from "../../entities/Room";
import RoomPresenter, { RoomResponse } from "./RoomPresenter";

class ApiRoomPresenter implements RoomPresenter {
  public presentRoom(room: Room): RoomResponse {
    const response = {
      id: room.id,
      name: room?.name ?? "",
      estimationMethod: room?.estimationMethod ?? "",
      participants: room?.participants ?? [],
      link: `/rooms/${room?.id}`,
      moderatorId: room?.moderator?.id ?? "",
      estimates: room.estimates,
      revealedIssues: room.revealedIssues ?? [],
      estimatedIssues: room.estimatedIssues ?? [],
      totalEstimationPerIssue: room.totalEstimationPerIssue ?? {},
      currentIssue: room.currentIssue,
    } as RoomResponse;

    if (room.integration) {
      response.integration = {
        // @ts-ignore
        id: room.integration?.type ?? "",
        filterLabel: room.integration?.filterLabel ?? "",
        projectName: room.integration?.projectName ?? "",
      } as Integration;
    }

    return response;
  }
}

export default ApiRoomPresenter;
