import { Estimation } from "../types";
import { EstimationMethod, User } from "./types";

class Room {
    public id;
    public name;
    public estimationMethod;
    public participants;
    public moderator;
    public estimates: Array<Estimation>;
    public estimationIsRevealed: boolean;

    constructor(id: string, name: string, estimationMethod: EstimationMethod, participants: User[] = [], moderator?: User, estimationIsRevealed: boolean = false) {
        this.id = id;
        this.name = name;
        this.estimationMethod = estimationMethod;
        this.participants = participants;
        this.moderator = moderator;
        this.estimates = [];
        this.estimationIsRevealed = estimationIsRevealed;
    }

    public addParticipant(participant: User): void {
        if (this.participants.find((p) => p.id === participant.id)) {
           return;
        }
        this.participants?.push(participant);
    }

    public removeParticipant(participant: User): void {
        const targetParticipant = this.participants.find((p) => p.id === participant.id);
        if (!targetParticipant) {
            return;
         }
        this.participants = this.participants?.filter((p) => p.id != participant.id);;
    }

    public hasParticipant(participant: User): boolean {
        return !!this.participants.find((p) => p.id === participant.id);
    }

    public addEstimate(estimation: Estimation): void {
        const targetParticipant = this.participants.find((p) => p.id === estimation.userId);
        if (!targetParticipant) {
            throw new Error('The participant is NOT in the room!')
        }
        this.estimates.push(estimation);
    }

    public userHasEstimated(userId: string): boolean {
        return !!this.estimates.find((e) => e.userId === userId);
    }
}

export default Room;