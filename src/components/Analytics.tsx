import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Target, TrendingUp, BarChart2, PieChart } from "lucide-react";
import { PriorityPieChart } from "./charts/PriorityPieChart";
import { CompletionBarChart } from "./charts/CompletionBarChart";
import { ProductivityLineChart } from "./charts/ProductivityLineChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsProps {
  tasks: Array<{
    id: string;
    title: string;
    priority: "High" | "Medium" | "Low";
    completed?: boolean;
    deadline: string;
    duration: string;
  }>;
}

export function Analytics({ tasks }: AnalyticsProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");
  const [chartType, setChartType] = useState<"completion" | "priority" | "productivity">("completion");

  // Enhanced statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const highPriorityCompletion = tasks.filter(
    (t) => t.priority === "High" && t.completed
  ).length;
  
  const averageTaskDuration = tasks.reduce((acc, task) => {
    const duration = parseInt(task.duration) || 0;
    return acc + duration;
  }, 0) / tasks.length || 0;

  // Priority distribution data
  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
  ];

  // Weekly completion data (enhanced with more details)
  const weeklyData = [
    { day: "Mon", tasks: 4, highPriority: 2, mediumPriority: 1, lowPriority: 1 },
    { day: "Tue", tasks: 6, highPriority: 3, mediumPriority: 2, lowPriority: 1 },
    { day: "Wed", tasks: 3, highPriority: 1, mediumPriority: 1, lowPriority: 1 },
    { day: "Thu", tasks: 7, highPriority: 4, mediumPriority: 2, lowPriority: 1 },
    { day: "Fri", tasks: 5, highPriority: 2, mediumPriority: 2, lowPriority: 1 },
    { day: "Sat", tasks: 2, highPriority: 1, mediumPriority: 1, lowPriority: 0 },
    { day: "Sun", tasks: 1, highPriority: 0, mediumPriority: 1, lowPriority: 0 },
  ];

  // Monthly productivity trend with more metrics
  const productivityData = [
    { week: "Week 1", completion: 75, efficiency: 85, overdue: 2 },
    { week: "Week 2", completion: 82, efficiency: 88, overdue: 1 },
    { week: "Week 3", completion: 88, efficiency: 90, overdue: 0 },
    { week: "Week 4", completion: 85, efficiency: 87, overdue: 1 },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-4">
          <Select value={timeframe} onValueChange={(value: "week" | "month" | "year") => setTimeframe(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
            <h3 className="text-2xl font-bold">{averageTaskDuration.toFixed(1)}h</h3>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tasks by Priority</h3>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[300px]">
            <PriorityPieChart data={priorityData} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Weekly Task Completion</h3>
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[300px]">
            <CompletionBarChart data={weeklyData} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Productivity Trend</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[300px]">
            <ProductivityLineChart data={productivityData} />
          </div>
        </Card>
      </div>
    </div>
  );
}