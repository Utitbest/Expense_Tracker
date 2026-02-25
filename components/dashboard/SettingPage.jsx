"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_kits/Select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BankLinkingSection } from "@/components/dashboard/BankSection";
import { User, Lock, Download, LogOut, ChevronRight } from "lucide-react";

export function SettingsPage() {
  const [username, setUsername] = useState("john.doe");
  const [email, setEmail] = useState("john@example.com");
  const [currency, setCurrency] = useState("usd");

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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label>Profile Picture</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                👤
              </div>
              <Button variant="outline" className="bg-transparent">
                Change Picture
              </Button>
            </div>
          </div>

          <Button className="w-full">Save Changes</Button>
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
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>Change Password</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>Two-Factor Authentication</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full justify-between bg-transparent">
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
            <Select value={currency} onValueChange={setCurrency}>
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
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download My Data
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
          <Button variant="destructive" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Delete Account
            </span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
