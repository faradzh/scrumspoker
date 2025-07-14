import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRequestData } from "../types";
import { IntegrationTypeEnum, OAUTH2INTEGRATION_CLASSES } from "./constants";

class ConfigIntegration {
  public async execute(
    data: IntegrationRequestData,
    user: RequestUser
  ): Promise<{ resources: { id: string; url: string; fields: any[] }[] }> {
    const integration = this.buildIntegration({
      accessToken: user.accessToken,
      ...data,
    });

    const resources = await integration.fetchAccessibleResources(user);

    const resourcesWithFields = [];

    for (const resource of resources) {
      integration.cloudId = resource.id;
      integration.domainUrl = resource.url;

      const fields = await integration.fetchFields(user);

      const customNumberFields = fields
        .filter((field: any) => field.custom && field.schema?.type === "number")
        .map((field: any) => ({
          id: field.id,
          name: field.name,
        }));

      resourcesWithFields.push({
        id: resource.id,
        url: resource.url,
        fields: customNumberFields,
      });
    }

    return { resources: resourcesWithFields };
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
