"use client"
import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui_kits/Button";
import { Input } from "@/components/ui_kits/Input";
import { Label } from "@/components/ui_kits/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { toast } from "sonner";
export function SignupForm() {
  const router = useRouter();
  const { signup, loading, error, setError } = useAuth();
  
  const [input, setInput] = useState({
    username: "",
    email: "",
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

    if (input.password !== input.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrong) {
      setError("Password must be at least 8 characters with 1 number and 1 uppercase letter");
      return;
    }

    const result = await signup({
      name: input.username,
      email: input.email,
      password: input.password,
    });

    if (result.success) {
      console.log("Signup successful!", result.data);
      router.push("/dashboard");
    }
  };


const handleGoogleSignup = async (e) => {
  e.preventDefault()
  try{ 
    toast.loading("Redirecting to Google...");
    window.location.href = "/api/auth/google";
  } catch (error) { console.error("Google signup error:", error); 
    toast.error("Something went wrong with Google sign-up"); 
  }finally { 
    toast.dismiss(); 
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex flex-col">
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
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Join thousands managing their finances smarter
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
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      className="pl-10"
                      value={input.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      className="pl-10"
                      value={input.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

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
                  {loading ? "Creating Account..." : "Create Account"} 
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign Up with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}