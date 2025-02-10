import { get, writable } from "svelte/store";
import type { Card, Room, SelectedCard, User } from "./lib/types";
import type { Socket } from "socket.io-client";

export const selectedCards = writable<SelectedCard[]>([]);

export const currentUser = writable<User>();

export const modalStore = writable({ isOpen: false });

export const rooms = writable<Room[]>([]);

export const session = writable<any>();

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
    (selectedCard) => selectedCard.userId === get(currentUser)?.id
  );
  if (!isAlreadySelected) {
    selectedCards.update((currentCards) => [
      ...currentCards,
      { ...card, userId: get(currentUser)?.id },
    ]);
    socket.emit("estimation", { userId: get(currentUser)?.id, selectedCard: card });
  }
};
