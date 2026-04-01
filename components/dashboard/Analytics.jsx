"use client"
import React from "react";
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

const spendingTrend = [
  { month: "Jan", amount: 1200, budget: 1500 },
  { month: "Feb", amount: 1400, budget: 1500 },
  { month: "Mar", amount: 1100, budget: 1500 },
  { month: "Apr", amount: 1600, budget: 1500 },
  { month: "May", amount: 1300, budget: 1500 },
  { month: "Jun", amount: 900, budget: 1500 },
];

const categoryComparison = [
  { name: "Food", thisMonth: 485, lastMonth: 520 },
  { name: "Transport", thisMonth: 245, lastMonth: 280 },
  { name: "Entertainment", thisMonth: 189, lastMonth: 150 },
  { name: "Utilities", thisMonth: 185, lastMonth: 185 },
  { name: "Shopping", thisMonth: 326, lastMonth: 400 },
];

const insights = [
  { title: "Higher spending on Food", description: "You spent $50 more on food compared to last month", trend: "up" },
  { title: "Transport costs decreased", description: "Great job! You saved $35 on transport this month", trend: "down" },
  { title: "Entertainment spike", description: "Entertainment spending increased by $39 this month", trend: "up" },
  { title: "Best saving category", description: "Shopping category shows the best saving trend", trend: "down" },
];

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">Visualize your spending patterns and trends</p>
        </div>
        <Select defaultValue="6m">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((insight, idx) => (
          <Card key={idx} className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    insight.trend === "down" ? "bg-accent/10" : "bg-destructive/10"
                  }`}
                >
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

      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Monthly spending vs budget</CardDescription>
        </CardHeader>
        <CardContent>
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
                stroke="var(--color-primary)"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
              <Line type="monotone" dataKey="budget" stroke="var(--color-border)" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Comparison</CardTitle>
          <CardDescription>This month vs last month spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisMonth" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lastMonth" fill="var(--color-chart-5)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Total Spent", value: "$3,567.50", change: "+12%" },
          { label: "Average Daily", value: "$118.92", change: "-5%" },
          { label: "Categories Used", value: "6", change: "+1" },
          { label: "Largest Expense", value: "$485.75", change: "Food & Dining" },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
