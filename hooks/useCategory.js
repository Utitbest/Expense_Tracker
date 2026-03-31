"use client";
import { useState } from "react";
import { toast } from "sonner";

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", { method: "GET" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async ({ name, budget }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Saving category...");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, budget }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save category");
      }

      toast.success("Category saved successfully! 🎉", { id: loadingToast });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async ({ id, budget }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Updating budget...");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      toast.success("Budget updated successfully!", { id: loadingToast });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async ({ id }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Resetting category...");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset category");
      }
      toast.success("Category budget reset successfully!", { id: loadingToast });
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadingToast });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getCategories,
    saveCategory,
    updateCategory,
    deleteCategory,
    categories,
    loading,
    error,
    setError,
  };
};
