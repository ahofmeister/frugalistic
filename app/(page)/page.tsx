import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="text-2xl text-center">
      <main className="flex-1">
        <section className="w-full py-10 md:py-5 lg:py-10 xl:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Embrace a Frugal Lifestyle with Frugalistic
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Frugalistic is a personal finance app that helps you adopt a
                    frugal mindset and make the most of your resources. Discover
                    the joy of living within your means, reducing waste, and
                    achieving your financial goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#9570c] px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-[#9570c]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="text-primary inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-28 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Embrace a Frugal Lifestyle with Ease
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  With Frugalistic, adopting a frugal mindset is easier than
                  ever and make the most of your resources. Reduce waste, save
                  money, and achieve your financial goals - all in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-10 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Frugal Mindset</h3>
                <p className="text-sm text-muted-foreground">
                  Develop a frugal mindset and learn to live within your means.
                  Discover the joy of reducing waste and making the most of your
                  resources.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Savings Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Maximize your savings by identifying areas to cut back and
                  allocate your resources effectively. Achieve your financial
                  goals with ease.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Sustainable Spending</h3>
                <p className="text-sm text-muted-foreground">
                  Learn to spend mindfully and make conscious decisions about
                  your purchases. Reduce waste and enjoy a more fulfilling
                  lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Visualize Your Finances
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Gain Insights with Powerful Reporting
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Frugalistic provides comprehensive reporting and visualization
                  tools to help you understand your financial situation at a
                  glance and make informed decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-10 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Expense Breakdown</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your monthly expenses by category to identify areas
                  for improvement and optimize your spending.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Income and Savings Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Track your income and savings progress over time to ensure
                  you're on the right financial path and making the most of your
                  resources.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-28 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Get Started
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Mastering Your Finances Today
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Frugalistic is the perfect tool to help you embrace a frugal
                  lifestyle and take control of your finances. Sign up now and
                  start your journey towards financial freedom.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Link href="/login">
                  <Button type="submit">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Frugalistic. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
