"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  MessageSquareWarning,
  ScrollText,
  RefreshCw,
  FileCheck,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/adminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { resources, sources, feedbackQueue, auditLogs } = useAdmin();

  // Lifecycle stage stats
  const totalResources = resources.length;
  const verifiedCount = resources.filter(
    (r) => r.verificationStatus === "VERIFIED" && new Date(r.nextReview) >= new Date()
  ).length;
  const pendingCount = resources.filter(
    (r) => r.verificationStatus === "PENDING_REVIEW"
  ).length;
  const needsUpdateCount = resources.filter(
    (r) => r.verificationStatus === "NEEDS_UPDATE"
  ).length;
  const expiredCount = resources.filter(
    (r) => r.verificationStatus === "EXPIRED" || new Date(r.nextReview) < new Date()
  ).length;
  const openFeedbackCount = feedbackQueue.filter((f) => f.status === "OPEN").length;

  const lifecycleStages = [
    {
      num: 1,
      name: "Discovery",
      desc: "Statutory gazettes, MoWCD registers, nodal state listings",
      badge: "Ingestion",
      icon: Database,
    },
    {
      num: 2,
      name: "Official Verification",
      desc: "Cross-referenced against official gazettes & statutory mandates",
      badge: "Tier 1-3 Vetted",
      icon: FileCheck,
    },
    {
      num: 3,
      name: "Human Review",
      desc: "Verification auditor inspects service scope, security & privacy",
      badge: "Auditor Sign-off",
      icon: UserCheck,
    },
    {
      num: 4,
      name: "Availability Check",
      desc: "Active line testing, response time validation, operating hours",
      badge: "Live Tested",
      icon: PhoneCall,
    },
    {
      num: 5,
      name: "Scheduled Re-Verification",
      desc: "90-day strict review cadence. Unverified past deadline is auto-expired",
      badge: "90-Day Cadence",
      icon: Clock,
    },
    {
      num: 6,
      name: "User Feedback",
      desc: "Community alerts on altered contacts, shifted facilities, or delays",
      badge: "Closed Loop",
      icon: MessageSquareWarning,
    },
    {
      num: 7,
      name: "Human Review",
      desc: "Secondary auditor triage of reported discrepancies & field reports",
      badge: "Re-assessment",
      icon: UserCheck,
    },
    {
      num: 8,
      name: "Update / Remove",
      desc: "Immediate data refresh or withdrawal from verified recommendation graph",
      badge: "Zero Hallucination",
      icon: RefreshCw,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STRICT TRUTH & ZERO HALLUCINATION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Resource Verification & Statutory Truth Engine
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Every emergency resource, helpline, medical centre, and legal authority displayed
              to survivors must pass through SecuTrail&apos;s continuous 8-stage verification lifecycle.
              Expired or unverified data is strictly suppressed from verified recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/verification">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Review Verification Queue ({pendingCount + needsUpdateCount + expiredCount})
              </Button>
            </Link>
            <Link href="/admin/resources">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                <Database className="w-4 h-4 mr-1.5" />
                Manage Directory ({totalResources})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <span className="text-xs text-slate-400 font-medium">Total Resources</span>
            <div className="text-2xl font-bold text-white mt-1">{totalResources}</div>
            <span className="text-[11px] text-slate-500">In directory</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-emerald-900/40">
          <CardContent className="p-4">
            <span className="text-xs text-emerald-400 font-medium">Active & Verified</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{verifiedCount}</div>
            <span className="text-[11px] text-emerald-600">Within review window</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-amber-900/40">
          <CardContent className="p-4">
            <span className="text-xs text-amber-400 font-medium">Pending Review</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
            <span className="text-[11px] text-amber-600">Awaiting auditor check</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-rose-900/40">
          <CardContent className="p-4">
            <span className="text-xs text-rose-400 font-medium">Needs Update / Expired</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{needsUpdateCount + expiredCount}</div>
            <span className="text-[11px] text-rose-600">Hidden from survivors</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <span className="text-xs text-indigo-400 font-medium">Grounded Sources</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{sources.length}</div>
            <span className="text-[11px] text-slate-500">Acts, Guidelines, Schemes</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4">
            <span className="text-xs text-sky-400 font-medium">Community Reports</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">{openFeedbackCount}</div>
            <span className="text-[11px] text-slate-500">Open feedback tickets</span>
          </CardContent>
        </Card>
      </div>

      {/* 8-Stage Lifecycle Visualization */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-teal-400" />
                <span>The 8-Stage Resource Verification Lifecycle</span>
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Rigorous pipeline ensuring no survivor is ever directed to an obsolete, disconnected, or unverified service.
              </p>
            </div>
            <Badge variant="outline" className="text-xs text-teal-400 border-teal-500/30 w-fit">
              Active Lifecycle Protocol
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleStages.map((stage) => {
              const StageIcon = stage.icon;
              return (
                <div
                  key={stage.num}
                  className="relative p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs font-bold flex items-center justify-center">
                        0{stage.num}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {stage.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <StageIcon className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{stage.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Stage {stage.num} of 8</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Overview Section: Verification Queue Preview & Recent Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue Preview */}
        <Card className="bg-slate-900/70 border-slate-800 flex flex-col">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Items Needing Auditor Attention</span>
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resources flagged for scheduled re-test, review, or status expiry
                </p>
              </div>
              <Link href="/admin/verification">
                <Button variant="ghost" size="sm" className="text-xs text-teal-400 hover:text-teal-300">
                  View All ({pendingCount + needsUpdateCount + expiredCount})
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 flex-1">
            {resources
              .filter(
                (r) =>
                  r.verificationStatus !== "VERIFIED" ||
                  new Date(r.nextReview) < new Date()
              )
              .slice(0, 4)
              .map((res) => {
                const isExpired = new Date(res.nextReview) < new Date();
                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">
                          {res.name}
                        </span>
                        {isExpired && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded font-medium shrink-0">
                            EXPIRED REVIEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>{res.serviceType.replace(/_/g, " ")}</span>
                        <span>•</span>
                        <span>{res.geographicScope}</span>
                        <span>•</span>
                        <span>Contact: {res.contact}</span>
                      </div>
                    </div>
                    <Link href={`/admin/verification?id=${res.id}`}>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white text-xs shrink-0">
                        Audit Now
                      </Button>
                    </Link>
                  </div>
                );
              })}

            {resources.filter(
              (r) =>
                r.verificationStatus !== "VERIFIED" ||
                new Date(r.nextReview) < new Date()
            ).length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                All resources are currently active, verified, and within review dates.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Log Stream */}
        <Card className="bg-slate-900/70 border-slate-800 flex flex-col">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-teal-400" />
                  <span>Tamper-Evident Verification Stream</span>
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cryptographic verification trail recorded on every human review
                </p>
              </div>
              <Link href="/admin/audit">
                <Button variant="ghost" size="sm" className="text-xs text-teal-400 hover:text-teal-300">
                  Full Audit Log
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 flex-1">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal-300">{log.action}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-white font-medium truncate">{log.resourceName}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>By: {log.actor}</span>
                  {log.hash && <span>Hash: {log.hash}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
