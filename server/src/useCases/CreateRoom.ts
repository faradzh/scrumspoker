import { v4 as uuidv4 } from "uuid";
import refresh from "passport-oauth2-refresh";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from "../types";
import { ACCESS_TOKEN_TYPES, RequestUser } from "../infrastructure/auth/types";

import { IntegrationTypeEnum, OAUTH2INTEGRATION_CLASSES } from "./constants";
import { IntegrationDocument } from "../infrastructure/database/mongodb/schemas/IntegrationSchema";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";

class CreateRoom {
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
    initialData: RoomData,
    user: RequestUser
  ): Promise<Room> {
    const roomId = uuidv4();
    let integrationDocument: IntegrationDocument | null = null;

    if (initialData.integration) {
      // TODO: add access token type check
      if (user.accessToken) {
        const integration = this.buildOauth2Integration({
          ...initialData.integration,
          accessToken: user.accessToken,
        });
        integrationDocument = await this.saveOauth2Integration(integration);
      } else if (
        user.accessToken &&
        user.accessTokenType === ACCESS_TOKEN_TYPES.GOOGLE
      ) {
        // // assume to work with google oAuth
        // await this.addTokenBasedIntegration(room.id, {
        //   ...initialData.integration,
        //   domainUrl: "https://bishkek.atlassian.net",
        // });
      }
    }

    const newRoom = new Room(
      roomId,
      initialData.name,
      initialData.estimationMethod,
      [],
      [],
      null,
      { ...initialData.moderator!, online: true }
    );

    const roomData = {
      ...initialData,
      id: roomId,
      // @ts-ignore
      integration: integrationDocument?._id,
    };

    await this.roomRepository.saveRoom?.(roomData);

    return newRoom;
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
      throw new Error("The integration connection test failed!");
    }

    return response;
  }

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

  public buildOauth2Integration(integrationData: any) {
    const { id, accessToken, filterLabel, projectName } = integrationData;
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      filterLabel,
      projectName,
    });
    return integration;
  }

  // public async addTokenBasedIntegration(
  //   roomId: string,
  //   data: any
  // ): Promise<Response> {
  //   const integration = this.buildTokenBasedIntegration(data);

  //   const response = await this.test(integration);

  //   // this.save(integration);

  //   return response;
  // }

  public async requestNewAccessToken(
    integration: JiraOauthIntegration,
    refreshToken: string
  ) {
    refresh.requestNewAccessToken(
      "atlassian",
      refreshToken,
      async function (err, accessToken, refreshToken) {
        if (err) {
          console.error("Refresh failed:", err);
          return;
        }
        console.log("Token refreshed:", accessToken);
        if (accessToken) {
          integration.refreshAccessToken(accessToken, refreshToken);
          await integration.fetchAvailableResources();
        }
      }
    );
  }

  public async saveOauth2Integration(
    integration: JiraOauthIntegration
  ): Promise<IntegrationDocument> {
    const resources = await integration.fetchAvailableResources();

    if (resources.code === 401) {
      this.requestNewAccessToken(integration, "refreshToken");
    }

    await this.test(integration);

    return await this.integrationRepository.save(integration);
  }
}

export default CreateRoom;
