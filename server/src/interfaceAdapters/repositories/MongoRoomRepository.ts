import UserModel from "../../infrastructure/database/mongodb/schemas/UserSchema";

import Room from "../../entities/Room";
import { RoomRepository } from "./RoomRepository";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import { EstimationMethod } from "../../entities/types";
import { RoomData } from "../../types";
import { RequestUser } from "../../infrastructure/auth/types";
import mongoose, { mongo } from "mongoose";
import { IntegrationRepository } from "./IntegrationRepository";

export class MongoRoomRepository implements RoomRepository {
  private integrationRepository;

  constructor(integrationRepository: IntegrationRepository) {
    this.integrationRepository = integrationRepository;
  }

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
      );

      if (!updatedRoom) {
        throw new Error("Room not found");
      }

      const roomWithIntegration = await RoomModel.findOne({
        id: roomData.id,
      }).populate("integration");

      this.integrationRepository.update({
        ...roomData.integration,
        id: roomWithIntegration?.integration?._id,
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
        updatedRoom.integration
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

  public findRefreshToken(
    user: RequestUser
  ): Promise<string | null | undefined> {
    return UserModel.findOne({ id: user.profile.id })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        return user.refreshToken;
      })
      .catch((error) => {
        console.error("Error finding user:", error);
        throw error;
      });
  }
}
