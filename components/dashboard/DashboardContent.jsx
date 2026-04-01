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
import { useMonthlyRecord } from "@/hooks/useMonthlyRecord"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Button } from "@/components/ui_kits/Button";
import { Spinner } from "../ui_kits/Spinner";
import { useTransaction } from "@/hooks/useTransaction";
import { formatTransactions, formatCategoryChartData, formatChartData } from "@/lib/utils";
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";


export function DashboardContent() {
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryChartData] = useState([]);
  const { getSummary, getHistory, summary, error: summaryError, loading: summaryLoading } = useMonthlyRecord();
  const { getCategories, loading: categoryLoading, error: categoryError } = useCategory();
  const { getTransactions, transactions, error: transactionError, loading: transactionLoading } = useTransaction();
  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const [summaryResult, historyResult, transactionResult, categoryResult] = await Promise.all([
        await getSummary({ year: now.getFullYear(), month: now.getMonth() + 1 }),
        await getHistory(),
        await getTransactions(),
        await getCategories()
      ]);
      if (historyResult.success) {
        const formatted = formatChartData(historyResult.data.records);
        setChartData(formatted);
      }
      if(categoryResult.success){
        setCategoryChartData(formatCategoryChartData(categoryResult.data.categories));
      }
    };
    fetchData();
  }, []);

  const formattedTransactions = formatTransactions(transactions);

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">

            {
              summaryLoading ? 
                (<Spinner className="size-6"/>) :
              summaryError ? 
                (
                  <div className="flex flex-col items-center justify-center flex-1 gap-2">
                    <p className="text-destructive text-sm font-medium">Failed to load balance</p>
                    <p className="text-muted-foreground text-xs">{summaryError}</p>
                  </div>
                ) :
                (
                  <>
                    <div className="text-3xl font-bold">
                      ${summary?.currentBalance.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                          {summary?.balanceChange.direction == "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4 stroke-[#ee3533]"/>}
                        <span className={summary?.balanceChange.direction == "up" ? "" : "text-destructive"}>
                          {summary?.balanceChange.label}
                        </span>
                    </div>
                  </>
                )
              
            }


            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {
              summaryLoading ?
                (<Spinner className="size-6"/>) : 
              summaryError ? 
                (
                  <div className="flex flex-col items-center justify-center flex-1 gap-2">
                    <p className="text-destructive text-sm font-medium">Failed to load total income</p>
                    <p className="text-muted-foreground text-xs">{summaryError}</p>
                  </div>
                ) : 
                (
                  <>
                    <div className="text-3xl font-bold text-accent">${summary?.totalIncome.toLocaleString()}</div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>This month</span>
                    </div>
                  </>
                )
            }


           
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {
              summaryLoading ?
                (<Spinner className="size-6"/>) : 
              summaryError ?
                (
                  <div className="flex flex-col items-center justify-center flex-1 gap-2">
                    <p className="text-destructive text-sm font-medium">Failed to load Expense</p>
                    <p className="text-muted-foreground text-xs">{summaryError}</p>
                  </div>
                ) :  
                (
                  <>
                    <div className="text-3xl font-bold text-destructive">
                      ${ summary?.totalExpenses.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <ArrowDownRight className="h-4 w-4" />
                      <span>This month</span>
                    </div>
                  </>
                )
            }
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
            {summaryLoading ? (
                <div className="flex items-center justify-center h-75">
                  <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
                </div>
              ) : summaryError ? (
                <div className="flex flex-col items-center justify-center h-75 gap-2">
                  <p className="text-destructive text-sm font-medium">Failed to load chart data</p>
                  <p className="text-muted-foreground text-xs">{error}</p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-75">
                  <p className="text-muted-foreground text-sm">No records found</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryLoading ? (
                <div className="flex items-center justify-center h-75">
                  <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
                </div>
              ) : categoryError ? (
                <div className="flex flex-col items-center justify-center h-75 gap-2">
                  <p className="text-destructive text-sm font-medium">Failed to load chart data</p>
                  <p className="text-muted-foreground text-xs">{error}</p>
                </div>
              ) : categoryData.length === 0 ? (
                <div className="flex items-center justify-center h-75">
                  <p className="text-muted-foreground text-sm">No records found</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest spending and income</CardDescription>
          </div>
          <Button size="sm" className="gap-2 hidden">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </CardHeader>
        <CardContent>
         <div className="space-y-3">
            {transactionLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
              </div>
        
            ) : transactionError ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <p className="text-destructive text-sm font-medium">Failed to load transactions</p>
                <p className="text-muted-foreground text-xs">{transactionError}</p>
              </div>
        
            ) : formattedTransactions.length > 0 ? (
              formattedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg">
                      {transaction.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`flex items-center gap-1 font-semibold justify-end ${
                        transaction.amount > 0 ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                      {transaction.amount > 0 ? "+" : ""}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
        
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
