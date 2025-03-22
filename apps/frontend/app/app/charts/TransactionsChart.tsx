"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import type { CustomTooltipProps } from "../../../types/charts"

// Simulated data for the transactions chart
const transactionData = [
  { date: "2023-01", value: 320 },
  { date: "2023-02", value: 350 },
  { date: "2023-03", value: 410 },
  { date: "2023-04", value: 490 },
  { date: "2023-05", value: 550 },
  { date: "2023-06", value: 620 },
  { date: "2023-07", value: 690 },
  { date: "2023-08", value: 820 },
  { date: "2023-09", value: 635 },
  { date: "2023-10", value: 580 },
  { date: "2023-11", value: 510 },
  { date: "2023-12", value: 635 },
]

// Calculate the percentage change
const calculatePercentChange = () => {
  const currentValue = transactionData[transactionData.length - 1].value
  const previousValue = transactionData[transactionData.length - 2].value
  const percentChange = ((currentValue - previousValue) / previousValue) * 100
  return percentChange.toFixed(2)
}

// Custom component for the tooltip
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
        <p className="text-xs font-medium">{`${label}`}</p>
        <p className="text-xs text-gray-700">{`${payload[0].value} transacciones`}</p>
      </div>
    )
  }

  return null
}

export function TransactionsChart() {
  const percentChange = calculatePercentChange()
  const isPositive = Number.parseFloat(percentChange) >= 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground">Total transactions generated</div>
        <CardTitle className="text-xl">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold">{transactionData[transactionData.length - 1].value}</span>
          <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <span className="text-sm font-medium">
              {isPositive ? "+" : ""}
              {percentChange}%
            </span>
            <TrendingUp className="h-4 w-4 ml-1" />
          </div>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactionData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTransaction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEB913" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FEB913" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FEB913"
                strokeWidth={2}
                fill="url(#colorTransaction)"
                dot={false}
                activeDot={{ r: 4, fill: "#FEB913", stroke: "#FEB913" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#FEB913", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

