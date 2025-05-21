import Room from "../../entities/Room";
import { RoomRepository } from "./RoomRepository";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import { EstimationMethod } from "../../entities/types";
import { RoomData } from "../../types";
import mongoose from "mongoose";
import { IntegrationRepository } from "./IntegrationRepository";
import UserModel from "../../infrastructure/database/mongodb/schemas/UserSchema";

export class MongoRoomRepository implements RoomRepository {
  private integrationRepository;
  private userRepository;

  constructor(
    integrationRepository: IntegrationRepository,
    userRepository: any
  ) {
    this.integrationRepository = integrationRepository;
    this.userRepository = userRepository;
  }

  public async saveRoom(roomData: RoomData): Promise<void> {
    const { moderator } = roomData;

    const user = await this.userRepository.findOrSaveUser({
      id: moderator.id,
    });

    const existing = await RoomModel.findOne({ id: roomData.id });
    if (existing) {
      await RoomModel.updateOne({ id: roomData.id }, roomData);
    } else {
      try {
        await RoomModel.create({ ...roomData, moderator: user._id });
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
    const docs = await RoomModel.find()
      .populate(["integration", "moderator"])
      .lean();
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
