"use client";

import { use, useState } from "react";
import { toast } from "sonner";

export const useMonthlyRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState(null)
  const saveRecord = async ({ year, month, income, expenses }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Saving record...");

    try {
      const response = await fetch("/api/finance/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month, income, expenses }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save record");
      }

      toast.success("Record saved successfully!", {
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

  // GET /api/finance/summary?year=2026&month=3
  // Returns currentBalance, totalIncome, totalExpenses, % change from last month
  const getSummary = async ({ year, month } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const targetYear = year || now.getFullYear();
      const targetMonth = month || now.getMonth() + 1;

      const response = await fetch(
        `/api/finance/summary?year=${targetYear}&month=${targetMonth}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch summary");
      }
      setSummary(data.data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // GET /api/finance/history
  const getHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/finance/history", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch history");
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // DELETE /api/finance/record
  const deleteRecord = async ({ year, month }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Deleting record...");

    try {
      const response = await fetch("/api/finance/record", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete record");
      }

      toast.success("Record deleted successfully!", {
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

  return {
    saveRecord,
    getSummary,
    getHistory,
    deleteRecord,
    summary,
    loading,
    error,
    setError,
  };
};