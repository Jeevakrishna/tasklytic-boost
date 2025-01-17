import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2, Repeat, Timer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskActionsProps {
  isCompleted: boolean;
  onComplete: () => void;
  onDelete: () => void;
  isLoading: boolean;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
  };
  onToggleTimer: () => void;
  showTimer: boolean;
}

export function TaskActions({ 
  isCompleted, 
  onComplete, 
  onDelete, 
  recurring,
  isLoading,
  onToggleTimer,
  showTimer
}: TaskActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        onClick={onComplete}
        variant={isCompleted ? "secondary" : "default"}
        className="flex-1 min-w-[120px]"
        disabled={isLoading}
      >
        {isCompleted ? (
          <XCircle className="h-4 w-4 mr-2" />
        ) : (
          <CheckCircle2 className="h-4 w-4 mr-2" />
        )}
        {isLoading ? "Saving..." : isCompleted ? "Mark Incomplete" : "Mark Complete"}
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0"
              onClick={onToggleTimer}
            >
              <Timer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showTimer ? "Hide Timer" : "Show Timer"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {recurring && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Repeat className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Repeats {recurring.frequency}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <Button
        onClick={onDelete}
        variant="destructive"
        size="icon"
        className="shrink-0"
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}