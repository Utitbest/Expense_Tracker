"use client";

import React, { useEffect, useState } from "react";
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_kits/Select";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { MONTH_OPTIONS } from "@/lib/utils"


export function AnalyticsPage() {
  const { getAnalytics, analytics, loading, error } = useAnalytics();
  const [selectedMonths, setSelectedMonths] = useState("6");

  useEffect(() => {
    const fetchData = async () => {
      await getAnalytics(parseInt(selectedMonths));
    };
    fetchData();
  }, [selectedMonths]);

  const spendingTrend = analytics?.spendingTrend || [];
  const categoryComparison = analytics?.categoryComparison || [];
  const insights = analytics?.insights || [];
  const stats = analytics?.stats || {};

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">Visualize your spending patterns and trends</p>
        </div>
        <Select
          value={selectedMonths}
          onValueChange={(val) => setSelectedMonths(val)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))
        ) : (
          [
            {
              label: "Total Spent",
              value: `$${stats.totalSpent?.toLocaleString() || "0"}`,
              change: `$${stats.totalBudget?.toLocaleString() || "0"} budget`,
            },
            {
              label: "Average Daily",
              value: `$${stats.avgDaily?.toLocaleString() || "0"}`,
              change: "This month",
            },
            {
              label: "Categories Used",
              value: stats.categoriesUsed || "0",
              change: "This month",
            },
            {
              label: "Largest Expense",
              value: `$${stats.largestExpense?.amount?.toLocaleString() || "0"}`,
              change: stats.largestExpense?.category || "N/A",
            },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <Card key={idx} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    insight.trend === "down" ? "bg-accent/10" : "bg-destructive/10"
                  }`}>
                    {insight.trend === "down" ? (
                      <TrendingDown className="h-6 w-6 text-accent" />
                    ) : (
                      <TrendingUp className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-6">
              No insights yet — add more transactions to see patterns
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Monthly spending vs budget</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-75">
              <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
            </div>
          ) : spendingTrend.length === 0 ? (
            <div className="flex items-center justify-center h-75">
              <p className="text-muted-foreground text-sm">No spending data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Spent"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  name="Budget"
                  stroke="var(--color-border)"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Category Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Comparison</CardTitle>
          <CardDescription>This month vs last month spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-75">
              <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
            </div>
          ) : categoryComparison.length === 0 ? (
            <div className="flex items-center justify-center h-75">
              <p className="text-muted-foreground text-sm">No category data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="thisMonth" name="This Month" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lastMonth" name="Last Month" fill="var(--color-chart-5)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}