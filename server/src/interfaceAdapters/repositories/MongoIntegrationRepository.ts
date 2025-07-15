import { Types } from "mongoose";
import { Integration } from "../../entities/Integration";
import { IntegrationDocument } from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";
import RoomModel from "../../infrastructure/database/mongodb/schemas/RoomSchema";
import IntegrationModel from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";
import { IntegrationRepository } from "./IntegrationRepository";
import { OAUTH2INTEGRATION_CLASSES } from "../../useCases/constants";

class MongoIntegrationRepository implements IntegrationRepository {
  public async save(data: Integration): Promise<IntegrationDocument> {
    return await IntegrationModel.create({
      type: data.type,
      projectName: data.projectName,
      filterLabel: data.filterLabel,
      domainUrl: data.domainUrl,
      cloudId: data.cloudId,
      storyPointsFieldId: data.storyPointsFieldId,
    });
  }

  public async findById(
    roomId: string
  ): Promise<
    InstanceType<
      (typeof OAUTH2INTEGRATION_CLASSES)[keyof typeof OAUTH2INTEGRATION_CLASSES]
    >
  > {
    const room = await RoomModel.findOne({ id: roomId }).populate<{
      integration: IntegrationDocument;
    }>("integration");

    const integration = room?.integration as IntegrationDocument;

    const integrationType =
      integration?.type as keyof typeof OAUTH2INTEGRATION_CLASSES;
    const IntegrationClass = OAUTH2INTEGRATION_CLASSES[integrationType];

    if (!IntegrationClass) {
      throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    return new IntegrationClass({
      id: integration._id,
      accessToken: "",
      filterLabel: integration.filterLabel ?? "",
      projectName: integration.projectName ?? "",
      domainUrl: integration.domainUrl ?? "",
      cloudId: integration.cloudId ?? "",
      storyPointsFieldId: integration.storyPointsFieldId ?? "",
    });
  }

  public async update(data: any): Promise<IntegrationDocument | null> {
    return await IntegrationModel.findByIdAndUpdate(
      data.id,
      {
        filterLabel: data.filterLabel,
        projectName: data.projectName,
        domainUrl: data.resourceUrl,
        cloudId: data.resourceId,
        storyPointsFieldId: data.fieldId,
      },
      { new: true, runValidators: true }
    );
  }

  public async delete(roomId: string): Promise<void> {
    const room = await RoomModel.findOne({ id: roomId });

    if (!room?.integration) {
      throw new Error("The integration doesn't exist!");
    }

    const integrationId = room.integration as Types.ObjectId;

    await IntegrationModel.findByIdAndDelete(integrationId);
  }
}

export default MongoIntegrationRepository;
