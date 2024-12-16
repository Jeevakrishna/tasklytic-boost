import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { BarChart2, Crown, LayoutDashboard, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./TaskForm";
import { Analytics } from "./Analytics";
import { PomodoroTimer } from "./pomodoro/PomodoroTimer";

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
      completed: false,
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

  const [view, setView] = useState<"tasks" | "analytics" | "pomodoro">("tasks");
  const [points, setPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

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

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed };
        if (completed) {
          setPoints(prev => prev + 10);
          setCurrentStreak(prev => prev + 1);
        } else {
          setPoints(prev => Math.max(0, prev - 10));
          setCurrentStreak(prev => Math.max(0, prev - 1));
        }
        return updatedTask;
      }
      return task;
    }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 page-transition">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">TaskTimer+</h1>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>{points} points</span>
              <span className="text-muted-foreground">•</span>
              <span>{currentStreak} day streak</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button 
              onClick={() => setView("tasks")} 
              variant={view === "tasks" ? "default" : "outline"}
              className="hover-scale flex-1 md:flex-none"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tasks
            </Button>
            <Button 
              onClick={() => setView("analytics")} 
              variant={view === "analytics" ? "default" : "outline"}
              className="hover-scale flex-1 md:flex-none"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button 
              onClick={() => setView("pomodoro")} 
              variant={view === "pomodoro" ? "default" : "outline"}
              className="hover-scale flex-1 md:flex-none"
            >
              <Timer className="mr-2 h-4 w-4" />
              Pomodoro
            </Button>
            {view === "tasks" && <TaskForm onSubmit={handleAddTask} />}
          </div>
        </div>
        
        {view === "tasks" && (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                {...task} 
                onDelete={() => handleDeleteTask(task.id)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
        
        {view === "analytics" && <Analytics tasks={tasks} />}
        
        {view === "pomodoro" && <PomodoroTimer />}
      </div>
    </div>
  );
}