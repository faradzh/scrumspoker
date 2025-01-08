import { z } from 'zod';

import { CreateRoomSchema } from '../../middleware/validationMiddleware';

export type RoomData = z.infer<typeof CreateRoomSchema>;