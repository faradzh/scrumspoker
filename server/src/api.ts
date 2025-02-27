import express, { Request, Response, NextFunction } from "express";
import path from "path";
import passport from "passport";
import cookieSession from "cookie-session";
import compression from "compression";

import roomsRouter from "./routes/RoomsRouter";
import authRouter from "./routes/AuthRouter";
import { checkLoggedIn } from "./middleware/validationMiddleware";
import { patchSession } from "./infrastructure/session/sessionPatcher";
import integrationRouter from "./routes/IntegrationRouter";

const api = express();

api.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_SECRET1!, process.env.COOKIE_SECRET2!]
}));

api.use(patchSession);

api.use(passport.initialize());
api.use(passport.session());

api.use('/auth', authRouter);

api.use((req: Request, res: Response, next: NextFunction) => {
  checkLoggedIn(req, res, next);
});

api.use(express.static(path.join(__dirname,  "..", "public")));
api.use(express.json());

// compress all responses to improve performance
api.use(compression());

api.use('/rooms', roomsRouter);
api.use('/integrations', integrationRouter);

api.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

api.get("/api/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Passport attaches the user object to req.user
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default api;