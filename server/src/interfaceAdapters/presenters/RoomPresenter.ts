import { User } from "../../entities/types";
import { Estimation } from "../../types";

interface RoomPresenter {
    presentRoom(data: unknown): void;
};

export type RoomResponse = {
    id: string;
    name: string;
    estimationMethod: string;
    participants: Array<User>;
    link: string;
    moderatorId: string;
    estimates?: Array<Estimation>;
    estimationIsRevealed: boolean;
};

export default RoomPresenter;