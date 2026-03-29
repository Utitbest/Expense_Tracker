"use client"
import React, { useState } from "react";
import { LayoutDashboard, CreditCard, TrendingUp, Target, Settings, X } from "lucide-react";
import { Button } from "@/components/ui_kits/Button";
import Link from "next/link";
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/budgets", label: "Budgets", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ open, onOpenChange }) {
  const [activePath, setActivePath] = useState("/dashboard");

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      ></div>
      <nav className="relative bg-card w-64 border-r border-border flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-border">
          <span className="font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActivePath(item.href);
                  onOpenChange(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
