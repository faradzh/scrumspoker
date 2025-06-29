import JiraOauthIntegration from "../entities/JiraOauthIntegration";
import { IssueResponse } from "../entities/types";
import { RequestUser } from "../infrastructure/auth/types";
import { refreshTokens } from "../interfaceAdapters/controllers/constants";

/**
 * Fetches issues from the integration API
 */
export const fetchIssues = async <T extends keyof IssueResponse>(
  integration: JiraOauthIntegration,
  user: RequestUser
): Promise<IssueResponse[T]> => {
  return fetchIntegrationData(integration, user, {
    authHeader: integration.getAuthorizationHeader(),
    url: integration.getSearchUrl(),
    body: integration.getSearchBody(),
  });
};

let refreshInProgress: Promise<any> | null = null;

export async function fetchIntegrationData(
  integration: JiraOauthIntegration,
  user: RequestUser,
  {
    authHeader,
    url,
    method = "POST",
    body,
  }: {
    authHeader: string;
    url: string;
    method?: string;
    body?: string;
  }
) {
  if (!integration) {
    throw new Error("Integration is not provided");
  }

  const headers = {
    Authorization: authHeader,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (response.status === 204) {
    console.log("No content returned from the API");
    return { status: 204 };
  }

  const data = await response.json();

  if (data.code === 401) {
    if (refreshInProgress) {
      console.log("Waiting for ongoing token refresh to complete...");
      await refreshInProgress;
    } else {
      console.error("Access token expired, refreshing tokens...");
      refreshInProgress = refreshTokens.execute(user);
      const { accessToken } = await refreshInProgress;
      refreshInProgress = null;

      if (accessToken) {
        // Update integration access token
        integration.accessToken = accessToken;

        if (user.profile) {
          // Update access token if authenticated user
          user.accessToken = accessToken;
        }
        // Retry fetching data with the new access token
        return fetchIntegrationData(integration, user, {
          authHeader: integration.getAuthorizationHeader(),
          url,
          body,
          method,
        });
      }
    }
  }

  return data;
}
