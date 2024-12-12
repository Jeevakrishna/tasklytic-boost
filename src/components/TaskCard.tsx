import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, Trophy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  completed?: boolean;
  streak?: number;
}

export function TaskCard({ 
  id,
  title, 
  description,
  duration, 
  priority, 
  deadline,
  completed = false,
  streak = 0
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const { toast } = useToast();

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
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
          <Button 
            onClick={handleComplete}
            variant={isCompleted ? "secondary" : "default"}
            className="w-full"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}