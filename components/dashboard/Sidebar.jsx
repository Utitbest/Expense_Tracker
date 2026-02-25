"use client"
import React, { useState } from "react";
import { LayoutDashboard, CreditCard, TrendingUp, Target, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui_kits/Button";
import Link from "next/link";
import { useActivePath } from "@/hooks/useActivePath";
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/categories", label: "Categories", icon: LayoutDashboard },
  { href: "/dashboard/budgets", label: "Budgets", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const {activePath, updatePath} = useActivePath("/dashboard")
  return (
    <aside className="hidden md:flex w-64 border-r border-border bg-card flex-col">
      <Link
        href="/dashboard"
        onClick={() => updatePath("/dashboard")}
        className="p-6 border-b border-border flex items-center gap-3 hover:bg-muted transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          BP
        </div>
        <span className="font-bold text-lg">BudgetPilot</span>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => updatePath(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
