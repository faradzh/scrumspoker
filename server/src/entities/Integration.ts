import { IntegrationTypeEnum } from "../useCases/constants";

export interface Integration {
  type: IntegrationTypeEnum;
  filterLabel: string;
  domainUrl: string;
  projectName?: string;
  id?: string;
  cloudId?: string;
  storyPointsFieldId?: string;
  email?: string;
  apiToken?: string;
  accessToken?: string;
  refreshToken?: string;
  name: string;
  baseUrl?: string;
  // e.g. "ToEstimate", the label of the issue to estimate
  getAuthorizationHeader(): string;
  getSearchUrl(): string;
  getSearchBody(): string;
  getUpdateIssueUrl(id: string): string;
  getUpdateIssueBody(value: number): string;
}
