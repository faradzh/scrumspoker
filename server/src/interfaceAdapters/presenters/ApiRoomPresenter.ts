import Room from "../../entities/Room";
import RoomPresenter, { RoomResponse } from "./RoomPresenter";

class ApiRoomPresenter implements RoomPresenter {
    public presentRoom(room: Room): RoomResponse {
        return {
            id: room.id,
            name: room?.name ?? '',
            estimationMethod: room?.estimationMethod ?? '',
            participants: room?.participants?.length ?? 0
        }
    }
}

export default ApiRoomPresenter;