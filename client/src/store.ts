import { writable } from "svelte/store";

import { type SelectedCardsByIssue, type Room, type User } from "./lib/types";

export const selectedCards = writable<SelectedCardsByIssue>({});

export const cardRefsStore = writable<HTMLDivElement[]>([]);

export const currentUser = writable<User>();

export const modalStore = writable({ isOpen: false });

export const rooms = writable<Room[]>([]);

export const sessionInfo = writable<any>({});

export const totalEstimate = writable<number>(0);

export const participants = writable<User[]>([]);
