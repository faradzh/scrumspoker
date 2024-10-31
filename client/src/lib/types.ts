export type Card = {
  id: string;
  link: string;
  ref?: HTMLDivElement;
};

export interface SelectedCard extends Card {
  userId: string;
}

export type User = {
  id: string;
  isModerator: boolean;
};
