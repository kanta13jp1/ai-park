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
import WebMcpBridge from "@/components/WebMcpBridge";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import RouteProgress from "@/components/RouteProgress";

export const metadata: Metadata = {
  title: {
    default: "AI Park - MightyLINK 社内AIポータル",
    template: "%s | AI Park",
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-slate-900 focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
        >
          メインコンテンツへスキップ
        </a>
        <RouteProgress />
        <CursorGlow />
        <ScrollProgress />
        <CommandPalette />
        <WebMcpBridge />
        <KeyboardShortcutsModal />
        <Sidebar />
        <div className="md:pl-72 flex-1 flex flex-col min-h-screen">
          <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
