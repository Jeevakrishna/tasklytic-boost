import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

export function PriorityPieChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const config = {
    high: { color: COLORS[0] },
    medium: { color: COLORS[1] },
    low: { color: COLORS[2] },
  };

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}