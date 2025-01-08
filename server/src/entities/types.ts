import {z} from 'zod';

import { EstimationMethodEnum } from '../middleware/validationMiddleware';

export type EstimationMethod = z.infer<typeof EstimationMethodEnum>;
export interface User {
    id: string;
}