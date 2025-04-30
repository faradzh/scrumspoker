import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import {
  INTEGRATION_CLASSES,
  IntegrationTypeEnum,
  OAUTH2INTEGRATION_CLASSES,
} from "./constants";

class Integration {
  constructor(private integrationRepository: IntegrationRepository) {
    this.integrationRepository = integrationRepository;
  }

  public async testIntegration(integration: any): Promise<Response> {
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

  private async save(roomId: string, integration: any) {
    await this.integrationRepository.saveIntegration(roomId, integration);
  }

  public async addTokenBasedIntegration(
    roomId: string,
    data: any
  ): Promise<Response> {
    const integration = this.buildTokenBasedIntegration(data);

    const response = await this.testIntegration(integration);

    this.save(roomId, integration);

    return response;
  }

  public async addOauth2Integration(
    roomId: string,
    { id, filterLabel, projectName }: any,
    { accessToken }: any
  ): Promise<Response> {
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      filterLabel,
      projectName,
    });

    await integration.fetchCloudId();

    const response = await this.testIntegration(integration);

    this.save(roomId, integration);

    return response;
  }
}

export default Integration;
