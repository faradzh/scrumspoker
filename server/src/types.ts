import { z } from 'zod';

import { CreateRoomSchema } from './middleware/validationMiddleware';

export type RoomData = z.infer<typeof CreateRoomSchema>;

export const EstimationMethodEnum = z.enum(['fibbonachi', 'powerOfTwo', 'tshirtSizes']);