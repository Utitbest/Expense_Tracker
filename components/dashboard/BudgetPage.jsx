import React from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Plus, AlertTriangle } from "lucide-react";

const budgets = [
  {
    id: 1,
    name: "Food & Dining",
    amount: 600,
    spent: 485.75,
    period: "Monthly",
    color: "#2563eb",
    icon: "🍽️",
    alerts: 1,
  },
  {
    id: 2,
    name: "Transport",
    amount: 300,
    spent: 245.25,
    period: "Monthly",
    color: "#10b981",
    icon: "🚗",
    alerts: 0,
  },
  {
    id: 3,
    name: "Entertainment",
    amount: 200,
    spent: 188.5,
    period: "Monthly",
    color: "#f59e0b",
    icon: "🎬",
    alerts: 1,
  },
  {
    id: 4,
    name: "Utilities",
    amount: 250,
    spent: 185.0,
    period: "Monthly",
    color: "#ef4444",
    icon: "⚡",
    alerts: 0,
  },
  {
    id: 5,
    name: "Shopping",
    amount: 500,
    spent: 325.99,
    period: "Monthly",
    color: "#8b5cf6",
    icon: "🛍️",
    alerts: 0,
  },
  {
    id: 6,
    name: "Annual Travel",
    amount: 3000,
    spent: 1250.0,
    period: "Yearly",
    color: "#06b6d4",
    icon: "✈️",
    alerts: 0,
  },
];

export function BudgetsPage() {
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Budget</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All categories combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((totalSpent / totalBudget) * 100)}% of budget used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              ${(totalBudget - totalSpent).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Budget Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-destructive/20">
              <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center">🎬</div>
              <div className="flex-1">
                <p className="font-medium text-sm">Entertainment budget at 94%</p>
                <p className="text-xs text-muted-foreground">$188.50 of $200 spent</p>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent">
                View
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-destructive/20">
              <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center">🍽️</div>
              <div className="flex-1">
                <p className="font-medium text-sm">Food budget at 81%</p>
                <p className="text-xs text-muted-foreground">$485.75 of $600 spent</p>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = Math.round((budget.spent / budget.amount) * 100);
          const isOverBudget = budget.spent > budget.amount;
          const isNearLimit = percentage >= 80;

          return (
            <Card
              key={budget.id}
              className={`${
                isOverBudget
                  ? "border-destructive/50 bg-destructive/5"
                  : isNearLimit
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg">
                        {budget.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{budget.name}</p>
                        <p className="text-sm text-muted-foreground">{budget.period}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Edit
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">${budget.spent.toFixed(2)} spent</p>
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          isOverBudget
                            ? "text-destructive"
                            : isNearLimit
                            ? "text-yellow-600"
                            : "text-foreground"
                        }`}
                      >
                        {percentage}%
                      </div>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isOverBudget
                            ? "bg-destructive"
                            : isNearLimit
                            ? "bg-yellow-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget
                        ? `Over budget by $${(budget.spent - budget.amount).toFixed(2)}`
                        : `${(budget.amount - budget.spent).toFixed(2)} remaining`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
