import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, CreditCard, TrendingUp, Target, Settings } from "lucide-react";


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const errorMessages = {
  google_failed: "Google sign-in failed. Please try again.",
  no_code: "Authentication failed - no code received.",
  token_failed: "Failed to get access token from Google.",
  no_email: "Could not retrieve email from Google.",
};

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

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/categories", label: "Categories", icon: LayoutDashboard },
  { href: "/dashboard/budgets", label: "Budgets", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];


export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const categories = [
  "all", 
  "Food", 
  "Transport", 
  "Entertainment", 
  "Utilities", 
  "Healthcare", 
  "Education", 
  "Shopping", 
  "Income", 
  "Other"
];
export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Shopping",
  "Income",
  "Other",
];
const monthNames = [
  "Jan", 
  "Feb", 
  "Mar", 
  "Apr", 
  "May", 
  "Jun", 
  "Jul", 
  "Aug", 
  "Sep", 
  "Oct", 
  "Nov", 
  "Dec"
];

export const formatChartData = (records) => {
  return records.map((record) => ({
    month: monthNames[record.month - 1],
    income: record.income,
    expenses: record.expenses,
  }));
};

export const formatCategoryChartData = (categories) => {
  const expenseCategories = categories.filter(
    (cat) => cat.name !== "Income" && cat.spent > 0
  );

  const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0);

  const CATEGORY_COLORS = {
    Food:          "#2563eb",
    Transport:     "#10b981",
    Entertainment: "#f59e0b",
    Utilities:     "#ef4444",
    Shopping:      "#8b5cf6",
    Healthcare:    "#ec4899",
    Education:     "#06b6d4",
    Other:         "#94a3b8",
  };

  return expenseCategories.map((cat) => ({
    name: cat.name,
    value: totalSpent > 0 ? Math.round((cat.spent / totalSpent) * 100) : 0,
    color: CATEGORY_COLORS[cat.name] || "#94a3b8",
  }));
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