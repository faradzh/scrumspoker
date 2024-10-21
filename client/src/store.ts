import { writable } from "svelte/store";

export type SelectedCard = {
  id: string;
  link: string;
  ref?: HTMLDivElement;
};

export type User = {
  id: string;
  isModerator: boolean;
};

export const selectedCards = writable<SelectedCard[]>([]);

export const userStore = writable<User>();
