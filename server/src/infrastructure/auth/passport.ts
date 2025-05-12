import passport from "passport";

import googleStrategy from "./googleStrategy";
import atlassianStrategy from "./atlassianStrategy";

// configure Passport strategy
passport.use(googleStrategy);

// configure AtlassianStrategy
passport.use("atlassian", atlassianStrategy);

// serialize user
passport.serializeUser((user: any, done) => {
  done(null, {
    profile: {
      id: user.profile.id,
      name: user.profile.name,
      picture: user.profile.picture,
    },
    accessToken: user.accessToken,
    accessTokenType: user.accessTokenType,
  });
});

// deserialize user
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
