import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskHeaderProps {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

export function TaskHeader({ title, description, priority }: TaskHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex flex-col gap-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Badge className={priorityColors[priority]}>{priority}</Badge>
    </CardHeader>
  );
}