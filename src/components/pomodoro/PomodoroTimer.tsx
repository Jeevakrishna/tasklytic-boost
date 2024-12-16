import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Pause, Play, RefreshCw, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (isBreak) {
      toast({
        title: "Break time is over!",
        description: "Time to get back to work.",
        duration: 5000,
      });
      setIsBreak(false);
      setTimeLeft(workDuration * 60);
    } else {
      toast({
        title: "Work session complete!",
        description: "Time for a break.",
        duration: 5000,
      });
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleWorkDurationChange = (value: string) => {
    const duration = parseInt(value);
    setWorkDuration(duration);
    if (!isBreak && !isRunning) {
      setTimeLeft(duration * 60);
    }
  };

  const handleBreakDurationChange = (value: string) => {
    const duration = parseInt(value);
    setBreakDuration(duration);
    if (isBreak && !isRunning) {
      setTimeLeft(duration * 60);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-card rounded-lg shadow-lg">
      <div className="text-4xl font-bold font-mono">
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm text-muted-foreground">
        {isBreak ? "Break Time" : "Work Time"}
      </div>
      <div className="flex space-x-2">
        <Button onClick={toggleTimer} variant="outline" size="icon">
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Duration (minutes)</label>
                <Select
                  value={workDuration.toString()}
                  onValueChange={handleWorkDurationChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Break Duration (minutes)</label>
                <Select
                  value={breakDuration.toString()}
                  onValueChange={handleBreakDurationChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}