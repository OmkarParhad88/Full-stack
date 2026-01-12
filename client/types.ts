export type FightForm = {
  title: string;
  description: string;
}

export interface FightCardProps {
  title: string;
  description: string;
  image: string;
  created_at: string;
  expire_at: string;
  userId: number;
  id: number;
  fight_comments: FightComment[];
  fight_items: FightItem[];
}

export interface FightItemForm {
  image: File | null;
}

export interface FightCommentForm {
  comment: string;
}

export interface FightItem {
  id: number;
  fightId: number;
  count: number;
  image: string;
}

export interface FightComment {
  id: number;
  fightId: number;
  comment: string;
  createdAt: string;
}
