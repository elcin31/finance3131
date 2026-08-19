import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopNav } from "@/components/dashboard/TopNav";
import { BottomNav } from "@/components/dashboard/BottomNav";

export const metadata: Metadata = {
  title: "Meridian Research — Investment Research & Risk Platform",
  description:
    "Analyze the business, value the business, measure the risk, size the position.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1523",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50 font-sans text-ink-900 antialiased">
        <TopNav />
        <main className="mx-auto max-w-7xl px-3 pb-20 pt-3 sm:px-6 sm:pb-10 sm:pt-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
