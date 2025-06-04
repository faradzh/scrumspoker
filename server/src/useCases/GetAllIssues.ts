import { Issue, IssueResponse, JiraIssueResponse } from "../entities/types";
import { RequestUser } from "../infrastructure/auth/types";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { IntegrationTypeEnum, ISSUE_TRANSFORMERS } from "./constants";
import { fetchIssues } from "./shared";

class GetIntegrationIssues {
  constructor(
    private integrationRepository: MongoIntegrationRepository,
    private tempRoomRepository: RedisRoomRepository,
    private persistedRoomRepository: RoomRepository
  ) {
    this.integrationRepository = integrationRepository;
    this.tempRoomRepository = tempRoomRepository;
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
    return issueTransformer.transform(fetchedData as JiraIssueResponse);
  }

  /**
   * Main execution method to fetch and process issues for a room
   */
  public async execute(
    roomId: string,
    user: RequestUser
  ): Promise<{
    data: Issue[];
    domainUrl: string;
    currentIssue?: string | null;
  }> {
    const room = await this.persistedRoomRepository.findRoomById?.(roomId);
    const integration = await this.integrationRepository.findById(roomId);
    if (room?.moderator?.accessToken) {
      // Ensure integration has the latest access token
      integration.accessToken = room?.moderator?.accessToken;
    }
    const currentIssue = await this.tempRoomRepository.getCurrentIssue(roomId);

    const fetchedData = (await fetchIssues<typeof integration.type>(
      integration,
      user
    )) as JiraIssueResponse;

    // Transform response data into standardized issues
    const issues = this.transformIssues(fetchedData, integration.type);

    return {
      data: issues,
      domainUrl: integration.domainUrl,
      currentIssue,
    };
  }
}

export default GetIntegrationIssues;
