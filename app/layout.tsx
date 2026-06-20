import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LauncHappy — Rehearse your feature launch",
  description:
    "AI-powered feature launch simulator. Upload a deck or answer a guided brief. LauncHappy simulates how different user personas may react, surfaces risks, and recommends a rollout strategy.",
  keywords: ["product launch", "feature launch", "AI simulator", "launch strategy", "product management"],
  openGraph: {
    title: "LauncHappy — Rehearse your feature launch",
    description: "Simulate launch reception before the market does.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
