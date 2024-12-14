import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2, Repeat } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskActionsProps {
  isCompleted: boolean;
  onComplete: () => void;
  onDelete: () => void;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
  };
}

export function TaskActions({ isCompleted, onComplete, onDelete, recurring }: TaskActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onComplete}
        variant={isCompleted ? "secondary" : "default"}
        className="flex-1"
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        {isCompleted ? "Mark Incomplete" : "Mark Complete"}
      </Button>
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
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}