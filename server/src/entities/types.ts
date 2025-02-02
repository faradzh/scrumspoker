import {z} from 'zod';

import { EstimationMethodEnum } from '../types';

export type EstimationMethod = z.infer<typeof EstimationMethodEnum>;
export interface User {
    id: string;
    estimate?: number;
}