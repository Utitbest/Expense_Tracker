"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tomorrow } from "next/font/google";
import { useAuthStore } from "@/hooks/useAuthStore";

export const useAuth = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, clearUser } = useAuthStore();
  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Account created successfully! 🎉", {
        id: loadingToast,
      });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
       toast.error(err.message, {
        id: loadingToast,
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Logging you in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Welcome back! 👋", {
        id: loadingToast,
      });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
       toast.error(err.message, {
        id: loadingToast,
      })
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Logging out...");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      clearUser();
      toast.success("Logged out successfully!", {
        id: loadingToast,
      });
      router.push("/login");
      return { success: true, data };
    } catch (err) {
      setError(err.message);
       toast.error(err.message, {
        id: loadingToast,
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    login,
    logout,
    loading,
    error,
    setError,
  };
};