import anime from "animejs";
import { get } from "svelte/store";

import type { Card, SelectedCard, SelectedCards } from "./types";
import { cardRefsStore, currentUser, selectedCards, sessionInfo, totalEstimate } from "../store";
import { socket } from "../sockets";
import type { Socket } from "socket.io-client";

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
    scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: onComplete
  });
}

export function reEstimateHandler() {
  // selectedCards.update(() => []);
  // cardRefsStore.update(() => []);
  // resetTimer();
  // totalEstimate.set(0);
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
  socket.emit('reveal', ({status}: any) => {
    if (status === 'success') {
      console.log('The estimation was revealed');
      sessionInfo.update((info) => {
        info.estimationIsRevealed = true;
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

  flipHandler(cardRefs, () => {
    sessionInfo.update((info) => {
      info.cardsAreFlipped = true;
      return info;
    });

    const total = calculateAverage(get(selectedCards)) || 0;
    totalEstimate.set(total);
  });
};

export function calculateAverage(selectedCards: SelectedCards): number {
  const cards = Object.values(selectedCards);

  const sum = cards.reduce((acc, card) => acc + card.value, 0);
  return sum / cards.length;
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
  const session = get(sessionInfo);
  if (session.estimationIsRevealed || session.cardsAreFlipped) {
    return;
  }

  estimationHandler({selectedCard: { ...card, userId: get(currentUser).id}});

  socket.emit("estimation", {
    selectedCard: {...card, userId: get(currentUser).id}
  });
};

export const estimationHandler = ({selectedCard}: {selectedCard: SelectedCard}) => {
  const userId = selectedCard.userId;
  const updatedCards = {...get(selectedCards)};

  updatedCards[userId] = selectedCard;

  selectedCards.set(updatedCards);
};