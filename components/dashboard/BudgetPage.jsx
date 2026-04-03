"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Plus, AlertTriangle, MoreVertical, TrendingUp, X, ArrowUpRight, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { EditCategoryModal, DeleteCategoryModal } from "@/components/dashboard/AddCategoryModal";
import { CATEGORY_ICONS, CATEGORY_COLORS, PERIOD_FILTERS, STATUS_FILTERS } from "@/lib/utils";


export function BudgetsPage() {
  const { getCategories, categories, loading, error } = useCategory();
  const [periodFilter, setPeriodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
    };
    fetchData();
  }, []);

  const budgetCategories = categories.filter((c) => c.budget > 0);

  const filteredBudgets = budgetCategories.filter((cat) => {
    const percentage = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
    const matchesPeriod = periodFilter === "All" || cat.period === periodFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "On Track" && percentage < 80) ||
      (statusFilter === "Warning" && percentage >= 80 && percentage < 100) ||
      (statusFilter === "Exceeded" && percentage >= 100);
    return matchesPeriod && matchesStatus;
  });

  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const alerts = budgetCategories.filter(
    (c) => c.budget > 0 && (c.spent / c.budget) * 100 >= 80
  );

  const getStatus = (spent, budget) => {
    const pct = (spent / budget) * 100;
    if (pct >= 100) return "exceeded";
    if (pct >= 80) return "warning";
    return "ontrack";
  };

  const handleEditClick = (cat) => {
    setSelectedCategory({ ...cat, icon: CATEGORY_ICONS[cat.name] });
    setEditOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (cat) => {
    setSelectedCategory({ ...cat, icon: CATEGORY_ICONS[cat.name] });
    setDeleteOpen(true);
    setOpenMenuId(null);
  };

  const handleViewDetails = (cat) => {
    setDetailCategory({ ...cat, icon: CATEGORY_ICONS[cat.name] });
    setDetailOpen(true);
    setOpenMenuId(null);
  };

  return (
    <div className="p-6 space-y-6 relative">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>
        <Button className="gap-2" onClick={() => {
          setSelectedCategory(null);
          setEditOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Budget</span>
        </Button>
      </div>

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
            <div className="text-3xl text-destructive font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-destructive mt-1">
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalRemaining < 0 ? "text-destructive" : "text-accent"}`}>
              ${Math.abs(totalRemaining).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRemaining < 0 ? "Over budget" : "Available to spend"}
            </p>
          </CardContent>
        </Card>
      </div>

      {alerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Budget Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((cat) => {
                const pct = Math.round((cat.spent / cat.budget) * 100);
                return (
                  <div
                    key={cat.name}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-destructive/20"
                  >
                    <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center">
                      {CATEGORY_ICONS[cat.name]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{cat.name} budget at {pct}%</p>
                      <p className="text-xs text-muted-foreground">
                        ${cat.spent.toFixed(2)} of ${cat.budget.toFixed(2)} spent
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent flex-shrink-0"
                      onClick={() => handleViewDetails(cat)}
                    >
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
          {PERIOD_FILTERS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                periodFilter === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => {
            const icons = {
              All: null,
              "On Track": <CheckCircle className="h-3.5 w-3.5" />,
              Warning: <AlertCircle className="h-3.5 w-3.5" />,
              Exceeded: <XCircle className="h-3.5 w-3.5" />,
            };
            const colors = {
              All: statusFilter === s ? "bg-primary text-primary-foreground" : "border-border",
              "On Track": statusFilter === s ? "bg-accent/20 text-accent border-accent" : "border-border",
              Warning: statusFilter === s ? "bg-yellow-500/20 text-yellow-500 border-yellow-500" : "border-border",
              Exceeded: statusFilter === s ? "bg-destructive/20 text-destructive border-destructive" : "border-border",
            };
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${colors[s]}`}
              >
                {icons[s]}
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-destructive text-sm font-medium">Failed to load budgets</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-muted-foreground">No budgets found</p>
          <Button onClick={() => setEditOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Set a budget
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredBudgets.map((cat) => {
            const percentage = cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0;
            const status = getStatus(cat.spent, cat.budget);
            const remaining = cat.budget - cat.spent;

            return (
              <Card
                key={cat.name}
                className={`transition-colors ${
                  status === "exceeded"
                    ? "border-destructive/50 bg-destructive/5"
                    : status === "warning"
                    ? "border-yellow-500/50 bg-yellow-500/5"
                    : ""
                }`}
              >
                <CardContent className="pt-5">
                  <div className="space-y-4">

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: CATEGORY_COLORS[cat.name] + "30" }}
                        >
                          {CATEGORY_ICONS[cat.name]}
                        </div>
                        <div>
                          <p className="font-semibold">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.period || "Monthly"} Budget</p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === cat.name ? null : cat.name)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {openMenuId === cat.name && (
                          <div className="absolute right-0 top-8 z-50 bg-background border border-border rounded-lg shadow-lg py-1 w-36">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                              Edit Budget
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cat)}
                              className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                            >
                              Reset Budget
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Spent</p>
                      <p className="text-sm font-semibold">
                        ${cat.spent.toFixed(2)}{" "}
                        <span className="text-muted-foreground font-normal">/ ${cat.budget.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor:
                              status === "exceeded"
                                ? "#ef4444"
                                : status === "warning"
                                ? "#eab308"
                                : CATEGORY_COLORS[cat.name],
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p
                          className={`text-xs font-medium ${
                            status === "exceeded"
                              ? "text-destructive"
                              : status === "warning"
                              ? "text-yellow-500"
                              : "text-accent"
                          }`}
                        >
                          {percentage}% used
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {remaining < 0
                            ? `Over by $${Math.abs(remaining).toFixed(2)}`
                            : `Remaining $${remaining.toFixed(2)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5 bg-transparent text-xs"
                        onClick={() => handleViewDetails(cat)}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {detailOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setDetailOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${
          detailOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {detailCategory && (
          <div className="flex flex-col h-full overflow-y-auto">

            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: CATEGORY_COLORS[detailCategory.name] + "30" }}
                >
                  {detailCategory.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{detailCategory.name}</h2>
                  <p className="text-xs text-muted-foreground">{detailCategory.period || "Monthly"} budget details</p>
                </div>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-5 border-b border-border">
              {[
                { label: "Budget", value: `$${detailCategory.budget?.toFixed(2)}`, color: "text-foreground" },
                { label: "Spent", value: `$${detailCategory.spent?.toFixed(2)}`, color: "text-destructive" },
                { label: "Left", value: `$${Math.max(0, detailCategory.budget - detailCategory.spent).toFixed(2)}`, color: "text-accent" },
              ].map((s) => (
                <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className={`font-bold text-base ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="p-5 border-b border-border space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">Progress</p>
                <p
                  className={`text-sm font-bold ${
                    getStatus(detailCategory.spent, detailCategory.budget) === "exceeded"
                      ? "text-destructive"
                      : getStatus(detailCategory.spent, detailCategory.budget) === "warning"
                      ? "text-yellow-500"
                      : "text-accent"
                  }`}
                >
                  {detailCategory.budget > 0
                    ? Math.round((detailCategory.spent / detailCategory.budget) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      detailCategory.budget > 0
                        ? (detailCategory.spent / detailCategory.budget) * 100
                        : 0,
                      100
                    )}%`,
                    backgroundColor: CATEGORY_COLORS[detailCategory.name],
                  }}
                />
              </div>
            </div>

            <div className="p-5 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={() => {
                    setDetailOpen(false);
                    handleEditClick(detailCategory);
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Edit Budget
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    setDetailOpen(false);
                    handleDeleteClick(detailCategory);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Overview
              </p>
              <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Transactions</p>
                  <p className="text-xs text-muted-foreground">This period</p>
                </div>
                <p className="text-2xl font-bold">{detailCategory.transactions}</p>
              </div>
            </div>

          </div>
        )}
      </div>

      <EditCategoryModal
        open={editOpen}
        onOpenChange={setEditOpen}
        category={selectedCategory}
        onSuccess={() => getCategories()}
      />
      <DeleteCategoryModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
        onSuccess={() => getCategories()}
      />

    </div>
  );
}