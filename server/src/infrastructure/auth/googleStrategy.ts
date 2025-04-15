import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ACCESS_TOKEN_TYPES } from "./types";

const isProduction = process.env.NODE_ENV === "production";

const AUTH_OPTIONS = {
  callbackURL: `${
    isProduction ? process.env.SECURE_DOMAIN : process.env.DOMAIN
  }/auth/google/callback`,
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
};

function verifyCallback(
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) {
  done(null, {
    profile: {
      id: profile.id,
      picture: profile._json?.picture,
    },
    accessToken,
    accessTokenType: ACCESS_TOKEN_TYPES.GOOGLE,
    refreshToken,
  });
}

export default new GoogleStrategy(AUTH_OPTIONS, verifyCallback);
