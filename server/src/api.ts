import express from "express";
import path from "path";
import passport from "passport";
import cookieSession from "cookie-session";
import compression from "compression";
import cors from "cors";

import roomsRouter from "./routes/RoomsRouter";
import authRouter from "./routes/AuthRouter";
import { checkLoggedIn } from "./middleware/validationMiddleware";
import { patchSession } from "./infrastructure/session/sessionPatcher";
import issuesRouter from "./routes/IssuesRouter";
import integrationRouter from "./routes/IntegrationRouter";
import { RequestUser } from "./infrastructure/auth/types";
import joinRouter from "./routes/JoinRouter";

const api = express();

api.use(express.urlencoded({ extended: true }));
api.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "https://scrumspoker.com"], // Change this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies (if needed)
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

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

// compress all responses to improve performance
api.use(compression());

api.use("/auth", authRouter);
api.use("/rooms", roomsRouter);
api.use("/join", joinRouter);
api.use("/integration", integrationRouter);
api.use("/issues", issuesRouter);

api.use("/admin", checkLoggedIn);

api.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

api.use("/app", express.static(path.join(__dirname, "..", "public")));

api.get("/login", (req, res) => {
  if (req.session!.returnTo === "/admin") {
    res.sendFile(path.join(__dirname, "..", "public", "admin-login.html"));
  } else {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
  }
});

api.post("/login", (req, res) => {
  let name = req.body.name?.trim();
  const guestUserId = crypto.randomUUID();

  if (!name) {
    name = "Anonymous Panda";
  }

  if (req.session) {
    req.session.guestUser = {
      id: guestUserId,
      name,
      incognito: !req.body.name?.trim(),
    };
  }

  const redirectUrl = req.session!.returnTo;

  delete req.session!.returnTo;

  return res.redirect(redirectUrl);
});

api.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
  req.session = null;
});

api.get("/api/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as RequestUser;
    // Passport attaches the user object to req.user
    res.json({
      id: user.profile.id,
      name: user.profile.name,
      // @ts-ignore
      picture: user.profile.picture,
      accessTokenType: user.accessTokenType,
    });
  } else if (req.session?.guestUser) {
    res.json({
      id: req.session?.guestUser.id,
      // @ts-ignore
      name: req.session?.guestUser.name,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default api;
