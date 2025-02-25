import { writable } from "svelte/store";

import type { Room, SelectedCard, User } from "./lib/types";
import { TIMER_INIT } from "./constants";

export const selectedCards = writable<SelectedCard[]>([]);

export const cardRefsStore = writable<HTMLDivElement[]>([]);

export const currentUser = writable<User>();

export const modalStore = writable({ isOpen: false });

export const rooms = writable<Room[]>([]);

export const sessionInfo = writable<any>();

export const totalEstimate = writable<number>(0);

export const participants = writable<User[]>([]);
