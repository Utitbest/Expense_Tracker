"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui_kits/Modal";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Spinner } from "@/components/ui_kits/Spinner";
import { useCategory } from "@/hooks/useCategory";
import { Calendar } from "lucide-react";
import { PERIODS } from "@/lib/utils"


export function EditCategoryModal({ open, onOpenChange, category, onSuccess }) {
  const { saveCategory, updateCategory, loading } = useCategory();
  const [budget, setBudget] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [alertThreshold, setAlertThreshold] = useState(80);

  useEffect(() => {
    if (category) {
      setBudget(category.budget?.toString() || "");
      setPeriod(category.period || "Monthly");
      setAlertThreshold(category.alertThreshold || 80);
    }
  }, [category]);

  if (!category) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (category.id) {
      result = await updateCategory({
        id: category.id,
        budget: parseFloat(budget),
        period,
      });
    } else {
      result = await saveCategory({
        name: category.name,
        budget: parseFloat(budget),
        period,
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <p className="font-medium">{category?.name}</p>
            <p className="text-xs text-muted-foreground">
              ${Number(category?.spent?.toFixed(2)).toLocaleString()} spent so far
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="budget">Budget Amount ($)</Label>
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

        <div className="flex flex-col gap-2">
          <Label>Period</Label>
          <div className="grid grid-cols-3 gap-2">
            {PERIODS.map((p) => (
              <button
                disabled={loading}
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-colors ${
                  period === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted hover:border-primary/50"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{p}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
            <span className="text-sm font-semibold text-primary">{alertThreshold}%</span>
          </div>
          <input
            id="alertThreshold"
            type="range"
            min="10"
            max="100"
            step="5"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>Alert when budget reaches this %</span>
            <span>100%</span>
          </div>
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
              Current budget: ${category?.budget?.toFixed(2)} · {category?.period}
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