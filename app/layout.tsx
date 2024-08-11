import "./globals.css";

import React from "react";

import AuthButton from "@/components/auth/auth-button";
import Greeting from "@/components/greeting";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import Navigation from "@/components/navigation/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frugalistic",
  description: "Financial overview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-black bg-white dark:bg-background dark:text-white">
        <div className="w-full">
          <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
              <div>
                <Navigation />
                <MobileNavigation />
              </div>
              <div className="flex items-center justify-end">
                <div className="hidden md:flex">
                  <Greeting />
                </div>
                <AuthButton />
              </div>
            </div>
          </header>
          <main className="m-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
