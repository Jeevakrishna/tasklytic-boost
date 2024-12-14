import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Trophy, Trash2, Repeat } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskActions } from "./task/TaskActions";
import { TaskHeader } from "./task/TaskHeader";
import { TaskStats } from "./task/TaskStats";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  completed?: boolean;
  streak?: number;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
  };
  onDelete: () => void;
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
  recurring,
  onDelete
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Get or create user stats
  const { data: userStats, refetch: refetchStats } = useQuery({
    queryKey: ['userStats', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      // Try to get existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingStats) {
        return existingStats;
      }

      // If no stats exist, create new entry
      const { data: newStats, error: insertError } = await supabase
        .from('user_stats')
        .insert([{
          user_id: user.id,
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
      
      let newStreak = userStats.current_streak || 0;
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
      await queryClient.invalidateQueries({ queryKey: ['achievements'] });

      toast({
        title: "Task completed! 🎉",
        description: recurring 
          ? `Great job! This task will repeat ${recurring.frequency}.`
          : "Keep up the great work!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Task uncompleted",
        description: "Task marked as pending",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="glass-card task-enter hover-scale">
      <TaskHeader title={title} description={description} priority={priority} />
      <CardContent>
        <div className="space-y-3">
          <TaskStats 
            duration={duration} 
            deadline={deadline} 
            streak={userStats?.current_streak || 0} 
          />
          <TaskActions 
            isCompleted={isCompleted}
            onComplete={handleComplete}
            onDelete={onDelete}
            recurring={recurring}
          />
        </div>
      </CardContent>
    </Card>
  );
}