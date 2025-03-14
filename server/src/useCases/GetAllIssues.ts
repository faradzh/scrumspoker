import { Integration } from "../entities/Integration";
import { Issue, IssueResponse, JiraIssueResponse } from "../entities/types";
import JiraIssueTransformer from "../interfaceAdapters/presenters/JiraIssueTransformer";
import IssueTransformer from "../interfaceAdapters/presenters/JiraIssueTransformer";
import InMemoryIntegrationRepository from "../interfaceAdapters/repositories/InMemoryIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import { ISSUE_TRANSFORMERS } from "./constants";

class GetIntegrationIssues {
    constructor(
        private inMemoryIntegrationRepository: InMemoryIntegrationRepository,
        private redisRoomRepository: RedisRoomRepository,
    ) {
        this.inMemoryIntegrationRepository = inMemoryIntegrationRepository;
        this.redisRoomRepository = redisRoomRepository;
    }

    private async fetchIssues<T extends keyof IssueResponse>(integration: Integration | undefined): Promise<IssueResponse[T]> {
        if (!integration) {
            throw new Error("Integration not found");
        }

        const headers = { 
            Authorization: integration.getAuthorizationHeader(),
            Accept: "application/json",
            "Content-Type": "application/json"
        };

        const response = await fetch(`${integration.getSearchUrl()}`, {
            method: "POST",
            headers,
            body: integration.getSearchBody()
        });

        return await response.json();
    }
    
    public async execute(roomId: string): Promise<Issue[]> {
        const integration = await this.inMemoryIntegrationRepository.findIntegrationById(roomId);

        if (!integration) {
            throw new Error("Integration not found");
        }

        const cachedIssues = await this.redisRoomRepository.findIntegrationIssues(roomId);

        if (cachedIssues.length > 0) {
            return cachedIssues;
        }
        
        const fetchedData = await this.fetchIssues<typeof integration.id>(integration) as JiraIssueResponse;
        const TransformerClass = ISSUE_TRANSFORMERS[integration.id];

        if (!TransformerClass) {
            throw new Error("Issue transformer not found");
        }

        const issueTransformer = new TransformerClass() as JiraIssueTransformer;
        
        const issues = issueTransformer.transform(fetchedData);

        this.redisRoomRepository.saveIntegrationIssues(roomId, issues);

        return issues;
    }
}

export default GetIntegrationIssues;