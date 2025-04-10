"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelDataItem } from "@/types/charts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Mock data
const modelData: ModelDataItem[] = [
  { name: "Firefox", value: 2811, color: "#FEB913" },
  { name: "Chrome", value: 12799, color: "#FFCB47" },
  { name: "Safari", value: 1500, color: "#FFD670" },
  { name: "Edge", value: 950, color: "#FFE299" },
];

interface ModelsChartProps {
  data?: ModelDataItem[] | null
}

export function ModelsChart({ data }: ModelsChartProps) {
  const chartData = data ?? modelData
  // Calculate the total number of models
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground">Bytebeast.models</div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Models created</CardTitle>
          <span className="text-xl font-bold">{total}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                label={({ name, value, cx, x, y }) => {
                  // Determine the label position
                  const isRightSide = x > cx;

                  return (
                    <g>
                      <text
                        x={isRightSide ? x + 10 : x - 10}
                        y={y}
                        textAnchor={isRightSide ? "start" : "end"}
                        className="fill-foreground"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {name}
                      </text>
                      <text
                        x={isRightSide ? x + 10 : x - 10}
                        y={y + 15}
                        textAnchor={isRightSide ? "start" : "end"}
                        className="fill-foreground"
                        fontSize="12"
                      >
                        {value.toLocaleString()}
                      </text>
                      <circle
                        cx={isRightSide ? x + 5 : x - 5}
                        cy={y}
                        r={2}
                        className="fill-foreground"
                      />
                    </g>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} models`,
                  "Quantity",
                ]}
                labelFormatter={(label) => ""}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
