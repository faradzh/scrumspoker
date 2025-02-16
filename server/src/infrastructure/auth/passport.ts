import passport from "passport";
import googleStrategy from "./googleStrategy";

// configure Passport strategy
passport.use(googleStrategy);

// serialize user
passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, picture: user._json.picture });
});

// deserialize user
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;