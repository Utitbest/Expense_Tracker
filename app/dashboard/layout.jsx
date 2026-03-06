"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Spinner } from "@/components/ui_kits/Spinner";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui_kits/Button";
import { useAuth } from "@/hooks/useAuth";


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, loading } = useAuth()
  const { user, isAuthenticated, isLoading, fetchUser, setUser, clearUser } = useAuthStore();
  const hasFetchedRef = useRef(false);
  const [fetchError, setFetchError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  console.log(user)
  const handleRetry = async () => {
    setRetrying(true);
    setFetchError(false);
    hasFetchedRef.current = false;

    const result = await fetchUser();
    
    if (!result.success) {
      setFetchError(true);
      toast.error("Still unable to connect. Please try again later.");
    } else {
      toast.success("Connected successfully!");
    }
    
    setRetrying(false);
  };

  useEffect(() => {
    const welcome = searchParams.get("welcome");
    const authSuccess = searchParams.get("auth");
    const userDataParam = searchParams.get("user");

    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        setUser(userData);

        if (welcome === "true") {
          toast.success("Welcome! Your account has been created successfully!");
        } else if (authSuccess === "success") {
          toast.success("Welcome back!");
        }

        window.history.replaceState({}, '', window.location.pathname);
        return;
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    if (welcome === "true") {
      toast.success("🎉 Account created successfully!");
      window.history.replaceState({}, '', window.location.pathname);
    }

  const handleFetchUser = async () => {
    const result = await fetchUser();
    console.log("fetching result", result)
    if (!result.success) {
      if (result.error === 'unauthorized') {
        console.log("Invalid token, clearing and redirecting...");
        clearUser();
        await logout();
        toast.error("Session expired. Please sign in again.");
      } else if (result.error === 'network_error' || result.error === 'timeout' || result.error === 'server_error') {
        console.log("Server error, showing retry option...");
        setFetchError(true);
        toast.error("Unable to connect to server. Please try again.");
      } else {
        console.log("No token or unknown error, redirecting...");
        clearUser();
        await logout()

        // router.push('/login');
      }
    }
  };

  if (!user && !hasFetchedRef.current && !fetchError) {
    hasFetchedRef.current = true;
    handleFetchUser();
  }

  }, [searchParams, user, fetchUser, setUser, clearUser, router, fetchError]);

  if (isLoading || (!user && !hasFetchedRef.current && !fetchError)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="w-16 h-16 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (fetchError && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-muted-foreground mb-6">
            We're having trouble connecting to the server. This might be a temporary issue.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry} 
              disabled={retrying}
              className="w-full"
            >
              {retrying ? (
                <>
                  <Spinner className="mr-2 w-4 h-4" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Retry Connection
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={async() => {
                clearUser();
                await logout();
              }}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            If this issue persists, please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  // ✅ No user and no error - likely auth issue
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="w-16 h-16 mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated - show dashboard
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}