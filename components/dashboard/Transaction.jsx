"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_kits/Select";
import { Search, Download, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const allTransactions = [
  { id: 1, name: "Starbucks Coffee", category: "Food", amount: -5.5, date: "Dec 15, 2024", status: "completed", icon: "☕" },
  { id: 2, name: "Monthly Salary", category: "Income", amount: 3500, date: "Dec 14, 2024", status: "completed", icon: "💰" },
  { id: 3, name: "Uber Ride", category: "Transport", amount: -12.3, date: "Dec 13, 2024", status: "completed", icon: "🚗" },
  { id: 4, name: "Netflix Subscription", category: "Entertainment", amount: -12.99, date: "Dec 12, 2024", status: "completed", icon: "🎬" },
  { id: 5, name: "Whole Foods", category: "Food", amount: -125.45, date: "Dec 12, 2024", status: "completed", icon: "🛒" },
  { id: 6, name: "Electric Bill", category: "Utilities", amount: -85.0, date: "Dec 10, 2024", status: "completed", icon: "⚡" },
  { id: 7, name: "Gas Station", category: "Transport", amount: -55.25, date: "Dec 9, 2024", status: "completed", icon: "⛽" },
  { id: 8, name: "Restaurant Dinner", category: "Food", amount: -78.5, date: "Dec 8, 2024", status: "completed", icon: "🍽️" },
];

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ["all", "Food", "Transport", "Entertainment", "Utilities", "Income"];

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg">
                      {transaction.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 font-semibold justify-end ${
                        transaction.amount > 0 ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                      {transaction.amount > 0 ? "+" : ""}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
