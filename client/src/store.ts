import { derived, get, writable } from "svelte/store";

import {
  type SelectedCardsByIssue,
  type Room,
  type User,
  type Issue,
} from "./lib/types";

export const selectedCards = writable<SelectedCardsByIssue>({});

export const issuesStore = writable<{ list: Issue[]; current: Issue | null }>({
  list: [],
  current: null,
});

export const currentIssueId = derived(
  issuesStore,
  ($issuesStore) => $issuesStore.current?.id
);

export function setCurrentIssue(issue: Issue) {
  if (issue?.id === get(issuesStore).current?.id) {
    return;
  }
  issuesStore.update((s) => ({
    ...s,
    current: issue,
  }));
}

export function setIssuesList(list: Issue[]) {
  issuesStore.update((s) => ({
    ...s,
    list,
  }));
}

export const cardRefsStore = writable<HTMLDivElement[]>([]);

export const currentUser = writable<User>();

export const isModerator = derived(
  currentUser,
  ($currentUser) => $currentUser?.isModerator
);

export const modalStore = writable({ isOpen: false });

export const rooms = writable<Room[]>([]);

export const sessionInfo = writable<any>({});

export const totalEstimate = writable<number>(0);

export const participants = writable<User[]>([]);
