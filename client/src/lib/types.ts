export type Card = {
  id: number;
  link: string;
  value: number;
  ref?: HTMLDivElement;
};
export interface SelectedCard extends Card {
  userId: string;
  issueId?: string;
}
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
  online: boolean;
  name?: string;
};

export type Room = {
  name: string;
  estimationMethod: string;
  link: string;
};

export type Estimate = {
  userId: string;
  value: number;
  issueId?: string;
};

export type Issue = {
  id: string;
  key: string;
  summary: string;
};
