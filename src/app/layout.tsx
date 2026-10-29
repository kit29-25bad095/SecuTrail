import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SafetyBar } from "@/components/safety/SafetyBar";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4FF" },
    { media: "(prefers-color-scheme: dark)",  color: "#111827" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "SecuTrail — Verified Information. Private Support. Your Choice.",
    template: "%s · SecuTrail",
  },
  description:
    "A privacy-first, trauma-informed decision-support platform grounded in Indian statutory law. No sign-up required. No data stored.",
  keywords: [
    "survivor support",
    "trauma-informed",
    "privacy",
    "India",
    "BNS 2023",
    "NALSA",
    "legal aid",
    "crisis helpline",
    "sexual assault",
    "zero FIR",
  ],
  robots: {
    index: false,     // Do not index — this is a sensitive support tool
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Synchronous script to prevent Flash of Unstyled Content (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('secutrail_theme');
                  var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (t === 'dark' || (!t && d) || (t === 'system' && d)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider>
          {/* Skip navigation link for keyboard users */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Omnipresent Safety Bar: Quick Exit & Double-ESC */}
          <SafetyBar />

          <Navigation />

          <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
