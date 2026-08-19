"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyMillions } from "@/lib/utils/format";

export function FinancialBarChart({
  data,
  dataKey,
  label,
}: {
  data: { fiscalYear: number; value: number }[];
  dataKey: string;
  label: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis
          dataKey="fiscalYear"
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
          formatter={(value: number) => [formatCurrencyMillions(value), label]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid #d5d9e0",
          }}
        />
        <Bar dataKey="value" name={label} fill="#2563eb" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FinancialLineChart({
  data,
  series,
}: {
  data: Record<string, number | string>[];
  series: { key: string; label: string; color: string; isPercent?: boolean }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis
          dataKey="fiscalYear"
          tick={{ fontSize: 11, fill: "#7c869c" }}
          axisLine={{ stroke: "#d5d9e0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#7c869c" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          width={40}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `${(value * 100).toFixed(1)}%`,
            name,
          ]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid #d5d9e0",
          }}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
