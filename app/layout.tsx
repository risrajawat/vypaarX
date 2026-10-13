import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VyparX | Digital Growth Platform for Local & Small Businesses",
  description:
    "We help good local businesses get discovered, trusted, and chosen online. Grow Local. Go Further.",
  keywords: [
    "local business digital growth",
    "local business website",
    "local SEO",
    "small business digital transformation",
    "digital presence",
    "business growth",
    "online presence",
    "global business expansion",
  ],
  openGraph: {
    title: "VyparX — Grow Local. Go Further.",
    description: "The complete digital growth acceleration platform for local and small businesses.",
    type: "website",
    locale: "en_IN",
    siteName: "VyparX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
