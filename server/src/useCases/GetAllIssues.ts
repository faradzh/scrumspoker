import { Integration } from "../entities/Integration";
import { Issue, IssueResponse, JiraIssueResponse } from "../entities/types";
import JiraIssueTransformer from "../interfaceAdapters/presenters/JiraIssueTransformer";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import { ISSUE_TRANSFORMERS, OAUTH2INTEGRATION_CLASSES } from "./constants";

class GetIntegrationIssues {
  constructor(
    private integrationRepository: MongoIntegrationRepository,
    private roomRepository: RedisRoomRepository
  ) {
    this.integrationRepository = integrationRepository;
    this.roomRepository = roomRepository;
  }

  private async fetchIssues<T extends keyof IssueResponse>(
    integration: any | undefined
  ): Promise<IssueResponse[T]> {
    if (!integration) {
      throw new Error("Integration not found");
    }

    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(`${integration.getSearchUrl()}`, {
      method: "POST",
      headers,
      body: integration.getSearchBody(),
    });

    return await response.json();
  }

  public async execute(
    roomId: string
  ): Promise<{ data: Issue[]; domainUrl: string }> {
    const integrationDoc = await this.integrationRepository.findById(roomId);

    const integration = new OAUTH2INTEGRATION_CLASSES[
      integrationDoc?.type as keyof typeof OAUTH2INTEGRATION_CLASSES
    ]({
      accessToken: integrationDoc?.accessToken ?? "",
      refreshToken: integrationDoc?.refreshToken ?? "",
      filterLabel: integrationDoc?.filterLabel ?? "",
      projectName: integrationDoc?.projectName,
    });

    await integration.fetchAvailableResources();

    if (!integration) {
      throw new Error("Integration not found");
    }

    const cachedIssues = await this.roomRepository.findIntegrationIssues(
      roomId
    );

    if (cachedIssues.length > 0) {
      return {
        data: cachedIssues,
        domainUrl: integration.domainUrl,
      };
    }

    const fetchedData = (await this.fetchIssues<typeof integration.id>(
      integration
    )) as JiraIssueResponse;

    console.log("Fetched data", fetchedData);

    const TransformerClass = ISSUE_TRANSFORMERS[integration.id];

    if (!TransformerClass) {
      throw new Error("Issue transformer not found");
    }

    const issueTransformer = new TransformerClass() as JiraIssueTransformer;

    const issues = issueTransformer.transform(fetchedData);

    this.roomRepository.saveIntegrationIssues(roomId, issues);

    return { data: issues, domainUrl: integration.domainUrl };
  }
}

export default GetIntegrationIssues;
