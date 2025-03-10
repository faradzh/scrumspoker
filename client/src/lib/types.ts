export type Card = {
  id: number;
  link: string;
  value: number;
  ref?: HTMLDivElement;
};

export interface SelectedCards {
  [userId: string]: Card;
}

export type User = {
  id: string;
  picture: string;
  isModerator: boolean;
};

export type Room = {
  name: string;
  estimationMethod: string;
  link: string;
}
