import { POKER_CARDS } from "./constants"
import type { Card } from "./lib/types";

export function getCardByValue(value: string): Card | undefined {
    return POKER_CARDS.find(card => card.value.toString() === value);
}