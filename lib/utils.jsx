import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_COLORS = {
  Food:          "#2563eb",
  Transport:     "#10b981",
  Entertainment: "#f59e0b",
  Utilities:     "#ef4444",
  Shopping:      "#8b5cf6",
  Healthcare:    "#ec4899",
  Education:     "#06b6d4",
  Income:        "#22c55e",
  Other:         "#94a3b8",
};

export const CATEGORY_ICONS = {
  Food:          "🍽️",
  Transport:     "🚗",
  Entertainment: "🎬",
  Utilities:     "⚡",
  Healthcare:    "🏥",
  Education:     "📚",
  Shopping:      "🛍️",
  Income:        "💰",
  Other:         "📦",
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTransaction = (transaction) => ({
  id:          transaction._id,
  name:        transaction.name,
  category:    transaction.category,
  amount:      transaction.type === "expense" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
  date:        formatDate(transaction.date),
  status:      transaction.status,
  icon:        CATEGORY_ICONS[transaction.category] || "📦",
});

export const formatTransactions = (transactions) => transactions.map(formatTransaction);