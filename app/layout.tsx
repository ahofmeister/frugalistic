import "./globals.css";

import { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";

import { Toaster } from "@/components/ui/toaster";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frugalistic",
  description:
    "Take control of your finances · Track expenses, income, and savings · Visualize your financial health · Stay on top of your finances.",
  keywords: [
    "frugal",
    "expense tracker",
    "income tracker",
    "savings",
    "finance management",
    "transactions",
    "recurring payments",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${poppinsFont.className}`}>
      <body className="bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
