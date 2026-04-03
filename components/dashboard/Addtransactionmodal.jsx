"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Modal } from "@/components/ui_kits/Modal";
import { useTransaction } from "@/hooks/useTransaction";
import { CATEGORY_ICONS, CATEGORIES } from "@/lib/utils";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Textarea } from "@/components/ui_kits/TextArea";
import { Spinner } from "@/components/ui_kits/Spinner";
import { Calendar } from "@/components/ui_kits/Calender";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui_kits/Select";


const initialForm = {
  name: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
};

export function AddTransactionModal({ open, onOpenChange, onSuccess }) {
  const { addTransaction, loading } = useTransaction();
  const [form, setForm] = useState(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addTransaction({
      name: form.name,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      description: form.description,
    });

    if (result.success) {
      setForm(initialForm);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Transaction"
      description="Fill in the details below to record a new transaction."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Transaction Name</Label>
          <Input
            id="name"
            disabled={loading}
            name="name"
            type="text"
            placeholder="e.g. Starbucks Coffee"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
             disabled={loading}
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-35">
            <Label htmlFor="type">Type</Label>
            <Select
             disabled={loading}
              value={form.type}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="category">Category</Label>
          <Select
          disabled={loading}
            value={form.category}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
                <Button
                 disabled={loading}
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setShowCalendar((prev) => !prev)}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.date ? format(new Date(form.date), "PPP") : "Pick a date"}
                </Button>
                {showCalendar && (
                <div className="absolute z-50 mt-1 bg-background border border-border rounded-xl shadow-lg">
                    <Calendar
                    mode="single"
                    selected={form.date ? new Date(form.date) : undefined}
                    onSelect={(date) => {
                        setForm((prev) => ({
                        ...prev,
                        date: date ? date.toISOString().split("T")[0] : "",
                        }));
                        setShowCalendar(false);
                    }}
                    />
                </div>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="description">
            Description{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add a note..."
            value={form.description}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : "Add Transaction"}
        </Button>

      </form>
    </Modal>
  );
}