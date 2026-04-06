"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui_kits/Sheet";
import { Button } from "@/components/ui_kits/Button";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/utils";

export function ViewBudgetDetails({
  open,
  onOpenChange,
  category,
  getStatus,
  handleEditClick,
  handleDeleteClick,
}) {
    
  if (!category) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{
                backgroundColor:
                  (CATEGORY_COLORS[category.name] || "#94a3b8") + "30",
              }}
            >
              {category.icon}
            </div>
            <div>
              <SheetTitle className="text-xl">{category.name}</SheetTitle>
              <SheetDescription>
                {category.period || "Monthly"} budget details
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Budget",
                value: `$${category.budget?.toFixed(2)}`,
                color: "text-foreground",
              },
              {
                label: "Spent",
                value: `$${category.spent?.toFixed(2)}`,
                color: "text-destructive",
              },
              {
                label: "Left",
                value: `$${Math.max(
                  0,
                  category.budget - category.spent
                ).toFixed(2)}`,
                color: "text-accent",
              },
            ].map((s) => (
              <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Progress</p>
              <p
                className={`text-sm font-bold ${
                  getStatus(category.spent, category.budget) === "exceeded"
                    ? "text-destructive"
                    : getStatus(category.spent, category.budget) === "warning"
                    ? "text-yellow-500"
                    : "text-accent"
                }`}
              >
                {category.budget > 0
                  ? Math.round((category.spent / category.budget) * 100)
                  : 0}
                %
              </p>
            </div>

            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    category.budget > 0
                      ? (category.spent / category.budget) * 100
                      : 0,
                    100
                  )}%`,
                  backgroundColor:
                    CATEGORY_COLORS[category.name] || "#94a3b8",
                }}
              />
            </div>
          </div>

          <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Transactions</p>
              <p className="text-xs text-muted-foreground">This period</p>
            </div>
            <p className="text-2xl font-bold">{category.transactions}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => {
                  onOpenChange(false);
                  handleEditClick(category);
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
                Edit Budget
              </Button>

              <Button
                variant="outline"
                className="gap-2 bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  onOpenChange(false);
                  handleDeleteClick(category);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}