import { INTEGRATIONS, IntegrationTypeEnum } from "../useCases/constants";
import { Integration } from "./Integration";

class JiraIntegration implements Integration {
    public id = IntegrationTypeEnum.JIRA;
    public name: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].name;
    public baseUrl: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].url;
    public storyPointsFieldId: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].storyPointsFieldId;

    public constructor(
        public email: string,
        public apiToken: string,
        public projectName: string,
        public filterLabel: string
    ) {
        this.email = email;
        this.apiToken = apiToken;
        this.projectName = projectName ?? '';
        this.filterLabel = filterLabel ?? '';
    }

    public getAuthorizationHeader(): string {
        const auth = btoa(`${this.email}:${this.apiToken}`);
        return `Basic ${auth}`;
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
            fields: ["summary", "status", "description", "status", "priority", this.storyPointsFieldId]
        })
    }

    public getUpdateIssueBody(value: number): string {
        return JSON.stringify({
            fields: {
                [this.storyPointsFieldId]: value
            }
        });
    }

    public getUpdateIssueUrl(id: string): string {
        return `${this.baseUrl}/issue/${id}`;
    }
}
export default JiraIntegration;