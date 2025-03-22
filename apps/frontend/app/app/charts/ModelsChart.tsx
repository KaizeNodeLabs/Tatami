"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Mock data
const modelData = [
  { name: "Firefox", value: 2811, color: "#FEB913" },
  { name: "Chrome", value: 12799, color: "#FFCB47" },
  { name: "Safari", value: 1500, color: "#FFD670" },
  { name: "Edge", value: 950, color: "#FFE299" },
];

// Calculate the total number of models
const totalModels = modelData.reduce((sum, item) => sum + item.value, 0);

export function ModelsChart() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground">Bytebeast.models</div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Models created</CardTitle>
          <span className="text-xl font-bold">{totalModels}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                label={({ name, value, cx, x, y }) => {
                  const isLargeValue = value > 1000;
                  if (!isLargeValue) return null;

                  // Determine the label position
                  const isRightSide = x > cx;

                  return (
                    <g>
                      <text
                        x={isRightSide ? x + 10 : x - 10}
                        y={y}
                        textAnchor={isRightSide ? "start" : "end"}
                        fill="#101010"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {name}
                      </text>
                      <text
                        x={isRightSide ? x + 10 : x - 10}
                        y={y + 15}
                        textAnchor={isRightSide ? "start" : "end"}
                        fill="#101010"
                        fontSize="12"
                      >
                        {value.toLocaleString()}
                      </text>
                      <circle
                        cx={isRightSide ? x + 5 : x - 5}
                        cy={y}
                        r={2}
                        fill="#101010"
                      />
                    </g>
                  );
                }}
              >
                {modelData.map((entry, index) => (
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
