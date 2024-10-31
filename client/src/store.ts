import { writable } from "svelte/store";
import type { SelectedCard, User } from "./lib/types";

export const selectedCards = writable<SelectedCard[]>([]);

export const userStore = writable<User>();
