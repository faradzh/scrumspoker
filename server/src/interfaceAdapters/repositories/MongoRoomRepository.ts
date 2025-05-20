import Room from "../../entities/Room";
import { RoomRepository } from "./RoomRepository";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import { EstimationMethod } from "../../entities/types";
import { RoomData } from "../../types";
import mongoose, { mongo } from "mongoose";
import { IntegrationRepository } from "./IntegrationRepository";

export class MongoRoomRepository implements RoomRepository {
  private integrationRepository;

  constructor(integrationRepository: IntegrationRepository) {
    this.integrationRepository = integrationRepository;
  }

  public async saveRoom(roomData: RoomData): Promise<void> {
    // @ts-ignore
    const existing = await RoomModel.findOne({ id: roomData.id });

    if (existing) {
      // @ts-ignore
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

  public async updateRoom(roomData: RoomData): Promise<Room | undefined> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedRoom = await RoomModel.findOneAndUpdate(
        // @ts-ignore
        { id: roomData.id },
        {
          $set: {
            name: roomData.name,
          },
        },
        { new: true, runValidators: true, session }
      ).populate("integration");

      if (!updatedRoom) {
        throw new Error("Room not found");
      }

      const updatedIntegration = await this.integrationRepository.update({
        ...roomData.integration,
        id: updatedRoom?.integration?._id,
      });

      await session.commitTransaction();

      return new Room(
        updatedRoom.id,
        updatedRoom.name,
        updatedRoom.estimationMethod as EstimationMethod,
        [],
        [],
        null,
        // @ts-ignore
        updatedRoom.moderator,
        updatedIntegration
      );
    } catch (error) {
      console.error("Error updating room", error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
    const docs = await RoomModel.find().populate("integration").lean();
    if (!docs) return [];

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
          doc.moderator,
          doc.integration
        )
    );
  }
}
