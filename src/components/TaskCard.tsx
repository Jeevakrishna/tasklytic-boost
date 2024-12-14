import { Card, CardContent } from "@/components/ui/card";
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
  const [isLoading, setIsLoading] = useState(false);
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

      // First try to get existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

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
        return null;
      }

      return newStats;
    },
  });

  const handleComplete = async () => {
    if (!user?.id || !userStats || isLoading) return;

    try {
      setIsLoading(true);

      // Toggle completion state
      const newCompletionState = !isCompleted;
      setIsCompleted(newCompletionState);

      const now = new Date();
      const lastCompleted = userStats.last_completed_at ? new Date(userStats.last_completed_at) : null;
      
      let newStreak = userStats.current_streak || 0;
      if (newCompletionState) { // Only update streak when completing
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
      } else { // When marking as incomplete
        newStreak = Math.max(0, newStreak - 1);
      }

      // Update user stats in Supabase
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({
          total_tasks_completed: (userStats.total_tasks_completed || 0) + (newCompletionState ? 1 : -1),
          points: (userStats.points || 0) + (newCompletionState ? 10 : -10),
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userStats.longest_streak || 0),
          last_completed_at: newCompletionState ? now.toISOString() : null,
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      await refetchStats();
      await queryClient.invalidateQueries({ queryKey: ['achievements'] });

      toast({
        title: newCompletionState ? "Task completed! 🎉" : "Task marked as incomplete",
        description: newCompletionState && recurring 
          ? `Great job! This task will repeat ${recurring.frequency}.`
          : newCompletionState ? "Keep up the great work!" : "Task status updated",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setIsCompleted(!isCompleted); // Revert state on error
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}