import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="text-center text-sm lg:text-base">
      <main className="flex-1">
        <section className="py-6 px-4 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
            Take Control of Your Finances with{" "}
            <span className="text-primary">Frugalistic</span>
          </h1>
          <p className="text-muted-foreground mt-2 lg:text-lg">
            Track your expenses, savings, and income effortlessly.
          </p>
          <p className="text-muted-foreground mt-2 lg:text-lg">
            Visualize your financial health and stay on top of your finances.
          </p>
          <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:justify-center lg:gap-4">
            <Link href="/login">
              <Button className="w-full lg:w-auto">Get Started</Button>
            </Link>
            <Link href="/about" className="text-primary underline">
              Learn More
            </Link>
          </div>
        </section>

        <section className="py-6 bg-muted lg:py-10 lg:max-w-3xl mx-auto">
          <div className="max-w-md mx-auto space-y-4 lg:max-w-3xl">
            <h2 className="text-xl font-bold lg:text-2xl">Why Frugalistic?</h2>
            <div className="space-y-2 lg:space-y-4">
              <div>
                <h3 className="font-bold lg:text-lg">Expense Tracking</h3>
                <p className="text-muted-foreground lg:text-base">
                  Keep track of your spending and identify patterns to save
                  more.
                </p>
              </div>
              <div>
                <h3 className="font-bold lg:text-lg">Savings Insights</h3>
                <p className="text-muted-foreground lg:text-base">
                  Analyze your savings trends with detailed charts and
                  statistics.
                </p>
              </div>
              <div>
                <h3 className="font-bold lg:text-lg">Income Insights</h3>
                <p className="text-muted-foreground lg:text-base">
                  Understand your earnings and optimize your budgeting strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 px-4 lg:py-12 lg:px-8">
          <h2 className="text-xl font-bold lg:text-2xl">
            Start Managing Your Money Today
          </h2>
          <p className="text-muted-foreground mt-2 lg:text-lg">
            Join Frugalistic and gain full control over your financial health.
          </p>
          <div className="mt-4 lg:mt-6">
            <Link href="/login">
              <Button className="w-full lg:w-auto">Sign up</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-4 text-xs text-muted-foreground border-t lg:py-6 lg:text-sm">
        &copy; 2024 Frugalistic. All rights reserved.
      </footer>
    </div>
  );
}
