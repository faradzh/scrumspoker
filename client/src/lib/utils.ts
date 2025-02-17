import anime from "animejs";
import { get } from "svelte/store";

import type { Card, SelectedCard } from "./types";
import { cardRefsStore, currentUser, selectedCards, timer, totalEstimate } from "../store";
import { socket } from "../sockets";
import type { Socket } from "socket.io-client";
import { TIMER_INIT } from "../constants";

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
  selectedCards.update(() => []);
  cardRefsStore.update(() => []);
  resetTimer();
  totalEstimate.set(0);
}

function resetTimer() {
  timer.update(t => {
    t.value = TIMER_INIT;
    return t;
  });
  timer.update(t => {
    clearInterval(t.interval);
    return t;
  });
}

export function revealCards() {
  revealHandler();
  socket.emit('reveal');
}

export function revealHandler() {
  resetTimer();

  const cardRefs = get(cardRefsStore);

  console.log('Card refs', cardRefs);

  flipHandler(cardRefs, () => {
    if (cardRefs.length !== 0) {
      const total = calculateAverage();
      totalEstimate.set(total);
    }
  });
};

export function calculateAverage(): number {
  const cards = get(selectedCards);

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
  estimationHandler({selectedCard: { ...card, user: get(currentUser)}});

  socket.emit("estimation", {
    selectedCard: {...card, user: get(currentUser)}
  });
};

export const estimationHandler = ({selectedCard}: {selectedCard: SelectedCard}) => {
  const myCardIndex = get(selectedCards).findIndex(
    (currentCard) => currentCard.user?.id === selectedCard.user?.id
  );

  const updatedCards = [...get(selectedCards)];
  
  if (myCardIndex === -1) {
    updatedCards.push(selectedCard);
  } else {
    updatedCards[myCardIndex] = selectedCard;
  }

  selectedCards.set(updatedCards);
};