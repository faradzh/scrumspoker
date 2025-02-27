import { z } from 'zod';
import { Profile } from 'passport';

import { CreateRoomSchema } from './middleware/validationMiddleware';
import CreateRoom from './useCases/CreateRoom';
import JoinRoom from './useCases/JoinRoom';
import GetAllRooms from './useCases/GetAllRooms';
import AddIntegration from './useCases/AddIntegration';

export type RoomData = z.infer<typeof CreateRoomSchema>;

export const EstimationMethodEnum = z.enum(['fibbonachi', 'powerOfTwo', 'tshirtSizes']);

export type RoomUseCase = CreateRoom | JoinRoom | GetAllRooms;

export type IntegrationUseCase = AddIntegration;

export const ProfileSchema: z.ZodType<Profile> = z.object({
    id: z.string(),
    displayName: z.string(),
    provider: z.string()
});

export type Estimation = {
    userId: string;
    value: string;
};