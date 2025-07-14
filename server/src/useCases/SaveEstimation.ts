import { RequestUser } from "../infrastructure/auth/types";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { fetchIntegrationData } from "./shared";

class SaveEstimation {
  private integrationRepository: MongoIntegrationRepository;
  private tempRoomRepository: RoomRepository;
  private persistedRoomRepository: RoomRepository;

  constructor(
    integrationRepository: MongoIntegrationRepository,
    tempRoomRepository: RoomRepository,
    persistedRoomRepository: RoomRepository
  ) {
    this.integrationRepository = integrationRepository;
    this.tempRoomRepository = tempRoomRepository;
    this.persistedRoomRepository = persistedRoomRepository;
  }

  private async saveEstimation(
    integration: any | undefined,
    user: RequestUser,
    issueId: string,
    value: number
  ): Promise<{ status: number }> {
    return fetchIntegrationData(integration, user, {
      authHeader: integration.getAuthorizationHeader(),
      url: integration.getUpdateIssueUrl(issueId),
      method: "PUT",
      body: integration.getUpdateIssueBody(value),
    });
  }

  async execute(
    roomId: string,
    issueId: string,
    value: number,
    user: RequestUser
  ): Promise<void> {
    const room = await this.persistedRoomRepository.findRoomById?.(roomId);
    const integration = await this.integrationRepository.findById(roomId);

    if (room?.moderator?.accessToken) {
      // Ensure integration has the latest access token
      integration.accessToken = room?.moderator?.accessToken;
    }

    const data = await this.saveEstimation(integration, user, issueId, value);

    if (data.status === 204) {
      await this.tempRoomRepository.addEstimatedIssue?.(roomId, issueId);
      await this.tempRoomRepository.addIssueTotalEstimation?.(
        roomId,
        issueId,
        value
      );
    }
  }
}

export default SaveEstimation;
