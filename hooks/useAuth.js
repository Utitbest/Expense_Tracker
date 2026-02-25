"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/useAuthStore"
import { Tomorrow } from "next/font/google";


export const useAuth = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Signup function
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

  // Login function
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

  // Logout function
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

  // Get current user
  const getCurrentUser = async () => {
  const { setUser, setLoading, setError } = useAuthStore();
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("");
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get user");
      }

      setUser(data)
      console.log(data)

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
    getCurrentUser,
    loading,
    error,
    setError,
  };
};