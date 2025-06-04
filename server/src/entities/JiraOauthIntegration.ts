import { fetchIntegrationData } from "../useCases/shared";
import JiraIntegration from "./JiraIntegration";

interface JiraOauthArgs {
  filterLabel: string;
  accessToken: string;
  id?: string;
  projectName?: string;
  domainUrl?: string;
  cloudId?: string;
}

class JiraOauthIntegration extends JiraIntegration {
  public accessToken: string;
  public baseUrl: string = "https://api.atlassian.com";
  public cloudId: string = "";

  public constructor({
    id,
    accessToken,
    filterLabel,
    projectName,
    domainUrl = "",
    cloudId,
  }: JiraOauthArgs) {
    super({ id, email: "", domainUrl, apiToken: "", filterLabel, projectName });
    this.accessToken = accessToken;
    this.cloudId = cloudId ?? "";
  }

  public getAuthorizationHeader(): string {
    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    } else {
      throw new Error("Auth header is not defined!");
    }
  }

  public async fetchAvailableResources(user: any): Promise<any> {
    const resources = await fetchIntegrationData(this, user, {
      authHeader: this.getAuthorizationHeader(),
      url: `${this.baseUrl}/oauth/token/accessible-resources`,
    });

    console.log("Resources:", resources);

    if (resources.length === 1) {
      this.cloudId = resources[0].id;
      this.domainUrl = resources[0].url;
    } else if (resources.length > 1) {
      throw new Error("Multiple cloud IDs found");
    }

    return resources;
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
