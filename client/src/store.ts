import { get, writable } from "svelte/store";
import type { Socket } from "socket.io-client";

import type { Card, Room, SelectedCard, User } from "./lib/types";

export const selectedCards = writable<SelectedCard[]>([]);

export const currentUser = writable<User>();

export const modalStore = writable({ isOpen: false });

export const rooms = writable<Room[]>([]);

export const sessionInfo = writable<any>();

export let totalEstimate = writable<number>(0);
