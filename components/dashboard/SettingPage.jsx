"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_kits/Select";
import { Modal } from "@/components/ui_kits/Modal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BankLinkingSection } from "@/components/dashboard/BankSection";
import { Spinner } from "@/components/ui_kits/Spinner";
import { User, Lock, Download, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useSettings } from "@/hooks/useSettings";
import Image from "next/image";
import Link from "next/link";
import { SubscribeModal } from "@/components/dashboard/SubscribeModal";




export function SettingsPage() {
  const { user } = useAuthStore();
  const { updateProfile, downloadData, deleteAccount, loading } = useSettings();

  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const hasValidImage = user?.provider === "google" && user?.image;

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    await updateProfile({ name: username });
  };

  const handleDownload = async () => {
    await downloadData();
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setDeleteModalOpen(false);
  };


  const [subscribeModal, setSubscribeModal] = useState({ open: false, feature: "" });

  const openSubscribeModal = (feature) => {
    setSubscribeModal({ open: true, feature });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">
                Email Address{" "}
                <span className="text-xs text-muted-foreground font-normal">(cannot be changed)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-2 opacity-50 cursor-not-allowed"
              />
            </div>

          </div>

          <div>
            <Label>Profile Picture</Label>
            <div className="mt-2 flex items-center gap-4">
              {hasValidImage ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="rounded-full w-20 h-20 border-2 border-primary"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
              <div className="flex flex-col gap-1">
                <Button
                  disabled
                  variant="outline"
                  className="bg-transparent opacity-50 cursor-not-allowed"
                >
                  Change Picture
                </Button>
                <p className="text-xs text-muted-foreground">
                  Available for subscribed users only
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSaveProfile}
            disabled={loading || !username.trim()}
          >
            {loading ? <Spinner /> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Security & Privacy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link className="flex" href="/forgotpassword">
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <span>Change Password</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Button onClick={() => openSubscribeModal("two-factor")} variant="outline" className="w-full justify-between bg-transparent">
            <span>Two-Factor Authentication</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button onClick={() => openSubscribeModal("active-sessions")} variant="outline" className="w-full justify-between bg-transparent">
            <span>Active Sessions</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Theme</Label>
            <div className="mt-2 flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Toggle between light and dark mode</span>
            </div>
          </div>
          <div>
            <Label>Language</Label>
            <div className="mt-2 flex items-center gap-4">
              <LanguageSelector />
              <span className="text-sm text-muted-foreground">Select your preferred language</span>
            </div>
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={() => openSubscribeModal("currency")}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">US Dollar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
                <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
                <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <BankLinkingSection />

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-between bg-transparent"
            onClick={handleDownload}
            disabled={loading}
          >
            <span className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {loading ? "Preparing..." : "Download My Data"}
            </span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>Privacy Policy</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>Terms of Service</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>Sign Out All Devices</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-between"
            onClick={() => setDeleteModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Delete Account
            </span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This will permanently remove all your data including transactions, budgets, and categories. This action cannot be undone."
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              ⚠️ This will permanently delete:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>All your transactions</li>
              <li>All monthly records</li>
              <li>All category budgets</li>
              <li>Your account and profile</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setDeleteModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Yes, Delete Account"}
            </Button>
          </div>
        </div>
      </Modal>
      <SubscribeModal
        open={subscribeModal.open}
        onOpenChange={(val) => setSubscribeModal({ ...subscribeModal, open: val })}
        feature={subscribeModal.feature}
      />        
    </div>  
  );
}