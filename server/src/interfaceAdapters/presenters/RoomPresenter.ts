interface RoomPresenter {
    presentRoom(data: unknown): void;
};

export type RoomResponse = {
    id: string;
    name: string;
    estimationMethod: string;
    participants: number;
    link: string;
    moderatorId: string;
};

export default RoomPresenter;