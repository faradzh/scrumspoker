import { POKER_CARDS } from "./constants";
import type { Card } from "./lib/types";
import { currentUser, participants, selectedCards, sessionInfo } from "./store";
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

  for (let issueId in data.estimates) {
    const estimate = data.estimates[issueId];
    const userIds = Object.keys(estimate);
    const userEstimate: UserEstimate = {};

    for (let userId of userIds) {
      const card = getCardByValue(Number(estimate[userId]))!;
      userEstimate[userId] = {
        ...card,
        userId,
      };
    }

    initialSelectedCards[issueId] = userEstimate;
  }

  selectedCards.set(initialSelectedCards);

  if (data.estimatedIssues?.length) {
    for (let estimatedIssueId of data.estimatedIssues) {
      sessionInfo.update((prevSession) => {
        return {
          ...prevSession,
          [estimatedIssueId]: {
            cardsAreFlipped: true,
            estimationIsRevealed: true,
          },
        };
      });
    }
  }

  participants.set(data.participants);
}
