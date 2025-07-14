import { Integration } from "../entities/Integration";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { Issue } from "../entities/types";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRequestData } from "../types";
import { IntegrationTypeEnum, OAUTH2INTEGRATION_CLASSES } from "./constants";
import { fetchIssues } from "./shared";

class TestIntegration {
  public async execute(
    data: IntegrationRequestData,
    user: RequestUser
  ): Promise<{ issues: Issue[] }> {
    const integration = this.buildIntegration({
      accessToken: user.accessToken,
      ...data,
    });

    const response = await fetchIssues(
      integration as JiraOauthIntegration,
      user
    );

    return {
      // @ts-ignore
      issues: response.issues,
    };
  }

  public buildIntegration(
    data: IntegrationRequestData & { accessToken: string }
  ): Integration {
    const {
      id,
      accessToken,
      filterLabel,
      projectName,
      resourceId,
      resourceUrl,
    } = data;
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      filterLabel,
      projectName,
      cloudId: resourceId,
      domainUrl: resourceUrl,
    });
    return integration;
  }

  public async addIntegrationAttributes(
    user: RequestUser,
    integration: JiraOauthIntegration
  ): Promise<JiraOauthIntegration> {
    await integration.fetchAccessibleResources(user);
    return integration;
  }
}

export default TestIntegration;
