"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui_kits/Modal";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Spinner } from "@/components/ui_kits/Spinner";
import { useCategory } from "@/hooks/useCategory";

export function EditCategoryModal({ open, onOpenChange, category, onSuccess }) {
  const { saveCategory, updateCategory, loading } = useCategory();
  const [budget, setBudget] = useState("");


  useEffect(() => {
    if (category) {
      setBudget(category.budget?.toString() || "");
    }
  }, [category]);

  if (!category) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    if (category?.id) {
      result = await updateCategory({
        id: category.id,
        budget: parseFloat(budget),
      });
    } else {
      result = await saveCategory({
        name: category.name,
        budget: parseFloat(budget),
      });
    }

    if (result.success) {
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit ${category?.name} Budget`}
      description="Set a monthly budget limit for this category."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Category display — read only */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <p className="font-medium">{category?.name}</p>
            <p className="text-xs text-muted-foreground">
              ${category?.spent?.toFixed(2)} spent so far
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="budget">Monthly Budget ($)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            placeholder="e.g. 500"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : "Save Budget"}
        </Button>
      </form>
    </Modal>
  );
}

export function DeleteCategoryModal({ open, onOpenChange, category, onSuccess }) {
  const { deleteCategory, loading } = useCategory();


  if (!category) return null;


  const handleDelete = async () => {
    const result = await deleteCategory({ id: category.id });

    if (result.success) {
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  };


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reset Category Budget"
      description="Are you sure? This will reset the budget for this category to $0."
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <p className="font-medium">{category?.name}</p>
            <p className="text-xs text-muted-foreground">
              Current budget: ${category?.budget?.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Reset Budget"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}