import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface ProductivityData {
  week: string;
  completion: number;
  efficiency: number;
  overdue: number;
}

export function ProductivityLineChart({ data }: { data: ProductivityData[] }) {
  const config = {
    completion: { color: "#6366f1" },
    efficiency: { color: "#22c55e" },
    overdue: { color: "#ef4444" },
  };

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="week" />
          <YAxis />
          <ChartTooltip />
          <Line type="monotone" dataKey="completion" stroke="#6366f1" />
          <Line type="monotone" dataKey="efficiency" stroke="#22c55e" />
          <Line type="monotone" dataKey="overdue" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}