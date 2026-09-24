"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Database,
  CheckCircle2,
  BookOpen,
  MessageSquareWarning,
  ScrollText,
  Lock,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/lib/admin/adminStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

function AdminAuthWall({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login, logout, feedbackQueue, resources } = useAdmin();
  const [keyInput, setKeyInput] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const pathname = usePathname();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(keyInput);
    if (!ok) {
      setErrorMsg("Invalid Administrator Key. Please enter the authorized verification key.");
    } else {
      setErrorMsg("");
      setKeyInput("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-lg shadow-teal-950/50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              SecuTrail Admin Console
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Resource Verification Engine & Statutory Grounding Dashboard
            </p>
          </div>

          <Card className="bg-slate-800/90 border-slate-700 shadow-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Verification Master Key
                  </label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter verification master key..."
                      value={keyInput}
                      onChange={(e) => {
                        setKeyInput(e.target.value);
                        setErrorMsg("");
                      }}
                      className="bg-slate-900/80 border-slate-700 text-slate-100 placeholder:text-slate-500 pr-10 focus:border-teal-500"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-rose-400 mt-2 font-medium">
                      {errorMsg}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Demo key: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-teal-300 border border-slate-700">secutrail-admin-demo-key-2026</code>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 shadow-md shadow-teal-950/40"
                >
                  Access Verification Engine
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-700/60 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Tamper-evident SHA-256 verification logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Strict zero-hallucination statutory verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Expired resource automated blacklisting</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Count pending reviews & open feedback
  const pendingCount = resources.filter(
    (r) => r.verificationStatus === "PENDING_REVIEW" || r.verificationStatus === "NEEDS_UPDATE" || new Date(r.nextReview) < new Date()
  ).length;
  const openFeedbackCount = feedbackQueue.filter((f) => f.status === "OPEN").length;

  const navLinks = [
    { href: "/admin", label: "Overview & Lifecycle", icon: ShieldCheck },
    { href: "/admin/resources", label: "Resource Directory", icon: Database, badge: resources.length },
    { href: "/admin/verification", label: "Verification Queue", icon: CheckCircle2, badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: "bg-amber-500" },
    { href: "/admin/sources", label: "Knowledge Sources", icon: BookOpen },
    { href: "/admin/feedback", label: "User Feedback", icon: MessageSquareWarning, badge: openFeedbackCount > 0 ? openFeedbackCount : undefined, badgeColor: "bg-rose-500" },
    { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight">SECUTRAIL</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-medium">
                  VERIFICATION ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Resource Truth & Statutory Grounding Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/80 transition-colors"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">AUDITOR ACCESS</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 hover:bg-rose-950/20"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Sub-Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-slate-950 ${
                        link.badgeColor || "bg-teal-400"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminAuthWall>{children}</AdminAuthWall>
    </AdminProvider>
  );
}
