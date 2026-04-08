"use client"
import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/useResetPassword"
import { useRouter } from "next/navigation";

// $2b$10$FzXkFntrj/1CLNhQXL9fQuJYdjYO6zn9snSMaWepcWGEcvpT9g0qi

export function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  const { ResetPassword, loading, error, setError } = useResetPassword()

  const [input, setInput] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const passwordStrength = {
    hasLength: input.password.length >= 8,
    hasNumber: /\d/.test(input.password),
    hasUppercase: /[A-Z]/.test(input.password),
  };

  const isStrong =
    passwordStrength.hasLength &&
    passwordStrength.hasNumber &&
    passwordStrength.hasUppercase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (input.password !== input.confirmPassword){
      setError("Passwords do not match");
      return;
    }

    if (!isStrong) {
      setError("Password must be at least 8 characters with 1 number and 1 uppercase letter");
      return;
    }

    const result = await ResetPassword({token: token, password: input.password})
    if(result.success){
        router.push("/login")
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            BP
          </div>
          <span className="font-bold hidden sm:inline">BudgetPilot</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Reset your account Password</CardTitle>
              <CardDescription>
                All is secured and shield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      value={input.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2">
                      {[passwordStrength.hasLength, passwordStrength.hasNumber, passwordStrength.hasUppercase].map(
                        (check, idx) => (
                          <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              check ? "bg-accent" : "bg-border"
                            }`}
                          ></div>
                        )
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isStrong
                        ? "Strong password ✓"
                        : "Min 8 chars, 1 number, 1 uppercase"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className="pl-10"
                      value={input.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  {input.confirmPassword && input.password !== input.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Reseting Password..." : "Reset Password"} 
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}