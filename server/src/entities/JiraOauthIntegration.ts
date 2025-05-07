import JiraIntegration from "./JiraIntegration";

interface JiraOauthArgs {
  filterLabel: string;
  accessToken: string;
  refreshToken?: string;
  projectName?: string;
}

class JiraOauthIntegration extends JiraIntegration {
  public accessToken: string;
  private cloudId: string = "";
  private baseUrl: string = "https://api.atlassian.com";
  public refreshToken?: string;

  public constructor({
    accessToken,
    refreshToken,
    filterLabel,
    projectName,
  }: JiraOauthArgs) {
    super({ email: "", domainUrl: "", apiToken: "", filterLabel, projectName });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public getAuthorizationHeader(): string {
    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    } else {
      throw new Error("Auth header is not defined!");
    }
  }

  public async fetchAvailableResources(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/oauth/token/accessible-resources`,
      {
        headers: {
          Authorization: this.getAuthorizationHeader(),
          Accept: "application/json",
        },
      }
    );

    const resources = await response.json();

    if (resources.length === 1) {
      this.cloudId = resources[0].id;
      this.domainUrl = resources[0].url;
    } else if (resources.length > 1) {
      throw new Error("Multiple cloud IDs found");
    }

    return resources;
  }

  public refreshAccessToken(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;

    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  public getMyselfUrl(): string {
    return `${this.baseUrl}/ex/jira/${this.cloudId}/${this.apiUrl}/myself`;
  }

  public getSearchUrl(): string {
    return `${this.baseUrl}/ex/jira/${this.cloudId}/${this.apiUrl}/search/jql`;
  }

  public getUpdateIssueUrl(id: string): string {
    return `${this.baseUrl}/ex/jira/${this.cloudId}/${this.apiUrl}/issue/${id}`;
  }
}

export default JiraOauthIntegration;
