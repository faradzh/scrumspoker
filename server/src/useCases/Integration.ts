import { Integration as IntegrationI, IntegrationRequestData } from "../entities/Integration";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import { INTEGRATION_CLASSES, IntegrationTypeEnum } from "./constants";

class Integration {
    constructor(private integrationRepository: IntegrationRepository) {
        this.integrationRepository = integrationRepository;
    }

    public async testIntegration(data: IntegrationRequestData): Promise<{response: Response, integration: IntegrationI}> {
        const { id, email, apiToken, projectName, filterLabel } = data;

        const integration = new INTEGRATION_CLASSES[id as IntegrationTypeEnum](email, apiToken, projectName, filterLabel);

        const headers = { Authorization: integration.getAuthorizationHeader(), "Content-Type": "application/json" };
        
        // test if integration setup is a success
        const response = await fetch(integration.getMyselfUrl(), {
            headers
        });

        return {
            response,
            integration
        };
    }
    
    public async addIntegration(roomId: string, data: IntegrationRequestData): Promise<Response> {
        const {response, integration}  = await this.testIntegration(data);
        
        await this.integrationRepository.saveIntegration(roomId, integration);

        return response;
    }
}

export default Integration;