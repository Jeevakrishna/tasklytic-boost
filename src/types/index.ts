export interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon: string;
  earned_at?: string;
}

export interface UserStats {
  id: number;
  user_id: string;
  total_tasks_completed: number;
  current_streak: number;
  longest_streak: number;
  points: number;
  last_completed_at: string | null;
  updated_at: string;
}