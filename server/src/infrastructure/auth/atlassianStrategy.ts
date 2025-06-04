// @ts-ignore until the types are installed
import { Strategy as AtlassianStrategy } from "passport-atlassian-oauth2";
import refresh from "passport-oauth2-refresh";

import { ACCESS_TOKEN_TYPES } from "./types";
import { mongoUserRepository } from "../../interfaceAdapters/controllers/constants";

const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? process.env.JIRA_REDIRECT_URL_PROD
    : process.env.JIRA_REDIRECT_URL_DEV;

const AUTH_OPTIONS = {
  clientID: process.env.JIRA_CLIENT_ID,
  clientSecret: process.env.JIRA_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  authorizationURL: "https://auth.atlassian.com/authorize",
  tokenURL: "https://auth.atlassian.com/oauth/token",
  scope: [
    "offline_access",
    "read:me",
    "read:jira-user",
    "read:jira-work",
    "write:jira-work",
  ],
};

async function verifyCallback(
  accessToken: string,
  refreshToken: string,
  params: any,
  profile: any,
  done: any
) {
  try {
    // fetch user profile
    const response = await fetch("https://api.atlassian.com/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userProfile = await response.json();

    await mongoUserRepository.findOrSaveUser({
      id: userProfile.account_id,
      accessToken,
      refreshToken,
    });

    done(null, {
      accessToken,
      accessTokenType: ACCESS_TOKEN_TYPES.ATLASSIAN,
      params,
      profile: {
        id: userProfile.account_id,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
      },
    });
  } catch (error) {
    done(error);
  }
}

const atlassianStrategy = new AtlassianStrategy(AUTH_OPTIONS, verifyCallback);

atlassianStrategy.name = "atlassian";

// use refresh token strategy
refresh.use(atlassianStrategy);

export default atlassianStrategy;
