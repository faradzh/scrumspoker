import { Integration } from "../entities/Integration";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { Issue, IssueResponse, User } from "../entities/types";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationDocument } from "../infrastructure/database/mongodb/schemas/IntegrationSchema";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import {
  IntegrationTypeEnum,
  ISSUE_TRANSFORMERS,
  OAUTH2INTEGRATION_CLASSES,
} from "./constants";
import { fetchIssues } from "./shared";
import TestIntegration from "./TestIntegration";

class GetIntegrationIssues {
  constructor(
    private integrationRepository: MongoIntegrationRepository,
    private roomRepository: RedisRoomRepository,
    private testIntegration: TestIntegration
  ) {
    this.integrationRepository = integrationRepository;
    this.roomRepository = roomRepository;
    this.testIntegration = testIntegration;
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
  public async execute(roomId: string): Promise<{
    data: Issue[];
    domainUrl: string;
    currentIssue?: string | null;
  }> {
    // Fetch integration document
    const integrationDoc = await this.integrationRepository.findById(roomId);

    // Create and initialize integration
    const integration = this.createIntegrationFromDocument(integrationDoc);

    await this.testIntegration.updateResourceAttributes(
      { accessToken: integration.accessToken } as RequestUser,
      integration
    );

    await this.integrationRepository.update({
      id: integrationDoc?._id,
      accessToken: integration.accessToken,
      refreshToken: integration.refreshToken,
    } as Integration);

    // Check for cached issues first
    const cachedIssues = await this.roomRepository.findIntegrationIssues(
      roomId
    );

    const currentIssue = await this.roomRepository.getCurrentIssue(roomId);

    if (cachedIssues.length > 0) {
      return {
        data: cachedIssues,
        domainUrl: integration.domainUrl,
        currentIssue,
      };
    }

    // Fetch new issues if cache is empty
    const fetchedData = await fetchIssues<typeof integration.id>(integration);

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
