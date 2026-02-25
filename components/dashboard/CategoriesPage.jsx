import React from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Plus, Edit2, Trash2 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Food & Dining",
    spent: 485.75,
    budget: 600,
    color: "#2563eb",
    icon: "🍽️",
    transactions: 12,
  },
  {
    id: 2,
    name: "Transport",
    spent: 245.25,
    budget: 300,
    color: "#10b981",
    icon: "🚗",
    transactions: 8,
  },
  {
    id: 3,
    name: "Entertainment",
    spent: 125.5,
    budget: 200,
    color: "#f59e0b",
    icon: "🎬",
    transactions: 5,
  },
  {
    id: 4,
    name: "Utilities",
    spent: 185.0,
    budget: 250,
    color: "#ef4444",
    icon: "⚡",
    transactions: 3,
  },
  {
    id: 5,
    name: "Shopping",
    spent: 325.99,
    budget: 500,
    color: "#8b5cf6",
    icon: "🛍️",
    transactions: 7,
  },
  {
    id: 6,
    name: "Healthcare",
    spent: 95.0,
    budget: 200,
    color: "#ec4899",
    icon: "⚕️",
    transactions: 2,
  },
];

export function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize and track your expenses by category</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Category</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const percentage = Math.round((category.spent / category.budget) * 100);
          const isOverBudget = category.spent > category.budget;

          return (
            <Card key={category.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {category.transactions} transactions
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget Usage</span>
                    <span
                      className={`font-semibold ${
                        isOverBudget ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isOverBudget ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <p className="font-semibold">${category.spent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="font-semibold">${category.budget.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
