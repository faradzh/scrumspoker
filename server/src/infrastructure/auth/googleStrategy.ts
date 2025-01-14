import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const AUTH_OPTIONS = {
    callbackURL: "/auth/google/callback",
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
}
  
function verifyCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
    console.log("Google Profile", profile);
    done(null, profile);
};

export default new GoogleStrategy(AUTH_OPTIONS, verifyCallback);
  