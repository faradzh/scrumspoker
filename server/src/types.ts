import { z } from 'zod';

import { CreateRoomSchema } from './middleware/validationMiddleware';
import CreateRoom from './useCases/CreateRoom';
import JoinRoom from './useCases/JoinRoom';

export type RoomData = z.infer<typeof CreateRoomSchema>;

export const EstimationMethodEnum = z.enum(['fibbonachi', 'powerOfTwo', 'tshirtSizes']);

export type RoomUseCase = CreateRoom | JoinRoom;