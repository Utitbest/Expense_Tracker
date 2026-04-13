"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, clearUser } = useAuthStore();
  const router = useRouter();

  const updateProfile = async ({ name }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Saving changes...");

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Profile updated successfully!", { id: loadingToast });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  
  const downloadData = async () => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Preparing your data...");

    try {
      const response = await fetch("/api/settings/download", {
        method: "GET",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to download data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `budgetpilot-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Data downloaded successfully!", { id: loadingToast });
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Deleting your account...");

    try {
      const response = await fetch("/api/settings/account", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      toast.success("Account deleted successfully", { id: loadingToast });

      clearUser();
      router.push("/login");

      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    downloadData,
    deleteAccount,
    loading,
    error,
    setError,
  };
};