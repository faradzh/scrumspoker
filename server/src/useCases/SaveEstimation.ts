import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { IntegrationDocument } from "../infrastructure/database/mongodb/schemas/IntegrationSchema";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { OAUTH2INTEGRATION_CLASSES } from "./constants";

class SaveEstimation {
  private integrationRepository: MongoIntegrationRepository;
  private roomRepository: RoomRepository;

  constructor(
    integrationRepository: MongoIntegrationRepository,
    roomRepository: RoomRepository
  ) {
    this.integrationRepository = integrationRepository;
    this.roomRepository = roomRepository;
  }

  private async saveEstimation(
    integration: any | undefined,
    issueId: string,
    value: number
  ): Promise<{ status: number }> {
    if (!integration) {
      throw new Error("Integration not found");
    }

    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    return await fetch(integration.getUpdateIssueUrl(issueId), {
      method: "PUT",
      headers,
      body: integration.getUpdateIssueBody(value),
    });
  }

  /**
   * Creates an integration instance from a document
   */
  private createIntegrationFromDocument(
    integrationDoc: IntegrationDocument | null
  ): JiraOauthIntegration {
    if (!integrationDoc) {
      throw new Error("Integration document not found");
    }

    const integrationType =
      integrationDoc.type as keyof typeof OAUTH2INTEGRATION_CLASSES;
    const IntegrationClass = OAUTH2INTEGRATION_CLASSES[integrationType];

    if (!IntegrationClass) {
      throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    return new IntegrationClass({
      accessToken: integrationDoc.accessToken ?? "",
      refreshToken: integrationDoc.refreshToken ?? "",
      filterLabel: integrationDoc.filterLabel ?? "",
      projectName: integrationDoc.projectName,
      domainUrl: integrationDoc.domainUrl,
      cloudId: integrationDoc.cloudId,
    });
  }

  async execute(roomId: string, issueId: string, value: number): Promise<void> {
    const integrationDoc = await this.integrationRepository.findById(roomId);

    if (!integrationDoc) {
      throw new Error("Integration not found");
    }

    const integration = this.createIntegrationFromDocument(integrationDoc);
    const response = await this.saveEstimation(integration, issueId, value);
    if (response.status === 204) {
      await this.roomRepository.addEstimatedIssue?.(roomId, issueId);
      await this.roomRepository.addIssueTotalEstimation?.(
        roomId,
        issueId,
        value
      );
    }
  }
}

export default SaveEstimation;
