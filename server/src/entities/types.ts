import {z} from 'zod';

import { EstimationMethodEnum } from '../types';
import { Profile } from 'passport';

export type EstimationMethod = z.infer<typeof EstimationMethodEnum>;
export interface User extends Profile {
    estimate?: number;
}