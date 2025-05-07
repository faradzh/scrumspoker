import { INTEGRATION_CLASSES, IntegrationTypeEnum } from "./constants";

class TestIntegration {
  public async execute(integration: any): Promise<Response> {
    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      "Content-Type": "application/json",
    };

    // test if integration setup is a success
    const response = await fetch(integration.getMyselfUrl(), {
      headers,
    });

    if (response.status !== 200) {
      throw new Error("The integration connection test failed!");
    }

    return response;
  }

  public buildTokenBasedIntegration(integrationData: any) {
    const { id, email, domainUrl, apiToken, filterLabel, projectName } =
      integrationData;

    const integration = new INTEGRATION_CLASSES[id as IntegrationTypeEnum]({
      email,
      domainUrl,
      apiToken,
      filterLabel,
      projectName,
    });

    return integration;
  }
}

export default TestIntegration;
