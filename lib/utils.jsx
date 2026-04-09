import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, Building2, CreditCard, Wallet, TrendingUp, Target, Settings } from "lucide-react";


export const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

export const PAYMENT_METHODS = [
  {
    id: "bank",
    label: "Bank",
    description: "Visa ••••8765",
    icon: Building2,
    color: "#06b6d4",
  },
  {
    id: "debit",
    label: "Debit Card",
    description: "Visa ••••8765",
    icon: CreditCard,
    color: "#06b6d4",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "den@example.com",
    icon: Wallet,
    color: "#f97316",
  },
];

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
export const PERIOD_FILTERS = ["All", "Weekly", "Monthly", "Yearly"];
export const STATUS_FILTERS = ["All", "On Track", "Warning", "Exceeded"];
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
export const PERIODS = ["Monthly", "Weekly", "Yearly"];
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

export const MONTH_OPTIONS = [
  { value: "1", label: "Last Month" },
  { value: "3", label: "Last 3 Months" },
  { value: "6", label: "Last 6 Months" },
  { value: "12", label: "Last Year" },
];