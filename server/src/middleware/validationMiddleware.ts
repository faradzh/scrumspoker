import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';


export const EstimationMethodEnum = z.enum(['fibbonachi', 'powerOfTwo', 'tshirtSizes']);

export interface CreateRoomRequest extends Request {
    validatedBody?: z.infer<typeof CreateRoomSchema>;
}

export const CreateRoomSchema = z.object({ 
    name: z.string().min(1, "Room name is required."),
    estimationMethod: EstimationMethodEnum.default('fibbonachi'),
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