import anime from "animejs";
import { get } from "svelte/store";

import type { Card, SelectedCard } from "./types";
import { currentUser, selectedCards, totalEstimate } from "../store";
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
  selectedCards.update(() => []);
}

export function revealCards() {
  const refList = get(selectedCards).map((pokerCard) => pokerCard.ref!);
  
  flipHandler(refList, () => {
    const total = calculateAverage();
    totalEstimate.set(total);
  });

  socket.emit('reveal');
}

export function calculateAverage(): number {
  const cards = get(selectedCards);

  const sum = cards.reduce((acc, card) => acc + card.value, 0);
  return sum / cards.length;
}

export const addCardRef = (card: SelectedCard, cardRef: HTMLDivElement) => {
  selectedCards.update((currentCards) => {
    const nextCards = [...currentCards];
    const updateCardIdx = currentCards.findIndex(
      (currentCard) => currentCard.id == card.id
    );
    nextCards[updateCardIdx].ref = cardRef;
    return nextCards;
  });
};

export const selectCard = (socket: Socket, card: Card) => {
  const isAlreadySelected = Array.from(get(selectedCards)).find(
    (selectedCard) => selectedCard.user.id === get(currentUser)?.id
  );
  if (!isAlreadySelected) {
    selectedCards.update((currentCards) => [
      ...currentCards,
      { ...card, user: get(currentUser)},
    ]);
    socket.emit("estimation", {
      selectedCard: {...card, user: get(currentUser)}
    });
  }
};