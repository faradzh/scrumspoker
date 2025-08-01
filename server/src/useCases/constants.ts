import JiraIntegration from "../entities/JiraIntegration";
import JiraIntegrationOauth from "../entities/JiraOauthIntegration";
import JiraIssueTransformer from "../interfaceAdapters/presenters/JiraIssueTransformer";

export enum IntegrationTypeEnum {
  JIRA = "JIRA",
  ASANA = "ASANA",
}

export const INTEGRATIONS = {
  [IntegrationTypeEnum.JIRA]: {
    name: "Jira",
    storyPointsFieldId: "customfield_10016",
  },
  [IntegrationTypeEnum.ASANA]: {
    name: "Asana",
  },
} as const;

export const INTEGRATION_CLASSES = {
  [IntegrationTypeEnum.JIRA]: JiraIntegration,
  [IntegrationTypeEnum.ASANA]: JiraIntegration,
} as const;

export const INTEGRATION_TYPES = {
  [IntegrationTypeEnum.JIRA]: JiraIntegration,
  [IntegrationTypeEnum.ASANA]: undefined,
} as const;

export const OAUTH2INTEGRATION_CLASSES = {
  [IntegrationTypeEnum.JIRA]: JiraIntegrationOauth,
  [IntegrationTypeEnum.ASANA]: JiraIntegrationOauth,
} as const;

export const ISSUE_TRANSFORMERS = {
  [IntegrationTypeEnum.JIRA]: JiraIssueTransformer,
  [IntegrationTypeEnum.ASANA]: undefined,
} as const;
