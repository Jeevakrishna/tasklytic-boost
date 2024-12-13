import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface CompletionData {
  day: string;
  tasks: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export function CompletionBarChart({ data }: { data: CompletionData[] }) {
  const config = {
    tasks: { color: "#6366f1" },
    highPriority: { color: "#ef4444" },
    mediumPriority: { color: "#f59e0b" },
    lowPriority: { color: "#22c55e" },
  };

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip />
          <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}