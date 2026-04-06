"use client";
import { useState } from "react";
import { toast } from "sonner";

export const useTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const addTransaction = async ({ name, amount, type, category, date, status, description }) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading("Adding transaction...");

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount, type, category, date, status, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add transaction");
      }

      toast.success("Transaction added successfully! 🎉", {
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

  
  const getTransactions = async ({ type, category } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (category) params.append("category", category);

      const url = `/api/transactions${params.toString() ? `?${params}` : ""}`;

      const response = await fetch(url, { method: "GET" });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      if(data.success){
        setTransactions(data.transactions);
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

  return {
    addTransaction,
    getTransactions,
    transactions,
    loading,
    error,
    setError,
  };
};