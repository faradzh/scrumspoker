import { Types } from "mongoose";
import { Integration } from "../../entities/Integration";
import { IntegrationDocument } from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import IntegrationModel from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";
import { IntegrationRepository } from "./IntegrationRepository";

class MongoIntegrationRepository implements IntegrationRepository {
  public async save(data: Integration): Promise<IntegrationDocument> {
    return await IntegrationModel.create({
      type: data.id,
      projectName: data.projectName,
      filterLabel: data.filterLabel,
      domainUrl: data.domainUrl,
      email: data.email,
      apiToken: data.apiToken,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  public async findById(roomId: string): Promise<IntegrationDocument | null> {
    const room = await RoomModel.findOne({ id: roomId }).populate(
      "integration"
    );

    return room?.integration as IntegrationDocument | null;
  }

  public async delete(roomId: string): Promise<void> {
    const room = await RoomModel.findById(roomId);

    if (!room?.integration) {
      throw new Error("The integration doesn't exist!");
    }

    const integrationId = room.integration as Types.ObjectId;

    await IntegrationModel.findByIdAndDelete(integrationId);
    await RoomModel.findByIdAndUpdate(roomId, { $unset: { integration: 1 } });
  }
}

export default MongoIntegrationRepository;
