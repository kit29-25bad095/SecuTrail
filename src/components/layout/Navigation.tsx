"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  BookOpen,
  HeartHandshake,
  Database,
  Lock,
  Menu,
  X,
  ArrowUpRight,
  Workflow,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickExit } from "@/components/safety/QuickExit";
import { Button } from "@/components/ui/Button";

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isHome = pathname === "/";

  const navLinks = [
    {
      href: isHome ? "#about" : "/#about",
      label: "About",
      icon: Info,
      desc: "Who SecuTrail is for",
    },
    {
      href: isHome ? "#how-it-works" : "/#how-it-works",
      label: "How It Works",
      icon: Workflow,
      desc: "7-step verified architecture",
    },
    {
      href: "/awareness",
      label: "Awareness",
      icon: BookOpen,
      desc: "Prevention & Education",
    },
    {
      href: "/resources",
      label: "Resources",
      icon: Database,
      desc: "Verified Shelters & Helplines",
    },
    {
      href: "/privacy",
      label: "Privacy",
      icon: Lock,
      desc: "Zero-Trace Guarantees",
    },
  ];

  // Close mobile drawer on ESC or route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100 text-lg">
                SecuTrail
              </span>
              <span className="rounded bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Verified Information • Private Support • Your Choice
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center space-x-1 lg:space-x-1.5"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href.startsWith("/") &&
              !link.href.includes("#") &&
              pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs lg:text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent "Get Support" CTA */}
          <Link href="/survivor" className="hidden sm:inline-flex">
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <HeartHandshake className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
              <span>Get Support</span>
            </Button>
          </Link>

          {/* Quick Exit always accessible on desktop */}
          <div className="hidden sm:block">
            <QuickExit size="sm" />
          </div>

          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border/70 hover:bg-muted transition-colors"
          >
            <span>Admin</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden border-b bg-background px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          {/* Mobile Quick Exit Banner */}
          <div className="pb-3 border-b mb-2">
            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Quick Safety Exit
                </span>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80">
                  Redirects instantly to weather · ESC × 2
                </span>
              </div>
              <QuickExit size="sm" />
            </div>
          </div>

          {/* Primary Mobile Action */}
          <div className="pb-2">
            <Link
              href="/survivor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-block"
            >
              <Button
                variant="default"
                size="lg"
                className="w-full justify-center gap-2 bg-slate-900 text-white font-bold dark:bg-slate-100 dark:text-slate-900"
              >
                <HeartHandshake className="h-5 w-5 text-emerald-400" />
                <span>Get Support (Survivor Track)</span>
              </Button>
            </Link>
          </div>

          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href.startsWith("/") &&
                !link.href.includes("#") &&
                pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{link.label}</div>
                      <div className="text-[11px] text-muted-foreground">{link.desc}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <span>Staff &amp; Admin Verification Portal</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
