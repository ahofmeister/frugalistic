import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

export default function LandingPage() {
  const features = [
    {
      title: "Transaction Tracking & Categorization",
      description: "Easily track and categorize finances.",
    },
    {
      title: "Personalized Insights",
      description: "Get financial insights and reports to guide decisions.",
    },
    {
      title: "Recurring Transactions",
      description: "Automate monthly transactions.",
    },
  ];

  return (
    <div className="text-center text-sm lg:text-base">
      <main className="flex-1">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={20}
          className="w-full h-full absolute -z-50"
          particleColor="#FFFFFF"
        />
        <section className="py-6 px-4 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
            Take Control of Your Finances with{" "}
            <span className="text-primary">Frugalistic</span>
          </h1>
          <p className="text-muted-foreground mt-5 lg:text-lg">
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

        <section className="py-6 lg:py-10 lg:max-w-3xl mx-auto">
          <div className="max-w-md mx-auto space-y-4 lg:max-w-3xl">
            <h2 className="text-xl font-bold lg:text-2xl">Why Frugalistic?</h2>
            <div className="space-y-2 lg:space-y-4">
              {features.map((feature) => (
                <div key={feature.title}>
                  <h3 className="font-bold lg:text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground lg:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
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
