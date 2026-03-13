"use client"
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Button } from "@/components/ui_kits/Button";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";



const categoryData = [
  { name: "Food", value: 35, color: "#2563eb" },
  { name: "Transport", value: 25, color: "#10b981" },
  { name: "Entertainment", value: 20, color: "#f59e0b" },
  { name: "Utilities", value: 15, color: "#ef4444" },
  { name: "Other", value: 5, color: "#8b5cf6" },
];



const monthlyData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];


const recentTransactions = [
  { id: 1, name: "Coffee Shop", category: "Food", amount: -5.5, date: "Today", icon: "☕" },
  { id: 2, name: "Salary Deposit", category: "Income", amount: 3500, date: "Yesterday", icon: "💰" },
  { id: 3, name: "Gas", category: "Transport", amount: -45, date: "2 days ago", icon: "⛽" },
  { id: 4, name: "Netflix", category: "Entertainment", amount: -12.99, date: "3 days ago", icon: "🎬" },
  { id: 5, name: "Groceries", category: "Food", amount: -85.3, date: "4 days ago", icon: "🛒" },
];


// It's time to create the APIs for the dashoard
export function DashboardContent() {
  const totalBalance = 12450.75;
  const monthlyIncome = 8050;
  const monthlyExpenses = 2240.79;


  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">${totalBalance.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-accent">${monthlyIncome.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <ArrowUpRight className="h-4 w-4" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-destructive">${monthlyExpenses.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm text-destructive">
              <ArrowDownRight className="h-4 w-4" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription>Income vs Expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest spending and income</CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-accent" : "text-foreground"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
