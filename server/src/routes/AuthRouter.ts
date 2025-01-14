import express from "express";

import passport from "../infrastructure/auth/passport";
import { failureHandler, logoutHandler } from "../interfaceAdapters/controllers/AuthController";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", {scope: ["email"]}));

authRouter.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/"
}));

authRouter.get("/failure", failureHandler);

authRouter.get("/logout", logoutHandler);

export default authRouter;