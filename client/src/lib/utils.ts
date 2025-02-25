import anime from "animejs";
import { get } from "svelte/store";

import type { Card, SelectedCard } from "./types";
import { cardRefsStore, currentUser, selectedCards, sessionInfo, totalEstimate } from "../store";
import { socket } from "../sockets";
import type { Socket } from "socket.io-client";
import { TIMER_INIT } from "../constants";
import { timerState } from "../state.svelte";

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
  timerState.value = TIMER_INIT;
  clearInterval(timerState.interval);
}

export function revealCards() {
  const cardRefs = get(cardRefsStore);
  
  if (cardRefs.length === 0) {
    return;
  }

  revealHandler();

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
    const total = calculateAverage();
    totalEstimate.set(total);
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
  estimationHandler({selectedCard: { ...card, userId: get(currentUser).id}});

  socket.emit("estimation", {
    selectedCard: {...card, user: get(currentUser)}
  });
};

export const estimationHandler = ({selectedCard}: {selectedCard: SelectedCard}) => {
  const myCardIndex = get(selectedCards).findIndex(
    (currentCard) => currentCard.userId === selectedCard.userId
  );

  const updatedCards = [...get(selectedCards)];
  
  if (myCardIndex === -1) {
    updatedCards.push(selectedCard);
  } else {
    updatedCards[myCardIndex] = selectedCard;
  }

  selectedCards.set(updatedCards);
};