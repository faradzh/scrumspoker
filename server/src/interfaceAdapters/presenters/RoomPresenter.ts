import { Estimation } from "../../types";

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
    estimates?: Array<Estimation>;
    estimationIsRevealed: boolean;
};

export default RoomPresenter;