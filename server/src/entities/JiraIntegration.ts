import { INTEGRATIONS, IntegrationTypeEnum } from "../useCases/constants";
import { Integration } from "./Integration";

export interface JiraArgs {
  email: string;
  apiToken: string;
  filterLabel: string;
  domainUrl: string;
  id?: string;
  projectName?: string;
  storyPointsFieldId?: string;
}
class JiraIntegration implements Integration {
  public type = IntegrationTypeEnum.JIRA;
  public name: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].name;
  public domainUrl = "";
  public apiUrl: string = "rest/api/3";
  public storyPointsFieldId: string =
    INTEGRATIONS[IntegrationTypeEnum.JIRA].storyPointsFieldId;

  public email;
  public apiToken;
  public projectName;
  public filterLabel;
  public id: string;

  public constructor({
    id,
    email,
    domainUrl,
    apiToken,
    projectName,
    filterLabel,
    storyPointsFieldId,
  }: JiraArgs) {
    this.email = email;
    this.domainUrl = domainUrl;
    this.apiToken = apiToken;
    this.id = id ?? "";
    this.projectName = projectName ?? "";
    this.filterLabel = filterLabel ?? "";
    this.storyPointsFieldId = storyPointsFieldId ?? this.storyPointsFieldId;
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
    return `${this.domainUrl}/${this.apiUrl}/myself`;
  }

  public getSearchUrl(): string {
    return `${this.domainUrl}/${this.apiUrl}/search/jql`;
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
    return `${this.domainUrl}/${this.apiUrl}/issue/${id}`;
  }
}
export default JiraIntegration;
