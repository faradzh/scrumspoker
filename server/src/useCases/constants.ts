import JiraIntegration from "../entities/JiraIntegration";

export enum IntegrationTypeEnum {
    JIRA = 'JIRA',
    ASANA = 'ASANA'
};

export const INTEGRATIONS = {
    [IntegrationTypeEnum.JIRA]: {
        name: 'Jira',
        url: 'https://bishkek.atlassian.net/rest/api/3'
    },
    [IntegrationTypeEnum.ASANA]: {
        name: 'Asana',
        url: 'https://asana.com'
    }
} as const;

export const INTEGRATION_CLASSES = {
    [IntegrationTypeEnum.JIRA]: JiraIntegration,
    [IntegrationTypeEnum.ASANA]: JiraIntegration
} as const;