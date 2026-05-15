import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TIU Prep - Adaptive Learning Platform",
  description: "Master TIU with AI-powered adaptive learning. Track your progress and improve your intelligence test scores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-background text-on-surface min-h-full`}>{children}</body>
    </html>
  );
}
