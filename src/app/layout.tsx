import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";
import AudioToggle from "@/components/AudioToggle";
import CursorGlow from "@/components/CursorGlow";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import RouteProgress from "@/components/RouteProgress";

export const metadata: Metadata = {
  title: "AI Park - MightyLINK 社内AIポータル",
  description: "MightyLINK 社内向けAI活用・エージェント推進ポータルサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <RouteProgress />
        <CursorGlow />
        <ScrollProgress />
        <CommandPalette />
        <KeyboardShortcutsModal />
        <Sidebar />
        <div className="md:pl-72 flex-1 flex flex-col min-h-screen">
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>
        <AudioToggle />
      </body>
    </html>
  );
}
