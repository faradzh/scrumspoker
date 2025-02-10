import {test, expect} from 'vitest';

import { getSortedSetAsArrayOfObjects } from "./utils";

test('getSortedSetAsArrayOfObjects', () => {
    const sortedSet = ['1', '2', '3', '4', '5', '6'];
    
    const result = getSortedSetAsArrayOfObjects(sortedSet);

    expect(result).toEqual([
        { userId: '1', value: '2' },
        { userId: '3', value: '4' },
        { userId: '5', value: '6' },
    ]);
});