import { Integration } from "../entities/Integration";
import InMemoryIntegrationRepository from "../interfaceAdapters/repositories/InMemoryIntegrationRepository";

class SaveEstimation {
    private inMemoryIntegrationRepository: InMemoryIntegrationRepository;
    
    constructor(inMemoryIntegrationRepository: InMemoryIntegrationRepository) {
        this.inMemoryIntegrationRepository = inMemoryIntegrationRepository;
    }

    private async saveEstimation(integration: Integration | undefined, issueId: string, value: number): Promise<void> {
        if (!integration) {
            throw new Error("Integration not found");
        }

        const headers = { 
            Authorization: integration.getAuthorizationHeader(),
            Accept: "application/json",
            "Content-Type": "application/json"
        };

        console.log('URL', integration.getUpdateIssueUrl(issueId));
        console.log('BODY', integration.getUpdateIssueBody(value));

        const response = await fetch(integration.getUpdateIssueUrl(issueId), {
            method: "PUT",
            headers,
            body: integration.getUpdateIssueBody(value)
        });

        console.log('RESPONSE', response);
    }

    async execute(roomId: string, issueId: string, value: number): Promise<void> {
        const integration = await this.inMemoryIntegrationRepository.findIntegrationById(roomId);

        if (!integration) {
            throw new Error("Integration not found");
        }
        await this.saveEstimation(integration, issueId, value);        
    }
}

export default SaveEstimation;