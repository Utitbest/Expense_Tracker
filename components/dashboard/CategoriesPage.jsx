"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { EditCategoryModal, DeleteCategoryModal } from "@/components/dashboard/AddCategoryModal";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/utils";



export function CategoriesPage() {
  const { getCategories, categories, loading, error } = useCategory();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
    };
    fetchData();
  }, []);

  const CategoryFilterIncome = categories.filter(e => e.name !== "Income")
  console.log("cate", CategoryFilterIncome)

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize and track your expenses by category</p>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
        </div>

      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-destructive text-sm font-medium">Failed to load categories</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>

      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.filter(e => e.name !== "Income").map((category) => {

            const percentage = category.budget > 0
              ? Math.round((category.spent / category.budget) * 100)
              : 0;
            const isOverBudget = category.spent > category.budget && category.budget > 0;

            return (
              <Card key={category.name} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                        {CATEGORY_ICONS[category.name]}
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
                      <span className={`font-semibold ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
                        {category.budget > 0 ? `${percentage}%` : "No budget set"}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isOverBudget ? "bg-destructive" : "bg-primary"}`}
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: !isOverBudget ? CATEGORY_COLORS[category.name] : undefined,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Spent</p>
                      <p className="font-semibold">${category.spent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="font-semibold">
                        {category.budget > 0 ? `$${category.budget.toFixed(2)}` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => handleEditClick({ ...category, icon: CATEGORY_ICONS[category.name] })}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 bg-transparent"
                      disabled={!category.id}
                      onClick={() => handleDeleteClick({ ...category, icon: CATEGORY_ICONS[category.name] })}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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