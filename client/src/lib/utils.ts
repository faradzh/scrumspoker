import anime from "animejs";
import { get } from "svelte/store";

import type { Card, SelectedCard, SelectedCards, User } from "./types";
import {
  cardRefsStore,
  currentIssueId,
  currentUser,
  issuesStore,
  participants,
  selectedCards,
  sessionInfo,
} from "../store";
import { socket } from "../sockets";
import type { Socket } from "socket.io-client";
import { resetTimer } from "../state.svelte";

export function compareLinks(a: Card, b: Card): number {
  if (a.link < b.link) {
    return -1;
  }
  if (a.link > b.link) {
    return 1;
  }
  return 0;
}

export function flipHandler(targets: HTMLDivElement[], onComplete: () => void) {
  anime({
    targets,
    scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
    rotateY: { value: "+=180", delay: 200 },
    easing: "easeInOutSine",
    duration: 400,
    complete: onComplete,
  });
}

export function revealCards() {
  const cardRefs = get(cardRefsStore);

  if (cardRefs.length === 0) {
    return;
  }

  revealHandler();
  emitRevealEvent();
}

function emitRevealEvent() {
  const issueId = get(currentIssueId);

  socket.emit("reveal", { issueId }, ({ status }: any) => {
    if (status === "success") {
      if (!issueId) {
        return;
      }
      sessionInfo.update((info) => {
        info[issueId] = {
          ...info[issueId],
          estimationIsRevealed: true,
        };
        return info;
      });
    }
  });
}

export function revealHandler() {
  const cardRefs = get(cardRefsStore);

  if (cardRefs.length === 0) {
    return;
  }

  const issueId = get(currentIssueId);
  const session = get(sessionInfo);

  if (!issueId) {
    return;
  }

  if (
    session[issueId]?.estimationIsRevealed ||
    session[issueId]?.cardsAreFlipped
  ) {
    return;
  }

  flipHandler(cardRefs, () => {
    sessionInfo.update((info) => {
      info[issueId] = {
        ...info[issueId],
        cardsAreFlipped: true,
      };
      return info;
    });

    const total = calculateAverage(get(selectedCards)[issueId]) || 0;

    issuesStore.update((s) => {
      s.totalEstimationPerIssue[issueId] = total;
      return s;
    });
  });
}

export function calculateAverage(selectedCards: SelectedCards): number {
  if (!selectedCards) return 0;

  const cards = Object.values(selectedCards);
  if (cards.length === 0) return 0;

  const sum = cards.reduce((acc, card) => acc + (card.value ?? 0), 0);
  const average = sum / cards.length;

  return parseFloat(average.toFixed(2));
}

export const addCardRef = (cardRef: HTMLDivElement) => {
  const cardRefIndex = get(cardRefsStore).findIndex(
    (currentRef) => currentRef === cardRef
  );

  const updatedCardRefs = [...get(cardRefsStore)];

  if (cardRefIndex === -1) {
    updatedCardRefs.push(cardRef);
  } else {
    updatedCardRefs[cardRefIndex] = cardRef;
  }

  cardRefsStore.set(updatedCardRefs);
};

export const selectCard = (socket: Socket, card: Card) => {
  const issueId = get(currentIssueId);
  const user = get(currentUser);
  const session = get(sessionInfo);

  if (!issueId) {
    return;
  }

  if (
    session[issueId]?.estimationIsRevealed ||
    session[issueId]?.cardsAreFlipped
  ) {
    return;
  }

  estimationHandler({ selectedCard: { ...card, userId: user.id, issueId } });

  socket.emit("estimation", {
    selectedCard: { ...card, userId: user.id, issueId },
  });
};

export const estimationHandler = ({
  selectedCard,
}: {
  selectedCard: SelectedCard;
}) => {
  const userId = selectedCard.userId;
  const updatedCards = { ...get(selectedCards) };
  const issueId = get(currentIssueId);

  if (!issueId) {
    return;
  }

  updatedCards[issueId] = {
    ...updatedCards[issueId],
    [userId]: selectedCard,
  };

  selectedCards.set(updatedCards);
};

export const onRoomJoin = ({ user }: { user: User }) => {
  const userIndex = get(participants).findIndex(
    (participant) => participant.id === user.id
  );
  let prevList = get(participants);

  if (userIndex !== -1) {
    prevList[userIndex] = user;
  } else {
    prevList = [...prevList, user];
  }

  participants.set(prevList);
};

export const onRoomLeave = ({ user }: { user: User }) => {
  participants.update((prevParticipants) => {
    const userIndex = prevParticipants.findIndex(
      (prevUser) => prevUser.id === user.id
    );
    prevParticipants[userIndex] = { ...user, online: false };
    return prevParticipants;
  });
};

export function getAbbreviation(name?: string) {
  if (!name) {
    return "";
  }
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0][0];
}

export function resetEstimation() {
  socket.emit(
    "resetEstimation",
    {
      issueId: get(currentIssueId),
    },
    ({ status, message }: { status: string; message: string }) => {
      if (status === "success") {
        resetEstimationHandler(get(currentIssueId)!);
      } else {
        console.error(message);
      }
    }
  );
}

export function resetEstimationHandler(issueId: string) {
  selectedCards.update((cards) => {
    if (cards[issueId]) {
      delete cards[issueId];
    }
    return cards;
  });
  // figure this out
  cardRefsStore.update((refs) => {
    return refs.filter((ref) => ref.dataset.issueId !== issueId);
  });
  resetTimer();

  sessionInfo.update((info) => {
    if (issueId) {
      delete info[issueId];
    }
    return info;
  });
  issuesStore.update((s) => {
    s.estimated = s.estimated.filter((id) => id !== issueId);
    delete s.totalEstimationPerIssue[issueId];
    return s;
  });
}
