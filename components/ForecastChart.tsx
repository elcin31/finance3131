"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DCFForecastYear } from "@/lib/types";
import { formatCurrencyMillions } from "@/lib/utils/format";

export function ForecastChart({ forecast }: { forecast: DCFForecastYear[] }) {
  const data = forecast.map((f) => ({
    year: `Y${f.year}`,
    fcf: f.fcf,
    presentValue: f.presentValueFCF,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#7c869c" }}
          axisLine={{ stroke: "#d5d9e0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#7c869c" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrencyMillions(v)}
          width={56}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrencyMillions(value),
            name === "fcf" ? "Forecast FCF" : "Present Value",
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #d5d9e0" }}
        />
        <Bar dataKey="fcf" fill="#d5d9e0" radius={[3, 3, 0, 0]} name="fcf" />
        <Bar dataKey="presentValue" fill="#2563eb" radius={[3, 3, 0, 0]} name="presentValue" />
      </BarChart>
    </ResponsiveContainer>
  );
}
