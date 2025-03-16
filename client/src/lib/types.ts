export type Card = {
  id: number;
  link: string;
  value: number;
  ref?: HTMLDivElement;
};

export interface SelectedCard extends Card {
  userId: string;
};
export interface SelectedCards {
  [userId: string]: SelectedCard;
}

export interface SelectedCardsByIssue {
  [issueId: string]: SelectedCards;
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

export type Estimate = {
  userId: string;
  value: number;
};