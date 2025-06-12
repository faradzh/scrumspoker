import type { Card } from "./lib/types";

export const TIMER_INIT = 10;

export const POKER_CARDS: Card[] = [
  {
    id: 1,
    value: 1,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 2,
    value: 2,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 3,
    value: 3,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 4,
    value: 5,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 5,
    value: 8,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 6,
    value: 13,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 7,
    value: 20,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 8,
    value: 40,
    link: "/app/cards/main-card.webp",
  },
  {
    id: 9,
    value: 100,
    link: "/app/cards/main-card.webp",
  },
] as const;
