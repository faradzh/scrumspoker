import { Integration } from "../entities/Integration";
import { IssueResponse } from "../entities/types";
import InMemoryIntegrationRepository from "../interfaceAdapters/repositories/InMemoryIntegrationRepository";
import RedisRoomRepository from "../interfaceAdapters/repositories/RedisRoomRepository";

class SaveEstimation {
    private temporaryRepository: RedisRoomRepository;
    private inMemoryIntegrationRepository: InMemoryIntegrationRepository;
    
    constructor(temporaryRepository: RedisRoomRepository, inMemoryIntegrationRepository: InMemoryIntegrationRepository) {
        this.temporaryRepository = temporaryRepository;
        this.inMemoryIntegrationRepository = inMemoryIntegrationRepository;
    }

    private async saveEstimation<T extends keyof IssueResponse>(integration: Integration | undefined, issueId: string, value: number): Promise<void> {
        if (!integration) {
            throw new Error("Integration not found");
        }

        const headers = { 
            Authorization: integration.getAuthorizationHeader(),
            Accept: "application/json",
            "Content-Type": "application/json"
        };

        await fetch(`${integration.getUpdateIssueUrl()}/${issueId}`, {
            method: "PUT",
            headers,
            body: integration.getUpdateIssueBody(value)
        });
    }

    async execute(roomId: string, issueId: string, value: number): Promise<void> {
        const integration = await this.inMemoryIntegrationRepository.findIntegrationById(roomId);

        if (!integration) {
            throw new Error("Integration not found");
        }
        // const cachedIssue = await this.temporaryRepository.findIntegrationIssue(roomId, issueId);
        await this.saveEstimation(integration, issueId, value);        
    }
}

export default SaveEstimation;