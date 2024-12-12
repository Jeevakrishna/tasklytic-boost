import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const { toast } = useToast();

  const tasks = [
    {
      id: "1",
      title: "Complete Project Proposal",
      description: "Draft and review the Q2 project proposal document",
      duration: "2 hours",
      priority: "High" as const,
      deadline: "Today, 5 PM",
      completed: false,
      streak: 3,
    },
    {
      id: "2",
      title: "Review Documentation",
      description: "Review and update API documentation",
      duration: "1 hour",
      priority: "Medium" as const,
      deadline: "Tomorrow, 12 PM",
      completed: true,
      streak: 5,
    },
    {
      id: "3",
      title: "Team Meeting",
      description: "Weekly sync with the development team",
      duration: "30 minutes",
      priority: "Low" as const,
      deadline: "Today, 2 PM",
      completed: false,
      streak: 0,
    },
  ];

  const handleAddTask = () => {
    toast({
      title: "Coming Soon",
      description: "Task creation will be available in the next update!",
      duration: 3000,
    });
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Coming Soon",
      description: "Analytics dashboard will be available in the premium version!",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto p-6 page-transition">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">TaskTimer+</h1>
          <div className="flex gap-4">
            <Button onClick={handleAddTask} className="hover-scale">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
            <Button onClick={handleViewAnalytics} variant="outline" className="hover-scale">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}