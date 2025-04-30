import { INTEGRATIONS, IntegrationTypeEnum } from "../useCases/constants";
import { Integration } from "./Integration";

export interface JiraArgs {
  email: string;
  apiToken: string;
  filterLabel: string;
  projectName?: string;
}
class JiraIntegration implements Integration {
  public id = IntegrationTypeEnum.JIRA;
  public name: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].name;
  public baseUrl: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].url;
  public storyPointsFieldId: string =
    INTEGRATIONS[IntegrationTypeEnum.JIRA].storyPointsFieldId;

  public email;
  public apiToken;
  public projectName;
  public filterLabel;

  public constructor({ email, apiToken, projectName, filterLabel }: JiraArgs) {
    this.email = email;
    this.apiToken = apiToken;
    this.projectName = projectName ?? "";
    this.filterLabel = filterLabel ?? "";
  }

  public getAuthorizationHeader(): string {
    if (this.email && this.apiToken) {
      const auth = btoa(`${this.email}:${this.apiToken}`);
      return `Basic ${auth}`;
    } else {
      throw new Error("Auth header is not defined!");
    }
  }

  public getMyselfUrl(): string {
    return `${this.baseUrl}/myself`;
  }

  public getSearchUrl(): string {
    return `${this.baseUrl}/search/jql`;
  }

  public getSearchBody(): string {
    return JSON.stringify({
      jql: `labels = ${this.filterLabel}`,
      maxResults: 10,
      fields: [
        "summary",
        "status",
        "description",
        "status",
        "priority",
        "assignee",
        "reporter",
        "issuetype",
        "comment",
        this.storyPointsFieldId,
      ],
    });
  }

  public getUpdateIssueBody(value: number): string {
    return JSON.stringify({
      fields: {
        [this.storyPointsFieldId]: value,
      },
    });
  }

  public getUpdateIssueUrl(id: string): string {
    return `${this.baseUrl}/issue/${id}`;
  }
}
export default JiraIntegration;
