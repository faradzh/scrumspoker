export type Card = {
  id: number;
  link: string;
  value: number;
  ref?: HTMLDivElement;
};

export interface SelectedCard extends Card {
  userId: string;
}

export type User = {
  id: string;
  isModerator: boolean;
};

export type Room = {
  name: string;
  estimationMethod: string;
  link: string;
}
