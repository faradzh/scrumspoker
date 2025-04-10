import type { SelectedCard } from "./lib/types";

export interface UserEstimate {
  [userId: string]: SelectedCard;
}

export interface IssueEstimates {
  [issueId: string]: UserEstimate;
}
