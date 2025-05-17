import refresh from "passport-oauth2-refresh";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from "../types";
import { ACCESS_TOKEN_TYPES, RequestUser } from "../infrastructure/auth/types";
import UserModel from "../infrastructure/database/mongodb/schemas/UserSchema";

import {
  INTEGRATION_CLASSES,
  IntegrationTypeEnum,
  OAUTH2INTEGRATION_CLASSES,
} from "./constants";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { Integration } from "../entities/Integration";

class UpdateRoom {
  private roomRepository;
  private integrationRepository;

  constructor(
    roomRepository: RoomRepository,
    integrationRepository: IntegrationRepository
  ) {
    this.roomRepository = roomRepository;
    this.integrationRepository = integrationRepository;
  }

  public async execute(
    roomId: string,
    data: RoomData,
    user: RequestUser
  ): Promise<Room | undefined> {
    // Handle integration separately
    await this.handleIntegration(data.integration, user);

    // Prepare and save room data
    return await this.updateRoomData(roomId, data);
  }

  /**
   * Handles integration based on user token type
   */
  private async handleIntegration(
    integration: Integration | undefined,
    user: RequestUser
  ): Promise<void | null> {
    if (!integration || !user.accessToken) {
      return null;
    }

    const refreshToken = await this.roomRepository.findRefreshToken?.(user);

    switch (user.accessTokenType) {
      case ACCESS_TOKEN_TYPES.ATLASSIAN:
        return await this.handleAtlassianIntegration(user, integration, {
          accessToken: user.accessToken,
          refreshToken,
        });
      case ACCESS_TOKEN_TYPES.GOOGLE:
        // Google integration is commented out in original code
        // return await this.handleGoogleIntegration(integration, user.accessToken);
        return null;
      default:
        return null;
    }
  }

  /**
   * Handles Atlassian-specific integration
   */
  private async handleAtlassianIntegration(
    user: RequestUser,
    integration: Integration,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string | undefined | null }
  ): Promise<void> {
    const oauth2Integration = this.buildOauth2Integration({
      ...integration,
      accessToken,
      refreshToken,
    });

    await this.checkOauth2Integration(user, oauth2Integration);
  }

  /**
   * Creates a room instance with provided data
   */
  private createRoomInstance(roomId: string, data: RoomData): Room {
    return new Room(
      roomId,
      data.name,
      data.estimationMethod,
      [], // Empty array for initial state
      [], // Empty array for initial state
      null,
      { ...data.moderator!, online: true }
    );
  }

  /**
   * Prepares and saves room data to repository
   */
  private async updateRoomData(
    roomId: string,
    data: RoomData
  ): Promise<Room | undefined> {
    const roomData = {
      id: roomId,
      ...data,
    };

    return await this.roomRepository.updateRoom?.(roomData);
  }

  public async test(integration: any): Promise<Response> {
    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      "Content-Type": "application/json",
    };

    // test if integration setup is a success
    const response = await fetch(integration.getMyselfUrl(), {
      headers,
    });

    if (response.status !== 200) {
      console.log("Failed Token", integration.accessToken);
      throw new Error("The integration connection test failed!");
    }

    return response;
  }

  public buildTokenBasedIntegration(integrationData: any) {
    const { id, email, domainUrl, apiToken, filterLabel, projectName } =
      integrationData;

    const integration = new INTEGRATION_CLASSES[id as IntegrationTypeEnum]({
      email,
      domainUrl,
      apiToken,
      filterLabel,
      projectName,
    });

    return integration;
  }

  public buildOauth2Integration(integrationData: any) {
    const { id, accessToken, refreshToken, filterLabel, projectName } =
      integrationData;
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      refreshToken,
      filterLabel,
      projectName,
    });
    return integration;
  }

  public async saveTokenBasedIntegration(
    roomId: string,
    data: any
  ): Promise<Response> {
    const integration = this.buildTokenBasedIntegration(data);

    const response = await this.test(integration);

    await this.test(integration);

    await this.integrationRepository.save(integration);

    return response;
  }

  public async requestNewAccessToken(
    user: RequestUser,
    integration: JiraOauthIntegration
  ) {
    return new Promise((resolve, reject) => {
      refresh.requestNewAccessToken(
        "atlassian",
        integration.refreshToken!,
        async (err, accessToken, refreshToken) => {
          if (err) {
            console.error("Refresh failed:", err);
            reject(err);
          }
          console.log("Token refreshed:", accessToken);
          if (accessToken) {
            integration.refreshAccessToken(accessToken, refreshToken);
            if (refreshToken) {
              this.updateRefreshToken(user, { refreshToken });
            }
            await integration.fetchAvailableResources();
            resolve(integration);
          }
        }
      );
    });
  }

  private async updateRefreshToken(
    user: RequestUser,
    { refreshToken }: { refreshToken: string }
  ) {
    await UserModel.findOneAndUpdate(
      { id: user.profile.id },
      { $set: { refreshToken } }
    );
  }

  public async checkOauth2Integration(
    user: RequestUser,
    integration: JiraOauthIntegration
  ): Promise<void> {
    const resources = await integration.fetchAvailableResources();

    if (resources.code === 401) {
      await this.requestNewAccessToken(user, integration);
    }

    // await this.test(integration);

    // return await this.integrationRepository.update(integration);
  }
}

export default UpdateRoom;
