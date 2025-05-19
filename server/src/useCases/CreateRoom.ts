import { v4 as uuidv4 } from "uuid";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from "../types";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import TestIntegration from "./TestIntegration";

class CreateRoom {
  private roomRepository;
  private integrationRepository;
  private userRepository;
  private testIntegration;

  constructor(
    roomRepository: RoomRepository,
    integrationRepository: IntegrationRepository,
    userRepository: any,
    testIntegration: TestIntegration
  ) {
    this.roomRepository = roomRepository;
    this.integrationRepository = integrationRepository;
    this.userRepository = userRepository;
    this.testIntegration = testIntegration;
  }

  public async execute(data: RoomData, user: RequestUser): Promise<any> {
    const roomId = uuidv4();

    // Handle integration separately
    // const integration = await this.handleIntegration(data.integration, user);

    const { integration } = await this.testIntegration.execute(
      data.integration,
      user
    );

    // Create new room instance
    const newRoom = this.createRoomInstance(roomId, {
      ...data,
      moderator: user.profile,
    });

    // Prepare and save room data
    await this.roomRepository.saveRoom?.({
      id: roomId,
      integrationId: integration.id,
      ...data,
    });

    return newRoom;
  }

  /**
   * Handles integration based on user token type
   */
  // private async handleIntegration(
  //   integration: Integration | undefined,
  //   user: RequestUser
  // ): Promise<IntegrationDocument | null> {
  //   if (!integration || !user.accessToken) {
  //     return null;
  //   }

  //   const refreshToken = await this.userRepository.findRefreshToken?.(user);

  //   switch (user.accessTokenType) {
  //     case ACCESS_TOKEN_TYPES.ATLASSIAN:
  //       return this.handleAtlassianIntegration(user, integration, {
  //         accessToken: user.accessToken,
  //         refreshToken,
  //       });
  //     default:
  //       return null;
  //   }
  // }

  /**
   * Handles Atlassian-specific integration
   */
  // private async handleAtlassianIntegration(
  //   user: RequestUser,
  //   integration: Integration,
  //   {
  //     accessToken,
  //     refreshToken,
  //   }: { accessToken: string; refreshToken: string | undefined | null }
  // ): Promise<IntegrationDocument | null> {
  // const oauth2Integration = this.buildOauth2Integration({
  //   ...integration,
  //   accessToken,
  //   refreshToken,
  // });
  // const integrationDocument = await this.saveOauth2Integration(
  //   user,
  //   oauth2Integration
  // );
  // return integrationDocument || null;
  // }

  /**
   * Creates a room instance with provided data
   */
  private createRoomInstance(roomId: string, data: RoomData): Room {
    return new Room(roomId, data.name, data.estimationMethod, [], [], null, {
      ...data.moderator,
      online: true,
    });
  }

  /**
   * Prepares and saves room data to repository
   */
  // private async saveRoomData(
  //   roomId: string,
  //   data: RoomData,
  //   integrationId: string | null
  // ): Promise<void> {
  //   const roomData = {
  //     ...data,
  //     id: roomId,
  //     integration: integrationId,
  //   };

  //   await this.roomRepository.saveRoom?.(roomData);
  // }

  // public async test(integration: any): Promise<Response> {
  //   const headers = {
  //     Authorization: integration.getAuthorizationHeader(),
  //     "Content-Type": "application/json",
  //   };

  //   // test if integration setup is a success
  //   const response = await fetch(integration.getMyselfUrl(), {
  //     headers,
  //   });

  //   if (response.status !== 200) {
  //     throw new Error("The integration connection test failed!");
  //   }

  //   return response;
  // }

  // public buildTokenBasedIntegration(integrationData: any) {
  //   const { id, email, domainUrl, apiToken, filterLabel, projectName } =
  //     integrationData;

  //   const integration = new INTEGRATION_CLASSES[id as IntegrationTypeEnum]({
  //     email,
  //     domainUrl,
  //     apiToken,
  //     filterLabel,
  //     projectName,
  //   });

  //   return integration;
  // }

  // public buildOauth2Integration(integrationData: any) {
  //   const { id, accessToken, refreshToken, filterLabel, projectName } =
  //     integrationData;
  //   const integration = new OAUTH2INTEGRATION_CLASSES[
  //     id as IntegrationTypeEnum
  //   ]({
  //     accessToken,
  //     refreshToken,
  //     filterLabel,
  //     projectName,
  //   });
  //   return integration;
  // }
}

export default CreateRoom;
