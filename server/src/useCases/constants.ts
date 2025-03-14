import JiraIntegration from "../entities/JiraIntegration";
import JiraIssueTransformer from "../interfaceAdapters/presenters/JiraIssueTransformer";

export enum IntegrationTypeEnum {
    JIRA = 'JIRA',
    ASANA = 'ASANA'
};

export const INTEGRATIONS = {
    [IntegrationTypeEnum.JIRA]: {
        name: 'Jira',
        url: 'https://bishkek.atlassian.net/rest/api/3',
        storyPointsFieldId: 'customfield_10016'
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

export const INTEGRATION_TYPES = {
    [IntegrationTypeEnum.JIRA]: JiraIntegration,
    [IntegrationTypeEnum.ASANA]: undefined
} as const;

export const ISSUE_TRANSFORMERS = {
    [IntegrationTypeEnum.JIRA]: JiraIssueTransformer,
    [IntegrationTypeEnum.ASANA]: undefined
} as const;