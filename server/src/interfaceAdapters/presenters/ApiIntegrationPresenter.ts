import { Integration } from "../../entities/Integration";

class ApiIntegrationPresenter {
    public presentIntegration(integration: Integration): Integration {
        return {
            id: integration.id,
            name: integration.name
        } as Integration;
    }
}

export default ApiIntegrationPresenter;