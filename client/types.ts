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
}