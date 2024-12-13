import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Trophy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  completed?: boolean;
  streak?: number;
  onDelete: () => void;
}

interface UserStats {
  id: number;
  user_id: string;
  total_tasks_completed: number;
  current_streak: number;
  longest_streak: number;
  points: number;
  last_completed_at: string | null;
  updated_at: string;
}

export function TaskCard({ 
  id,
  title, 
  description,
  duration, 
  priority, 
  deadline,
  completed = false,
  streak = 0,
  onDelete
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const { toast } = useToast();

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Get or create user stats
  const { data: userStats, refetch: refetchStats } = useQuery<UserStats>({
    queryKey: ['userStats', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Try to get existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (existingStats) {
        return existingStats;
      }

      // If no stats exist, create new entry
      const { data: newStats, error: insertError } = await supabase
        .from('user_stats')
        .insert([{
          user_id: user!.id,
          total_tasks_completed: 0,
          current_streak: 0,
          longest_streak: 0,
          points: 0,
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user stats:', insertError);
        throw insertError;
      }

      return newStats;
    },
  });

  const handleComplete = async () => {
    if (!user?.id || !userStats) return;

    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);

    if (newCompletedState) {
      const now = new Date();
      const lastCompleted = userStats.last_completed_at ? new Date(userStats.last_completed_at) : null;
      
      let newStreak = userStats.current_streak;
      if (lastCompleted) {
        const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastCompletion <= 24) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const { error: updateError } = await supabase
        .from('user_stats')
        .update({
          total_tasks_completed: (userStats.total_tasks_completed || 0) + 1,
          points: (userStats.points || 0) + 10,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userStats.longest_streak || 0),
          last_completed_at: now.toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating user stats:', updateError);
        return;
      }

      await refetchStats();

      // Check for achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .or(`required_tasks.lte.${userStats.total_tasks_completed + 1},required_streak.lte.${newStreak}`);

      if (achievements) {
        for (const achievement of achievements) {
          const { data: existing } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('achievement_id', achievement.id)
            .eq('user_id', user.id)
            .single();

          if (!existing) {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievement.id,
              });

            toast({
              title: "Achievement Unlocked! 🏆",
              description: `${achievement.name}: ${achievement.description}`,
              duration: 5000,
            });
          }
        }
      }
    }

    toast({
      title: isCompleted ? "Task uncompleted" : "Task completed! 🎉",
      description: isCompleted ? "Task marked as pending" : "Keep up the great work!",
      duration: 3000,
    });
  };

  return (
    <Card className="glass-card task-enter hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge className={priorityColors[priority]}>{priority}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Due: {deadline}</span>
            </div>
          </div>
          {userStats?.current_streak > 0 && (
            <div className="flex items-center gap-2 text-accent">
              <Trophy className="h-4 w-4" />
              <span>{userStats.current_streak} day streak!</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button 
              onClick={handleComplete}
              variant={isCompleted ? "secondary" : "default"}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="icon"
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}