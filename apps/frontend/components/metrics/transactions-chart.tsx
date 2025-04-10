"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { CustomTooltipProps, TransactionDataPoint } from "../../types/charts"

// Simulated data for the transactions chart
const transactionData: TransactionDataPoint[] = [
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

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
        <p className="text-xs font-medium">{`${label}`}</p>
        <p className="text-xs text-gray-700">{`${payload[0].value} transactions`}</p>
      </div>
    )
  }

  return null
}

interface TransactionsChartProps {
  data?: TransactionDataPoint[] | null
}

export function TransactionsChart({ data }: TransactionsChartProps) {
  const chartData = data ? data : transactionData

  const currentValue = chartData[chartData.length - 1]?.value ?? 0
  const previousValue = chartData[chartData.length - 2]?.value ?? 0

  let percentChange: number | null = null
  let percentText = "--"
  let showIcon = false
  let isPositive = false
  let changeColor = "text-muted-foreground"

  if (previousValue !== 0) {
    percentChange = ((currentValue - previousValue) / previousValue) * 100
    isPositive = percentChange >= 0
    percentText = `${isPositive ? "+" : ""}${percentChange.toFixed(2)}%`
    showIcon = true
    changeColor = isPositive ? "text-green-500" : "text-red-500"
  } else if (currentValue === 0) {
    percentChange = 0
    percentText = "0%"
    changeColor = "text-muted-foreground"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground">
          Total transactions generated
        </div>
        <CardTitle className="text-xl">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold">{currentValue}</span>
          <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
            <span>{percentText}</span>
            {showIcon &&
              (isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              ))}
          </div>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                cursor={{
                  stroke: "#FEB913",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
