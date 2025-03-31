import { Profile } from "passport";

export enum ACCESS_TOKEN_TYPES {
  GOOGLE = "google",
  ATLASSIAN = "atlassian",
}

export interface RequestUser extends Express.User {
  profile: Profile;
  accessToken: string;
  accessTokenType?: ACCESS_TOKEN_TYPES;
  refreshToken: string;
}
