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
  onToggleComplete: (id: string, completed: boolean) => void;
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
  onDelete,
  onToggleComplete
}: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleComplete = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      onToggleComplete(id, !completed);
      
      toast({
        title: completed ? "Task marked as incomplete" : "Task completed! 🎉",
        description: completed ? "Task status updated" : "Keep up the great work!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating task:', error);
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
            streak={streak} 
          />
          <TaskActions 
            isCompleted={completed}
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