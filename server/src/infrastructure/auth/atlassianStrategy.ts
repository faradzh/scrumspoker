// @ts-ignore until the types are installed
import { Strategy as AtlassianStrategy } from "passport-atlassian-oauth2";

import { ACCESS_TOKEN_TYPES } from "./types";

const AUTH_OPTIONS = {
  clientID: process.env.JIRA_CLIENT_ID,
  clientSecret: process.env.JIRA_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/jira/callback",
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

    done(null, {
      accessToken,
      accessTokenType: ACCESS_TOKEN_TYPES.ATLASSIAN,
      params,
      refreshToken,
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

export default new AtlassianStrategy(AUTH_OPTIONS, verifyCallback);
