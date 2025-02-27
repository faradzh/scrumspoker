import { IntegrationTypeEnum } from "../useCases/constants";

export interface IntegrationRequestData {
    id: IntegrationTypeEnum
    email: string;
    apiToken: string;
    projectName: string;
    filterLabel: string;
}

export interface Integration extends IntegrationRequestData{
    id: string;
    name: string;
    baseUrl: string;
    email: string;
    apiToken: string;
    projectName: string;
    // e.g. "ToEstimate", the label of the issue to estimate
    filterLabel: string;
    getAuthorizationHeader(): string;
}