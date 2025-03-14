import { IntegrationTypeEnum } from "../useCases/constants";

export interface IntegrationRequestData {
    id: IntegrationTypeEnum
    email: string;
    apiToken: string;
    projectName: string;
    filterLabel: string;
}

export interface Integration extends IntegrationRequestData {
    name: string;
    baseUrl: string;
    // e.g. "ToEstimate", the label of the issue to estimate
    getAuthorizationHeader(): string;
    getSearchUrl(): string;
    getSearchBody(): string;
    getUpdateIssueUrl(id: string): string;
    getUpdateIssueBody(value: number): string;
}