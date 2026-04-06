"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui_kits/Sheet";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Textarea } from "@/components/ui_kits/TextArea";
import { Spinner } from "@/components/ui_kits/Spinner";
import { useMonthlyRecord } from "@/hooks/useMonthlyRecord";
import { PAYMENT_METHODS, QUICK_AMOUNTS} from "@/lib/utils"


export function AddDeposit({ open, onOpenChange, onSuccess }) {
  const { saveRecord, loading } = useMonthlyRecord();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [note, setNote] = useState("");

  const depositAmount = parseFloat(amount) || 0;
  const processingFee = 0; 
  const totalAmount = depositAmount + processingFee;

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
  };

  const handleConfirm = async () => {
    if (!depositAmount || depositAmount <= 0) return;

    const now = new Date();

    const result = await saveRecord({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      income: depositAmount,
      expenses: 0,
      note,
      paymentMethod: selectedMethod,
    });
    console.log(result)
    if (result.success) {
      setAmount("");
      setSelectedMethod("bank");
      setNote("");
      onOpenChange(false);
      if (onSuccess) onSuccess()
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-xl">Deposit Money</SheetTitle>
          <SheetDescription>Add funds to your account</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4 pb-8">

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Enter Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickSelect(val)}
                  className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-colors ${
                    parseFloat(amount) === val
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted hover:border-primary/50 text-foreground"
                  }`}
                >
                  ${val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Payment Method</Label>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    disabled={true}
                    key={method.id}
                    title="Upgrade to premium first!🥺"
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: method.color }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-muted rounded-xl">
            <p className="font-semibold text-sm">Transaction Details</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit Amount</span>
                <span className="font-medium">
                  ${depositAmount > 0 ? depositAmount.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">${processingFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-primary text-base">
                  ${totalAmount > 0 ? totalAmount.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Add Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note for this deposit..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
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
              className="flex-1"
              onClick={handleConfirm}
              disabled={loading || !depositAmount || depositAmount <= 0}
            >
              {loading ? <Spinner /> : "Confirm Deposit"}
            </Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}