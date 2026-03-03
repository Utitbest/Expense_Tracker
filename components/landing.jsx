"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, TrendingUp, Wallet, PieChart, Zap } from "lucide-react"
import { Button } from "@/components/ui_kits/Button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSelector } from "@/components/LanguageSelector"
import Image from "next/image"
export function Landing() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              BP
            </div>
            <span className="text-xl font-bold hidden sm:inline">BudgetPilot</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            <Link href="/login">
              <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="hidden sm:inline-flex">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-balance leading-tight mb-6">
              Master Your <span className="text-primary">Finances</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Track expenses, manage budgets, and get actionable financial insights in seconds. Take control of your
              money today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-96 sm:h-full min-h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            {/* <div className="w-48 h-64 rounded-xl bg-gradient-to-br from-primary to-accent opacity-30 absolute"></div>
            <div className="w-32 h-40 rounded-lg bg-primary/40 absolute transform -rotate-12"></div> */}
            <img
             src="/supriseMan.png" 
             alt="superman with wins"
             width={100}
             height={100}
             className="object-cover object-top w-full h-full"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose BudgetPilot?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your finances effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Wallet,
              title: "Track Expenses",
              description: "Categorize and monitor all your spending in real-time",
            },
            {
              icon: PieChart,
              title: "Budget Management",
              description: "Set budgets and receive alerts when you're close to limits",
            },
            {
              icon: TrendingUp,
              title: "Analytics & Insights",
              description: "Visualize spending trends and identify saving opportunities",
            },
            {
              icon: Zap,
              title: "Bank Integration",
              description: "Link your cards and sync transactions automatically",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">Ready to take control?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start tracking your expenses and building better financial habits today.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  BP
                </div>
                <span className="font-bold">BudgetPilot </span>
              </div>
              <p className="text-muted-foreground text-sm">Master your finances with ease.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Contact"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2026 BudgetPilot. All rights reserved. Made by Utitbest with ❤️</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="https://x.com/utitbest" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="https://github.com/Utitbest" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="https://www.linkedin.com/in/utitbest" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
