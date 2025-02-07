import type { Card } from "./lib/types";

export const POKER_CARDS: Card[]  = [
    {
        id : 1,
        value : 1,
        link: '/cards/1.svg'
    },
    {
        id: 2,
        value : 2,
        link: '/cards/2.svg'
    },
    {
        id: 3,
        value: 3,
        link: '/cards/3.svg'
    },
    {
        id: 4,
        value: 4,
        link: '/cards/4.svg'
    },
    {
        id: 5,
        value: 5,
        link: '/cards/5.svg'
    },
    {
        id: 6,
        value: 6,
        link: '/cards/6.svg'
    },
    {
        id: 7,
        value: 7,
        link: '/cards/7.svg'
    },
    {
        id: 8,
        value: 8,
        link: '/cards/8.svg'
    },
    {
        id: 9,
        value: 9,
        link: '/cards/9.svg'
    }
] as const;

    