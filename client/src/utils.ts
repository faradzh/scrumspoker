import { get } from "svelte/store";
import { POKER_CARDS } from "./constants";
import type { Card } from "./lib/types";
import { calculateAverage } from "./lib/utils";
import {
  currentUser,
  issuesStore,
  participants,
  selectedCards,
  sessionInfo,
} from "./store";
import type { IssueEstimates, UserEstimate } from "./types";

export function getCardByValue(value: number): Card | undefined {
  return POKER_CARDS.find((card) => card.value === value);
}

export async function initRoom(data: any) {
  currentUser.update((prevUser) => ({
    ...prevUser,
    isModerator: prevUser.id === data.moderatorId,
  }));

  const initialSelectedCards: IssueEstimates = {};

  for (const issueId in data.estimates) {
    const estimate = data.estimates[issueId];
    const userIds = Object.keys(estimate);
    const userEstimate: UserEstimate = {};

    for (const userId of userIds) {
      const card = getCardByValue(Number(estimate[userId]))!;
      userEstimate[userId] = {
        ...card,
        userId,
      };
    }

    initialSelectedCards[issueId] = userEstimate;
  }

  selectedCards.set(initialSelectedCards);

  if (data.revealedIssues?.length) {
    for (const revealedIssueId of data.revealedIssues) {
      sessionInfo.update((prevSession) => {
        return {
          ...prevSession,
          [revealedIssueId]: {
            cardsAreFlipped: true,
            estimationIsRevealed: true,
          },
        };
      });
    }
  }

  if (data.estimatedIssues?.length) {
    issuesStore.update((state) => ({
      ...state,
      estimated: data.estimatedIssues,
    }));
  }

  participants.set(data.participants);

  issuesStore.update((state) => ({
    ...state,
    totalEstimationPerIssue: getActualTotalEstimationPerIssue(data),
  }));
}

function getActualTotalEstimationPerIssue(data: any) {
  const totalEstimationPerIssue: Record<string, number> = {};

  for (const revealedIssueId of data.revealedIssues) {
    totalEstimationPerIssue[revealedIssueId] =
      data.totalEstimationPerIssue[revealedIssueId] ||
      calculateAverage(get(selectedCards)[revealedIssueId]);
  }

  return totalEstimationPerIssue;
}
