import express, { Request, Response, NextFunction } from "express";
import path from "path";
import passport from "passport";
import cookieSession from "cookie-session";

import roomsRouter from "./routes/RoomsRouter";
import authRouter from "./routes/AuthRouter";
import { checkLoggedIn } from "./middleware/validationMiddleware";
import { patchSession } from "./infrastructure/session/sessionPatcher";

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

api.use(express.static(path.join(__dirname,  "../", "public")));
api.use(express.json());

api.use('/rooms', roomsRouter);

api.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public",  "../", "index.html"));
});

api.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "public",  "../", "admin.html"));
});


export default api;