import { derived, get, writable } from "svelte/store";

import {
  type SelectedCardsByIssue,
  type Room,
  type User,
  type Issue,
} from "./lib/types";

export const selectedCards = writable<SelectedCardsByIssue>({});

export const issuesStore = writable<{
  current: Issue | null;
  domainUrl: string;
  expandedIssue: Issue | null;
  estimated: string[];
  totalEstimationPerIssue: Record<string, number>;
  initialColumnWidth: number;
}>({
  current: null,
  domainUrl: "",
  expandedIssue: null,
  estimated: [],
  totalEstimationPerIssue: {},
  initialColumnWidth: 0,
});

export const totalEstimation = derived(
  issuesStore,
  ($issuesStore) =>
    ($issuesStore.current &&
      $issuesStore.totalEstimationPerIssue[$issuesStore.current?.id]) ||
    0
);

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

export function setIssues(issues: { data: Issue[]; domainUrl: string }) {
  issuesStore.update((s) => ({
    ...s,
    list: issues.data,
    domainUrl: issues.domainUrl,
  }));
}

export const cardRefsStore = writable<HTMLDivElement[]>([]);

export const currentUser = writable<User>();

export const isModerator = derived(
  currentUser,
  ($currentUser) => $currentUser?.isModerator
);

interface ModalStore {
  isOpen: boolean;
  Content?: any;
  props?: any;
  key: number;
}

export const modalStore = writable<ModalStore>({
  isOpen: false,
  Content: null,
  props: {},
  key: 0,
});

export const formErrors = writable({});

export const rooms = writable<Room[]>([]);

export const sessionInfo = writable<any>({});

export const participants = writable<User[]>([]);
