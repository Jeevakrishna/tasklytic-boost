import { Clock, AlertTriangle, Trophy } from "lucide-react";

interface TaskStatsProps {
  duration: string;
  deadline: string;
  streak: number;
}

export function TaskStats({ duration, deadline, streak }: TaskStatsProps) {
  return (
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
    </div>
  );
}