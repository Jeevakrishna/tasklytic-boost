import { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { BarChart2, Crown, LayoutDashboard, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./TaskForm";
import { Analytics } from "./Analytics";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Task {
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
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon: string;
  earned_at?: string;
}

export function Dashboard() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Project Proposal",
      description: "Draft and review the Q2 project proposal document",
      duration: "2 hours",
      priority: "High",
      deadline: "Today, 5 PM",
      completed: false,
      streak: 3,
    },
    {
      id: "2",
      title: "Review Documentation",
      description: "Review and update API documentation",
      duration: "1 hour",
      priority: "Medium",
      deadline: "Tomorrow, 12 PM",
      completed: true,
      streak: 5,
    },
    {
      id: "3",
      title: "Team Meeting",
      description: "Weekly sync with the development team",
      duration: "30 minutes",
      priority: "Low",
      deadline: "Today, 2 PM",
      completed: false,
      streak: 0,
    },
  ]);

  const [view, setView] = useState<"tasks" | "analytics">("tasks");

  // Fetch user achievements
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          earned_at,
          achievements (
            id,
            name,
            description,
            badge_icon
          )
        `);

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }

      return userAchievements.map((ua: any) => ({
        ...ua.achievements,
        earned_at: ua.earned_at,
      }));
    },
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }

      return data;
    },
  });

  const handleAddTask = (newTask: Omit<Task, "id" | "completed" | "streak">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      streak: 0,
    };
    setTasks([...tasks, task]);
    
    toast({
      title: "Task Created",
      description: "Your new task has been added successfully!",
      duration: 3000,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been permanently removed",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto p-6 page-transition">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold">TaskTimer+</h1>
            {userStats && (
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{userStats.points} points</span>
                <span className="text-muted-foreground">•</span>
                <span>{userStats.current_streak} day streak</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setView("tasks")} 
              variant={view === "tasks" ? "default" : "outline"}
              className="hover-scale"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tasks
            </Button>
            <Button 
              onClick={() => setView("analytics")} 
              variant={view === "analytics" ? "default" : "outline"}
              className="hover-scale"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            {view === "tasks" && <TaskForm onSubmit={handleAddTask} />}
          </div>
        </div>
  
        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {achievements.map((achievement: Achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2 min-w-max"
              >
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{achievement.name}</span>
              </div>
            ))}
          </div>
        )}
  
        {/* Tasks or Analytics Section */}
        {view === "tasks" ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                {...task} 
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <Analytics tasks={tasks} />
        )}
      </div>
    </div>
  );
};