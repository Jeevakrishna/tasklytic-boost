import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface TaskCardProps {
  title: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
}

export function TaskCard({ title, duration, priority, completed }: TaskCardProps) {
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <Card className="glass-card task-enter hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge className={priorityColors[priority]}>{priority}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        {completed && (
          <div className="mt-2 flex items-center space-x-2 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}