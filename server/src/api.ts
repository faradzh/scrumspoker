import express, { Request, Response, NextFunction } from "express";
import path from "path";
import passport from "passport";
import cookieSession from "cookie-session";
import compression from "compression";
import cors from "cors";

import roomsRouter from "./routes/RoomsRouter";
import authRouter from "./routes/AuthRouter";
import { checkLoggedIn } from "./middleware/validationMiddleware";
import { patchSession } from "./infrastructure/session/sessionPatcher";
// import integrationRouter from "./routes/IntegrationRouter";
import issuesRouter from "./routes/IssuesRouter";
import integrationRouter from "./routes/IntegrationRouter";
import { RequestUser } from "./infrastructure/auth/types";

const api = express();

api.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "https://scrumspoker.com"], // Change this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies (if needed)
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Allow specific frontend origin
api.use(cors(corsOptions));

// ✅ Manually handle preflight requests (important)
api.options("*", cors(corsOptions));

api.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET1!, process.env.COOKIE_SECRET2!],
  })
);

api.use(patchSession);

api.use(passport.initialize());
api.use(passport.session());

api.use("/auth", authRouter);

api.get("/login", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

api.use(express.static(path.join(__dirname, "..", "public")));

api.use("/admin", checkLoggedIn);

// compress all responses to improve performance
api.use(compression());

api.use("/rooms", roomsRouter);
api.use("/integration", integrationRouter);
api.use("/issues", issuesRouter);

api.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

api.get("/api/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as RequestUser;
    // Passport attaches the user object to req.user
    res.json({
      id: user.profile.id,
      // @ts-ignore
      picture: user.profile.picture,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default api;
