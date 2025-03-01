import InMemoryIntegrationRepository from "../interfaceAdapters/repositories/InMemoryIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";
import { TIssue } from "../entities/Issue";

class GetIntegrationIssues {
    constructor(private inMemoryIntegrationRepository: InMemoryIntegrationRepository, private redisRoomRepository: RedisRoomRepository) {
        this.inMemoryIntegrationRepository = inMemoryIntegrationRepository;
        this.redisRoomRepository = redisRoomRepository;
    }

    private async fetchIssues(roomId: string): Promise<TIssue[]> {
        const integration = await this.inMemoryIntegrationRepository.findIntegrationById(roomId);

        if (!integration) {
            throw new Error("Integration not found");
        }

        const headers = { Authorization: integration.getAuthorizationHeader(), "Content-Type": "application/json" };
        
        const response = await fetch(`${integration.baseUrl}/search`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                jql: `project = ${integration.projectName} and labels = ${integration.filterLabel}`,
                maxResults: 10,
                fields: ["summary", "description", "issuetype", "priority", "customfield_10016"],
            })
        });

        return await response.json();
    }
    
    public async execute(roomId: string): Promise<TIssue[]> {
        const cachedIssues = await this.redisRoomRepository.findIntegrationIssues(roomId);

        if (cachedIssues) {
            return cachedIssues;
        }

        const fetchedIssues = await this.fetchIssues(roomId);
        this.redisRoomRepository.saveIntegrationIssues(roomId, fetchedIssues);
        return fetchedIssues;
    }
}

export default GetIntegrationIssues;