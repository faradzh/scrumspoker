import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { IssueResponse } from "../entities/types";

/**
 * Fetches issues from the integration API
 */
export const fetchIssues = async <T extends keyof IssueResponse>(
  integration: JiraOauthIntegration
): Promise<IssueResponse[T]> => {
  if (!integration) {
    throw new Error("Integration not found");
  }

  const headers = {
    Authorization: integration.getAuthorizationHeader(),
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(integration.getSearchUrl(), {
    method: "POST",
    headers,
    body: integration.getSearchBody(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch issues: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};
