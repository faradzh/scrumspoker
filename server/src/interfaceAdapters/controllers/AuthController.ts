import { Request, Response } from "express";

export const failureHandler = (req: Request, res: Response) => {
  res.status(401).send("Failed to authenticate");
};

export const logoutHandler = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/");
  });
};