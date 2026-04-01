"use client"
import React, { useState } from "react";
import { LayoutDashboard, CreditCard, TrendingUp, Target, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui_kits/Button";
import Link from "next/link";
import { useActivePath } from "@/hooks/useActivePath";
import { useAuth } from "@/hooks/useAuth"
import { Modal } from "@/components/ui_kits/Modal";
import { navItems } from "@/lib/utils";


export function Sidebar() {
  const { logout, loading } = useAuth()
  const {activePath, updatePath} = useActivePath("/dashboard")
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };


  return (
    <>
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
        <Button onClick={handleLogoutClick} disabled={loading} variant="outline" className="w-full justify-start gap-3 bg-transparent">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>

    <Modal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
      >
        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Yes, Logout
              </>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}
