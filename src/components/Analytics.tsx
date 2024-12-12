import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { PriorityPieChart } from "./charts/PriorityPieChart";
import { CompletionBarChart } from "./charts/CompletionBarChart";
import { ProductivityLineChart } from "./charts/ProductivityLineChart";

interface AnalyticsProps {
  tasks: Array<{
    id: string;
    title: string;
    priority: "High" | "Medium" | "Low";
    completed?: boolean;
    deadline: string;
  }>;
}

export function Analytics({ tasks }: AnalyticsProps) {
  const [selectedTimeframe] = useState<"week" | "month">("week");

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const highPriorityCompletion = tasks.filter(
    (t) => t.priority === "High" && t.completed
  ).length;
  
  // Priority distribution data
  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
  ];

  // Weekly completion data
  const weeklyData = [
    { day: "Mon", tasks: 4 },
    { day: "Tue", tasks: 6 },
    { day: "Wed", tasks: 3 },
    { day: "Thu", tasks: 7 },
    { day: "Fri", tasks: 5 },
    { day: "Sat", tasks: 2 },
    { day: "Sun", tasks: 1 },
  ];

  // Monthly productivity trend
  const productivityData = [
    { week: "Week 1", completion: 75 },
    { week: "Week 2", completion: 82 },
    { week: "Week 3", completion: 88 },
    { week: "Week 4", completion: 85 },
  ];

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center space-x-4">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <h3 className="text-2xl font-bold">{totalTasks}</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{completedTasks}</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <h3 className="text-2xl font-bold">{completionRate.toFixed(1)}%</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">High Priority Done</p>
            <h3 className="text-2xl font-bold">{highPriorityCompletion}</h3>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
          <div className="h-[300px]">
            <PriorityPieChart data={priorityData} />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Weekly Task Completion</h3>
          <div className="h-[300px]">
            <CompletionBarChart data={weeklyData} />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Monthly Productivity Trend</h3>
          <div className="h-[300px]">
            <ProductivityLineChart data={productivityData} />
          </div>
        </Card>
      </div>
    </div>
  );
}