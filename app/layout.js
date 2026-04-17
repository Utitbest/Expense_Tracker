import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ThemeProvider"
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "BudgetPilot - Expense Tracker & Budget Manager",
    template: "%s | BudgetPilot",
  },

  description:
    "Track expenses, manage budgets, and take control of your finances with BudgetPilot. A modern expense tracker built for smart money management.",

  keywords: [
    "expense tracker",
    "budget app",
    "finance tracker",
    "money manager",
    "budget planner",
    "personal finance app",
    "track expenses online",
    "budget pilot",
    "expense manager",
  ],

  authors: [{ name: "Utitbest" }],
  creator: "Utitbest",

  metadataBase: new URL("https://expense-tracker-psi-puce.vercel.app/"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "BudgetPilot - Smart Expense Tracker",
    description:
      "Easily track your spending, manage budgets, and grow your savings with BudgetPilot.",
    url: "https://expense-tracker-psi-puce.vercel.app/",
    siteName: "BudgetPilot",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "BudgetPilot App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BudgetPilot - Expense Tracker",
    description:
      "Take control of your finances. Track expenses and manage budgets easily.",
    images: ["/og-image.png"],
    creator: "@utitbest", 
  },

  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
    ],
    apple: "/apple-icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
          <Providers>
            {children}
            <Toaster position="bottom-right" richColors />
          </Providers>
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "BudgetPilot",
                applicationCategory: "FinanceApplication",
                operatingSystem: "Web",
                description:
                  "Track expenses, manage budgets, and take control of your finances.",
                url: "https://expense-tracker-psi-puce.vercel.app/",
                creator: {
                  "@type": "Person",
                  name: "Utitbest"
                }
              }),
            }}
          />
      </body>
    </html>
  )
}
