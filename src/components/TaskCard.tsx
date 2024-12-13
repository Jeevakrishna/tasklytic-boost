import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Trophy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleComplete = async () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);

    if (newCompletedState) {
      // Get current user stats or create new entry if doesn't exist
      const { data: existingStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!existingStats) {
        // Create new stats entry for user
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            total_tasks_completed: 1,
            points: 10,
            current_streak: 1,
            longest_streak: 1,
            last_completed_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating user stats:', insertError);
          return;
        }
      } else {
        // Update existing stats
        const updates = {
          total_tasks_completed: (existingStats.total_tasks_completed || 0) + 1,
          points: (existingStats.points || 0) + 10,
          last_completed_at: new Date().toISOString(),
        };

        // Calculate streak
        const lastCompleted = existingStats.last_completed_at ? new Date(existingStats.last_completed_at) : null;
        const now = new Date();
        
        if (lastCompleted) {
          const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceLastCompletion <= 24) {
            updates.current_streak = (existingStats.current_streak || 0) + 1;
            updates.longest_streak = Math.max(updates.current_streak, existingStats.longest_streak || 0);
          } else {
            updates.current_streak = 1;
          }
        } else {
          updates.current_streak = 1;
          updates.longest_streak = 1;
        }

        const { error: updateError } = await supabase
          .from('user_stats')
          .update(updates)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (updateError) {
          console.error('Error updating user stats:', updateError);
          return;
        }
      }

      // Check for achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .or(`required_tasks.lte.${existingStats?.total_tasks_completed || 1},required_streak.lte.${existingStats?.current_streak || 1}`);

      if (achievements) {
        for (const achievement of achievements) {
          // Check if already earned
          const { data: existing } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('achievement_id', achievement.id)
            .single();

          if (!existing) {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: (await supabase.auth.getUser()).data.user?.id,
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
          {streak > 0 && (
            <div className="flex items-center gap-2 text-accent">
              <Trophy className="h-4 w-4" />
              <span>{streak} day streak!</span>
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
