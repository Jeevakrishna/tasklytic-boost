import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface ProductivityLineChartProps {
  data: Array<{
    week: string;
    completion: number;
  }>;
}

export function ProductivityLineChart({ data }: ProductivityLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="completion" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}