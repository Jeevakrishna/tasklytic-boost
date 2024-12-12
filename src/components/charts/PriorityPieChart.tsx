import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface PriorityPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function PriorityPieChart({ data }: PriorityPieChartProps) {
  const COLORS = ["#FF7F50", "#FFB347", "#98FB98"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ResponsiveContainer>
  );
}