import { EstimationMethod, User } from "./types";

class Room {
    public id;
    public name;
    public estimationMethod;
    public participants;
    public moderator;

    constructor(id: string, name: string, estimationMethod: EstimationMethod, participants: User[] = [], moderator?: User){
        this.id = id;
        this.name = name;
        this.estimationMethod = estimationMethod;
        this.participants = participants;
        this.moderator = moderator;
    }

    public addParticipant(participant: User): void {
        if (this.participants?.includes(participant)) {
            throw new Error('The participant is already in the room!')
        }
        this.participants?.push(participant);
    }

    public removeParticipant(participant: User): void {
        if (!this.participants?.includes(participant)) {
            throw new Error('The participant is NOT in the room!')
        }
        this.participants = this.participants?.filter((p) => p.id != participant.id);;
    }

    public addEstimate(participant: User, estimate: number): void {
        if (!this.participants?.includes(participant)) {
            throw new Error('The participant is NOT in the room!')
        }
        const targetParticipant = this.participants.find((p) => p.id === participant.id);
        if (targetParticipant){
            targetParticipant.estimate = estimate;
        }
    }
}

export default Room;