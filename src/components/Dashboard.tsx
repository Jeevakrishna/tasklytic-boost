import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { BarChart2, Crown, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./TaskForm";
import { Analytics } from "./Analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  completed?: boolean;
  streak?: number;
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

  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [view, setView] = useState<"tasks" | "analytics">("tasks");

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

  const handleViewAnalytics = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
    } else {
      setView("analytics");
    }
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade to Premium",
      description: "Redirecting to payment page...",
      duration: 3000,
    });
    window.open('https://paypal.com', '_blank');
  };

  return (
    <div className="container mx-auto p-6 page-transition">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">TaskTimer+</h1>
            {isPremium && (
              <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </span>
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
              onClick={handleViewAnalytics} 
              variant={view === "analytics" ? "default" : "outline"}
              className="hover-scale"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            {view === "tasks" && <TaskForm onSubmit={handleAddTask} />}
          </div>
        </div>
        
        {view === "tasks" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        ) : (
          <Analytics tasks={tasks} />
        )}
      </div>

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p>Unlock premium features including:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Advanced Analytics Dashboard</li>
              <li>Team Collaboration</li>
              <li>Custom Themes</li>
              <li>Priority Support</li>
            </ul>
            <p className="font-semibold">Only $10/month</p>
            <Button onClick={handleUpgrade} className="w-full">
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}