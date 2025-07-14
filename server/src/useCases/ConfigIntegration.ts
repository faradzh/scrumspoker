import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRequestData } from "../types";
import { IntegrationTypeEnum, OAUTH2INTEGRATION_CLASSES } from "./constants";

class ConfigIntegration {
  public async execute(
    data: IntegrationRequestData,
    user: RequestUser
  ): Promise<{ resources: any[]; fields: any[] }> {
    const integration = this.buildIntegration({
      accessToken: user.accessToken,
      ...data,
    });

    const resources = await integration.fetchAccessibleResources(user);

    integration.cloudId = resources[0].id;
    integration.domainUrl = resources[0].url;

    const fields = await integration.fetchFields(user);

    const customNumberFields = fields
      .filter((field: any) => field.custom && field.schema?.type === "number")
      .map((field: any) => ({
        id: field.id,
        name: field.name,
      }));

    return {
      resources: resources.map((resource: any) => ({
        id: resource.id,
        url: resource.url,
      })),
      fields: customNumberFields,
    };
  }

  public buildIntegration(
    data: IntegrationRequestData & { accessToken: string }
  ): JiraOauthIntegration {
    const { id, accessToken, filterLabel, projectName } = data;
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      filterLabel,
      projectName,
    });
    return integration;
  }
}

export default ConfigIntegration;
