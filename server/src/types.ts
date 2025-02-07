import { z } from 'zod';
import { Profile } from 'passport';

import { CreateRoomSchema } from './middleware/validationMiddleware';
import CreateRoom from './useCases/CreateRoom';
import JoinRoom from './useCases/JoinRoom';
import GetAllRooms from './useCases/GetAllRooms';

export type RoomData = z.infer<typeof CreateRoomSchema>;

export const EstimationMethodEnum = z.enum(['fibbonachi', 'powerOfTwo', 'tshirtSizes']);

export type RoomUseCase = CreateRoom | JoinRoom | GetAllRooms;

export const ProfileSchema: z.ZodType<Profile> = z.object({
    id: z.string(),
    displayName: z.string(),
    provider: z.string()
});