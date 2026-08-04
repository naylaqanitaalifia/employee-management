"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

export const description = "A stacked bar chart with a legend";

const chartData = [
  { date: "2024-07-15", present: 45, late: 4, absent: 0 },
  { date: "2024-07-16", present: 38, late: 0, absent: 0 },
  { date: "2024-07-17", present: 52, late: 10, absent: 0 },
  { date: "2024-07-18", present: 40, late: 15, absent: 0 },
  { date: "2024-07-19", present: 50, late: 10, absent: 4 },
  { date: "2024-07-20", present: 48, late: 7, absent: 5 },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "#10b981",
  },
  late: {
    label: "Late",
    color: "#f59e0b",
  },
  absent: {
    label: "Absent",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function MonthlyAttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance</CardTitle>
        {/* <CardDescription>Tooltip with label formatter.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Bar
              dataKey="present"
              stackId="a"
              fill="var(--color-present)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="late"
              stackId="a"
              fill="var(--color-late)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="absent"
              stackId="a"
              fill="var(--color-absent)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
