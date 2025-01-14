import passport from "passport";
import googleStrategy from "./googleStrategy";

// Configure Passport strategies
passport.use(googleStrategy);

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, email: user.email });
});

// Deserialize user
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;