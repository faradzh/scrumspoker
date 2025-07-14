import { fetchIntegrationData } from "../useCases/shared";
import JiraIntegration from "./JiraIntegration";

interface JiraOauthArgs {
  filterLabel: string;
  accessToken: string;
  id?: string;
  projectName?: string;
  domainUrl?: string;
  cloudId?: string;
  storyPointsFieldId?: string;
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
    storyPointsFieldId,
  }: JiraOauthArgs) {
    super({
      id,
      email: "",
      domainUrl,
      apiToken: "",
      filterLabel,
      projectName,
      storyPointsFieldId,
    });
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

  public async fetchAccessibleResources(user: any): Promise<any> {
    return fetchIntegrationData(this, user, {
      authHeader: this.getAuthorizationHeader(),
      url: `${this.baseUrl}/oauth/token/accessible-resources`,
      method: "GET",
    });
  }

  public async fetchFields(user: any): Promise<any> {
    return fetchIntegrationData(this, user, {
      authHeader: this.getAuthorizationHeader(),
      url: `${this.baseUrl}/ex/jira/${this.cloudId}/${this.apiUrl}/field`,
      method: "GET",
    });
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
