import "./globals.css";

import React from "react";

import { Navigation } from "@/app/navigation";

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
          <Navigation />
          <main className="m-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
