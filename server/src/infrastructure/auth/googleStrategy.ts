import { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const isProduction = process.env.NODE_ENV === "production";

const AUTH_OPTIONS = {
    callbackURL: `${isProduction ? process.env.SECURE_DOMAIN : process.env.DOMAIN}/auth/google/callback`,
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
}
  
function verifyCallback(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    console.log("Google Profile", profile);
    done(null, profile);
};

export default new GoogleStrategy(AUTH_OPTIONS, verifyCallback);
  