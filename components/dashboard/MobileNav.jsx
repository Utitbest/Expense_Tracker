"use client"
import React, { useState } from "react";
import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui_kits/Button";
import Link from "next/link";
import { navItems } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"
import { Modal } from "@/components/ui_kits/Modal";

export function MobileNav({ open, onOpenChange }) {
  const [activePath, setActivePath] = useState("/dashboard");
  const { logout, loading } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  if (!open) return null;


  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };


  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}>
      </div>
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

        <div className="border-t border-border p-4">
          <Button onClick={handleLogoutClick} disabled={loading} variant="outline" className="w-full justify-start gap-3 bg-transparent">
              <LogOut className="h-5 w-5" />
              Logout
          </Button>
        </div>
      </nav>

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
    </div>
  );
}
