import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { LogoMark } from "@/components/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LevelUp English Assessment",
    template: "%s · LevelUp English Assessment",
  },
  description:
    "A CEFR-aligned English proficiency assessment. Find out your level from A1 to C2 in about 20 minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <header className="border-b border-line bg-surface/80 backdrop-blur print:border-none">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-brand">
              <LogoMark className="size-8" />
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight">LevelUp</span>
                <span className="text-xs text-ink-subtle">English Assessment</span>
              </span>
            </Link>
            <span className="hidden rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted sm:inline-block print:hidden">
              CEFR scale · A1 to C2
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>

        <footer className="border-t border-line print:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>LevelUp English Assessment</span>
            <span>Results are mapped to the Common European Framework of Reference (CEFR).</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
