import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { EstimationMethodEnum, RoomData, ProfileSchema } from "../types";
import { RequestUser } from "../infrastructure/auth/types";

export interface CreateRoomRequest extends Request<{ user?: RequestUser }> {
  validatedBody?: RoomData;
}

const AtlassianIntegration = z.object({
  id: z.string(),
  projectName: z.string(),
  filterLabel: z.string(),
});

const GoogleIntegraion = z.object({
  id: z.string(),
  email: z.string(),
  apiToken: z.string(),
  projectName: z.string(),
  filterLabel: z.string(),
});

export const getRoomSchema = ({
  accessTokenType,
}: {
  accessTokenType?: string;
}) =>
  z.object({
    name: z.string().min(1, "Room name is required."),
    estimationMethod: EstimationMethodEnum.default("fibbonachi"),
    moderator: ProfileSchema.optional(),
    integration:
      accessTokenType === "google"
        ? GoogleIntegraion.optional()
        : AtlassianIntegration,
  });

export const validateRoom = (
  req: CreateRoomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as RequestUser;
    req.validatedBody = getRoomSchema({
      accessTokenType: user.accessTokenType,
    }).parse(req.body);
    next();
  } catch (error) {
    // @ts-ignore
    res.status(400).json({ message: error.errors });
  }
};

export const checkLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    req.session!.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

export const checkIfIdentified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isLoggedIn = req.isAuthenticated() && req.user;
  const guestUser = req.session?.guestUser;

  if (isLoggedIn || guestUser) {
    next();
  } else {
    req.session!.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
};
