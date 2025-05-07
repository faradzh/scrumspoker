import Room from "../../entities/Room";
import { RoomRepository } from "./RoomRepository";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import { EstimationMethod } from "../../entities/types";
import { RoomData } from "../../types";

export class MongoRoomRepository implements RoomRepository {
  public async saveRoom(roomData: RoomData): Promise<void> {
    const existing = await RoomModel.findOne({ id: roomData.id });

    if (existing) {
      await RoomModel.updateOne({ id: roomData.id }, roomData);
    } else {
      try {
        console.log("Creating new room with data", roomData);
        await RoomModel.create(roomData);
      } catch (error) {
        console.error("Error creating room", error);
      }
    }
  }

  public async deleteRoom(roomId: string): Promise<void> {
    const deleted = await RoomModel.findOneAndDelete({ id: roomId });
    if (!deleted) {
      throw new Error("The room doesn't exist!");
    }
  }

  public async findRoomById(roomId: string): Promise<Room | undefined> {
    const doc = await RoomModel.findOne<Room>({ id: roomId }).lean();
    if (!doc) return;

    return new Room(
      doc.id,
      doc.name,
      doc.estimationMethod as EstimationMethod,
      [],
      [],
      null,
      // @ts-ignore
      doc.moderator
    );
  }

  public async getAllRooms(): Promise<Room[]> {
    const docs = await RoomModel.find().lean();
    if (!docs) return [];

    // @ts-ignore
    return docs.map(
      (doc) =>
        new Room(
          doc.id,
          doc.name,
          doc.estimationMethod as EstimationMethod,
          [],
          [],
          null,
          // @ts-ignore
          doc.moderator
        )
    );
  }
}
