import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { EstimationMethodEnum, RoomData, ProfileSchema } from '../types';

export interface CreateRoomRequest extends Request {
    validatedBody?: RoomData;
}

export const CreateRoomSchema = z.object({ 
    name: z.string().min(1, "Room name is required."),
    estimationMethod: EstimationMethodEnum.default('fibbonachi'),
    moderator: ProfileSchema.optional(),
    integration: z.object({
        id: z.string(),
        email: z.string(),
        apiToken: z.string(),
        projectName: z.string(),
        filterLabel: z.string()
    }).optional()
});

export const validateRoom = (schema: typeof CreateRoomSchema) => (req: CreateRoomRequest, res: Response, next: NextFunction) => {
    try {
        req.validatedBody = schema.parse(req.body);
        next();
    } catch (error) {
        // @ts-ignore
        res.status(400).json({message: error.errors});
    }
}

export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.isAuthenticated() && req.user;
    
    if (!isLoggedIn) {
        req.session!.returnTo = req.originalUrl;
        return res.redirect('/auth/google');
    }
    next();
};