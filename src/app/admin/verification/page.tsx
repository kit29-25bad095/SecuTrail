"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/adminStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { VerificationBadge } from "@/components/resources/VerificationBadge";
import { formatDate } from "@/lib/utils";
import { VerifiedResource, VerificationStatus } from "@/types";

function VerificationContent() {
  const { resources, verifyResource } = useAdmin();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id");

  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "PENDING" | "NEEDS_UPDATE" | "EXPIRED">("ALL");

  // Audit modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRes, setSelectedRes] = React.useState<VerifiedResource | null>(null);
  const [verifierName, setVerifierName] = React.useState("Maya P");
  const [verifierRole, setVerifierRole] = React.useState("Senior Verification Officer");
  const [checkType, setCheckType] = React.useState("PHONE_CHECK");
  const [findings, setFindings] = React.useState("Direct phone contact established. Line responsive, operating hours and on-duty caseworkers confirmed.");
  const [newStatus, setNewStatus] = React.useState<VerificationStatus>("VERIFIED");
  const [nextReviewMonths, setNextReviewMonths] = React.useState(3);

  // Auto-open modal if query param provided
  React.useEffect(() => {
    if (preselectedId) {
      const match = resources.find((r) => r.id === preselectedId);
      if (match) {
        openAuditModal(match);
      }
    }
  }, [preselectedId, resources]);

  const openAuditModal = (res: VerifiedResource) => {
    setSelectedRes(res);
    setNewStatus(res.verificationStatus === "REJECTED" ? "PENDING_REVIEW" : res.verificationStatus);
    setModalOpen(true);
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;

    verifyResource(selectedRes.id, {
      verifiedBy: verifierName.trim() || "Auditor",
      verifierRole: verifierRole.trim() || "Verification Officer",
      checkType,
      findings: findings.trim(),
      newStatus,
      nextReviewMonths,
    });

    setModalOpen(false);
    setSelectedRes(null);
  };

  // Filter items in verification queue
  const queueItems = resources.filter((res) => {
    const isExpired = new Date(res.nextReview) < new Date();
    if (activeFilter === "PENDING") return res.verificationStatus === "PENDING_REVIEW";
    if (activeFilter === "NEEDS_UPDATE") return res.verificationStatus === "NEEDS_UPDATE";
    if (activeFilter === "EXPIRED") return isExpired || res.verificationStatus === "EXPIRED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-teal-400" />
            <span>Verification Engine & Audit Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct official validations, availability phone tests, and 90-day periodic re-verifications.
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(["ALL", "PENDING", "NEEDS_UPDATE", "EXPIRED"] as const).map((filter) => {
            const count = resources.filter((r) => {
              const isExpired = new Date(r.nextReview) < new Date();
              if (filter === "PENDING") return r.verificationStatus === "PENDING_REVIEW";
              if (filter === "NEEDS_UPDATE") return r.verificationStatus === "NEEDS_UPDATE";
              if (filter === "EXPIRED") return isExpired || r.verificationStatus === "EXPIRED";
              return true;
            }).length;

            return (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={`text-xs ${
                  activeFilter === filter
                    ? "bg-teal-600 text-white"
                    : "border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span>{filter.replace(/_/g, " ")}</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-teal-300">
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Strict Truth Rule Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/20 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-300 font-semibold block mb-0.5">
            Strict Zero-Hallucination & Expired Data Rule
          </strong>
          Any resource with status other than <code className="text-emerald-300">VERIFIED</code> or whose{" "}
          <code className="text-emerald-300">nextReview</code> date has passed is immediately omitted
          from public queries and verified RAG pipelines.
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queueItems.map((res) => {
          const isExpired = new Date(res.nextReview) < new Date();
          return (
            <Card
              key={res.id}
              className={`bg-slate-900 border transition-all ${
                isExpired
                  ? "border-rose-800/80 bg-rose-950/10"
                  : res.verificationStatus === "PENDING_REVIEW"
                  ? "border-amber-800/80 bg-amber-950/10"
                  : "border-slate-800"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{res.name}</h3>
                      <VerificationBadge
                        tier={res.authorityLevel}
                        status={res.verificationStatus}
                        nextReview={res.nextReview}
                      />
                      {isExpired && (
                        <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded">
                          EXPIRED - IMMEDIATE RE-VERIFICATION REQUIRED
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                      <span>Service: <strong className="text-slate-200">{res.serviceType.replace(/_/g, " ")}</strong></span>
                      <span>•</span>
                      <span>Scope: <strong className="text-slate-200">{res.geographicScope}</strong></span>
                      <span>•</span>
                      <span>Contact: <strong className="text-white font-mono">{res.contact}</strong></span>
                      <span>•</span>
                      <span>Last Verified: <strong className="text-slate-200">{formatDate(res.lastVerified)}</strong></span>
                      <span>•</span>
                      <span>Next Review: <strong className={isExpired ? "text-rose-400 font-bold" : "text-slate-200"}>{formatDate(res.nextReview)}</strong></span>
                    </div>

                    {res.sourceOrganization && (
                      <p className="text-xs text-slate-400">
                        Official Source: <span className="text-slate-300 font-medium">{res.sourceOrganization}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      onClick={() => openAuditModal(res)}
                      className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                      Perform Audit & Re-verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {queueItems.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-semibold text-white">Verification Queue Clear</h4>
            <p className="text-xs text-slate-400 mt-1">No resources currently match this filter.</p>
          </div>
        )}
      </div>

      {/* Audit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>Perform Official Resource Audit</span>
          </DialogTitle>
          <DialogDescription>
            {selectedRes ? selectedRes.name : "Resource"}
          </DialogDescription>
        </DialogHeader>

        {selectedRes && (
          <form onSubmit={handleAuditSubmit} className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Resource:</span>
                <span className="text-white font-medium">{selectedRes.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Contact:</span>
                <span className="text-teal-300 font-mono font-medium">{selectedRes.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Operating Hours:</span>
                <span className="text-slate-200">{selectedRes.operatingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authority Tier:</span>
                <span className="text-slate-200">{selectedRes.authorityLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Verification Officer Name *
                </label>
                <Input
                  required
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Verification Role
                </label>
                <Input
                  required
                  value={verifierRole}
                  onChange={(e) => setVerifierRole(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Verification Check Type
                </label>
                <select
                  value={checkType}
                  onChange={(e) => setCheckType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
                >
                  <option value="PHONE_CHECK">Phone Test (Direct Line Call)</option>
                  <option value="ON_SITE_INSPECTION">On-Site Facility Inspection</option>
                  <option value="OFFICIAL_GAZETTE">Official Gazette & Order Cross-Reference</option>
                  <option value="NODAL_OFFICER_CONFIRMATION">Nodal State Officer Confirmation</option>
                  <option value="USER_REPORT_RESOLUTION">User Feedback Resolution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Auditor Decision (Status)
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as VerificationStatus)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white font-semibold"
                >
                  <option value="VERIFIED">VERIFIED (Active & Approved)</option>
                  <option value="PENDING_REVIEW">PENDING REVIEW (More data needed)</option>
                  <option value="NEEDS_UPDATE">NEEDS UPDATE (Issues identified)</option>
                  <option value="EXPIRED">EXPIRED (Deactivated from RAG)</option>
                  <option value="REJECTED">REJECTED (Failed requirements)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Audit Findings & Field Notes *
              </label>
              <textarea
                required
                rows={3}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Document verification steps, response latency, caseworker confirmation..."
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Scheduled Re-Verification Cadence
              </label>
              <select
                value={nextReviewMonths}
                onChange={(e) => setNextReviewMonths(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value={3}>3 Months (Standard 90-Day Cadence)</option>
                <option value={6}>6 Months (Statutory Helplines)</option>
                <option value={1}>1 Month (High Volatility / Temporary Facilities)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
              >
                Sign & Record Verification Audit
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </div>
  );
}

export default function AdminVerificationPage() {
  return (
    <React.Suspense fallback={<div className="text-xs text-slate-400">Loading verification queue...</div>}>
      <VerificationContent />
    </React.Suspense>
  );
}
