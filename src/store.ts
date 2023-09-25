import { writable } from "svelte/store";

export type SelectedCard = {
  id: string;
  link: string;
  ref?: HTMLDivElement;
};
export const selectedCards = writable<SelectedCard[]>([]);
