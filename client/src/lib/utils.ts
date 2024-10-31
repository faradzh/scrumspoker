import type { Card } from "./types";

export function compareLinks(a: Card, b: Card): number {
  if (a.link < b.link) {
    return -1;
  }
  if (a.link > b.link) {
    return 1;
  }
  return 0;
}
