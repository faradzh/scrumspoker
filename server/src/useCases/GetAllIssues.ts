import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { Issue, IssueResponse } from "../entities/types";
import { IntegrationDocument } from "../infrastructure/database/mongodb/schemas/IntegrationSchema";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import {
  IntegrationTypeEnum,
  ISSUE_TRANSFORMERS,
  OAUTH2INTEGRATION_CLASSES,
} from "./constants";

class GetIntegrationIssues {
  constructor(
    private integrationRepository: MongoIntegrationRepository,
    private roomRepository: RedisRoomRepository
  ) {
    this.integrationRepository = integrationRepository;
    this.roomRepository = roomRepository;
  }

  /**
   * Fetches issues from the integration API
   */
  public async fetchIssues<T extends keyof IssueResponse>(
    integration: JiraOauthIntegration
  ): Promise<IssueResponse[T]> {
    if (!integration) {
      throw new Error("Integration not found");
    }

    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(integration.getSearchUrl(), {
      method: "POST",
      headers,
      body: integration.getSearchBody(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch issues: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
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
    });
  }

  /**
   * Transforms fetched API data into standardized issues
   */
  private transformIssues<T extends IntegrationTypeEnum>(
    fetchedData: IssueResponse[T],
    integrationType: keyof typeof ISSUE_TRANSFORMERS
  ): Issue[] {
    const TransformerClass = ISSUE_TRANSFORMERS[integrationType];

    if (!TransformerClass) {
      throw new Error(
        `Issue transformer not found for type: ${integrationType}`
      );
    }

    const issueTransformer = new TransformerClass();
    // @ts-ignore
    return issueTransformer.transform(fetchedData);
  }

  /**
   * Main execution method to fetch and process issues for a room
   */
  public async execute(
    roomId: string
  ): Promise<{ data: Issue[]; domainUrl: string }> {
    // Fetch integration document
    const integrationDoc = await this.integrationRepository.findById(roomId);

    // Create and initialize integration
    const integration = this.createIntegrationFromDocument(integrationDoc);
    await integration.fetchAvailableResources();

    // Check for cached issues first
    const cachedIssues = await this.roomRepository.findIntegrationIssues(
      roomId
    );

    if (cachedIssues.length > 0) {
      return {
        data: cachedIssues,
        domainUrl: integration.domainUrl,
      };
    }

    // Fetch new issues if cache is empty
    const fetchedData = await this.fetchIssues<typeof integration.id>(
      integration
    );

    // Transform response data into standardized issues
    const issues = this.transformIssues(fetchedData, integration.id);

    // Cache the issues for future use
    await this.roomRepository.saveIntegrationIssues(roomId, issues);

    return {
      data: issues,
      domainUrl: integration.domainUrl,
    };
  }
}

export default GetIntegrationIssues;
