import JiraIntegration from "./JiraIntegration";

interface JiraOauthArgs {
  filterLabel: string;
  projectName?: string;
  accessToken: string;
}

class JiraOauthIntegration extends JiraIntegration {
  private accessToken: string;
  private apiUrl: string = "rest/api/3";
  private cloudId: string = "";

  public constructor({ accessToken, filterLabel, projectName }: JiraOauthArgs) {
    super({ email: "", apiToken: "", filterLabel, projectName });
    this.accessToken = accessToken;
    this.baseUrl = "https://api.atlassian.com/ex/jira";
  }

  public getAuthorizationHeader(): string {
    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    } else {
      throw new Error("Auth header is not defined!");
    }
  }

  public async fetchCloudId() {
    const response = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: this.getAuthorizationHeader(),
          Accept: "application/json",
        },
      }
    );

    const sites = await response.json();

    if (sites.length) {
      this.cloudId = sites[0].id;
    }
  }

  public getMyselfUrl(): string {
    return `${this.baseUrl}/${this.cloudId}/${this.apiUrl}/myself`;
  }

  public getSearchUrl(): string {
    return `${this.baseUrl}/${this.cloudId}/${this.apiUrl}/search/jql`;
  }

  public getUpdateIssueUrl(id: string): string {
    return `${this.baseUrl}/${this.cloudId}/${this.apiUrl}/issue/${id}`;
  }
}

export default JiraOauthIntegration;
