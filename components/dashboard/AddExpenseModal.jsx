"use client";

import { useState } from "react";
import { Modal } from "@/components/ui_kits/Modal";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Spinner } from "@/components/ui_kits/Spinner";
import { toast } from "sonner";
import { ExpenseFetch } from "@/hooks/useExpense"
import { 
  DollarSign,
  Calendar, 
  FileText, 
  Tag, 
  CreditCard,
  Plus 
} from "lucide-react";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Other",
];

export function AddExpenseModal({ open, onOpenChange, onExpenseAdded }) { 
  const { loading, error, AddExpense} = ExpenseFetch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const formData = new FormData(e.target);
    const expenseData = {
      title: formData.get("title"),
      amount: parseFloat(formData.get("amount")),
      category: formData.get("category"),
      date: formData.get("date"),
      description: formData.get("description"),
      paymentMethod: formData.get("paymentMethod"),
    };

    
      const data = await AddExpense(expenseData)
      console.log(data)
      if (data.success) {
        toast.success("Expense added successfully!");
        e.target.reset();
        onOpenChange(false);
        if (onExpenseAdded) onExpenseAdded(data.expense);
      }// else {
      //   toast.error(data.message || "Failed to add expense");
      // }
   
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Expense"
      description="Track your spending by adding a new expense"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="title"
              name="title"
              placeholder="e.g., Lunch at restaurant"
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <select
              id="category"
              name="category"
              className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              max={today}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Add notes about this expense..."
            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            disabled={loading}
            maxLength={500}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Spinner className="mr-2 w-4 h-4" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 w-4 h-4" />
                Add Expense
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}