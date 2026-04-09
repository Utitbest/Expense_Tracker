"use client";

import { useState } from "react";
import { toast } from "sonner";

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // ── GET: Fetch all analytics data ─────────────────────────────────────────
  // GET /api/analytics?months=6
  // Returns: spendingTrend, categoryComparison, insights, stats
  const getAnalytics = async (months = 6) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics?months=${months}`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch analytics");
      }

      setAnalytics(data.data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getAnalytics,
    analytics,
    loading,
    error,
    setError,
  };
};