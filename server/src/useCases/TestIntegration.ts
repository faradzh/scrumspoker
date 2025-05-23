import { Integration } from "../entities/Integration";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { Issue } from "../entities/types";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRequestData } from "../types";
import { IntegrationTypeEnum, OAUTH2INTEGRATION_CLASSES } from "./constants";
import { fetchIssues } from "./shared";

class TestIntegration {
  constructor(private userRepository: any) {
    this.userRepository = userRepository;
  }

  public async execute(
    data: IntegrationRequestData,
    user: RequestUser
  ): Promise<{ issues: Issue[]; integration: Integration }> {
    const refreshToken = await this.userRepository.findRefreshToken?.(user);

    const integration = this.buildIntegration({
      accessToken: user.accessToken,
      refreshToken,
      ...data,
    });

    // update integration properties, e.g. cloudId, domainUrl and accessToken with refreshToken, if needed
    await this.updateResourceAttributes(
      user,
      integration as JiraOauthIntegration
    );

    const response = await fetchIssues(integration as JiraOauthIntegration);

    return {
      // @ts-ignore
      issues: response.issues,
      integration,
    };
  }

  public buildIntegration(
    data: IntegrationRequestData & { accessToken: string; refreshToken: string }
  ): Integration {
    const { id, accessToken, refreshToken, filterLabel, projectName } = data;
    const integration = new OAUTH2INTEGRATION_CLASSES[
      id as IntegrationTypeEnum
    ]({
      accessToken,
      refreshToken,
      filterLabel,
      projectName,
    });
    return integration;
  }

  public async refreshAccessToken(
    user: RequestUser,
    integration: JiraOauthIntegration
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.userRepository.requestNewAccessToken(
          integration.refreshToken
        );

      if (accessToken) {
        integration.accessToken = accessToken;
        if (user.profile) {
          this.userRepository.updateAccessToken(user, accessToken);
        }
      }

      if (refreshToken) {
        integration.refreshToken = refreshToken;
        if (user.profile) {
          this.userRepository.updateRefreshToken(user, refreshToken);
        }
      }
    } catch (error) {
      throw new Error("Failed to refresh access token");
    }
  }

  public async updateResourceAttributes(
    user: RequestUser,
    integration: JiraOauthIntegration
  ): Promise<void> {
    const resources = await integration.fetchAvailableResources();

    if (resources.code === 401) {
      await this.refreshAccessToken(user, integration);
      await integration.fetchAvailableResources();
    }
  }
}

export default TestIntegration;
