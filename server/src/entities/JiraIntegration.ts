import { INTEGRATIONS, IntegrationTypeEnum } from "../useCases/constants";
import { Integration } from "./Integration";

class JiraIntegration implements Integration {
    public id = IntegrationTypeEnum.JIRA;
    public name: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].name;
    public baseUrl: string = INTEGRATIONS[IntegrationTypeEnum.JIRA].url;

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
            fields: ["summary", "status", "description", "issueType", "priority", "customfield_10016"]
        })
    }
}
export default JiraIntegration;