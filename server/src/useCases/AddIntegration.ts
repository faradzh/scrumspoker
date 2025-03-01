import { Integration, IntegrationRequestData } from "../entities/Integration";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import { INTEGRATION_CLASSES, IntegrationTypeEnum } from "./constants";

class AddIntegration {
    constructor(private integrationRepository: IntegrationRepository) {
        this.integrationRepository = integrationRepository;
    }
    
    public async execute(roomId: string, data: IntegrationRequestData): Promise<Integration> {
        const { id, email, apiToken, projectName, filterLabel } = data;

        const integration = new INTEGRATION_CLASSES[id as IntegrationTypeEnum](email, apiToken, projectName, filterLabel);

        const headers = { Authorization: integration.getAuthorizationHeader(), "Content-Type": "application/json" };
        
        // test if integration setup is a success
        await fetch(integration.getMyselfUrl(), {
            headers
        });
        
        await this.integrationRepository.saveIntegration(roomId, integration);

        return integration
    }
}

export default AddIntegration;