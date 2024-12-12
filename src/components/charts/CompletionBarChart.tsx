import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface CompletionBarChartProps {
  data: Array<{
    day: string;
    tasks: number;
  }>;
}

export function CompletionBarChart({ data }: CompletionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="tasks" fill="#6B9080" />
      </BarChart>
    </ResponsiveContainer>
  );
}