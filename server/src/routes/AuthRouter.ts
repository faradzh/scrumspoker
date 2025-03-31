import express, { Request, Response } from "express";

import passport from "../infrastructure/auth/passport";
// import {
//   failureHandler,
//   logoutHandler,
// } from "../interfaceAdapters/controllers/AuthController";

const authRouter = express.Router();

function redirectCallback(req: Request, res: Response) {
  const redirectUrl = req.session!.returnTo || "/admin";
  delete req.session!.returnTo;
  res.redirect(redirectUrl);
}

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
  }),
  redirectCallback
);

// authRouter.get("/failure", failureHandler);

// authRouter.get("/logout", logoutHandler);

authRouter.get("/jira", passport.authenticate("atlassian"));

authRouter.get(
  "/jira/callback",
  passport.authenticate("atlassian", {
    failureRedirect: "/",
  }),
  redirectCallback
);

export default authRouter;
