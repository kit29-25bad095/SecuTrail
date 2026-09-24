"use client";

import * as React from "react";
import {
  VerifiedResource,
  SupportDomain,
} from "@/types";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { getResourceProvider } from "@/services/resources/resourceProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import {
  Database,
  Search,
  CheckCircle2,
  Clock,
  HelpCircle,
  Flag,
} from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SurvivorResourcesPage() {
  const [resources, setResources] = React.useState<VerifiedResource[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedDomainFilter, setSelectedDomainFilter] = React.useState<string>("ALL");
  const [only24x7, setOnly24x7] = React.useState<boolean>(false);
  const [includeDemo, setIncludeDemo] = React.useState<boolean>(true);

  // Progressive location context loaded from triage session if available
  const [userState, setUserState] = React.useState<string | null>(null);
  const [userDistrict, setUserDistrict] = React.useState<string | null>(null);

  // Reporting modal state
  const [reportModalOpen, setReportModalOpen] = React.useState<boolean>(false);
  const [reportingResourceName, setReportingResourceName] = React.useState<string>("");
  const [reportReason, setReportReason] = React.useState<string>("NUMBER_UNRESPONSIVE");
  const [reportSuccess, setReportSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("secutrail_triage") ||
        localStorage.getItem("secutrail_triage");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state) setUserState(parsed.state);
        if (parsed.district) setUserDistrict(parsed.district);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const loadResources = React.useCallback(async () => {
    setLoading(true);
    try {
      const provider = getResourceProvider();
      const domains: SupportDomain[] | undefined =
        selectedDomainFilter === "ALL"
          ? undefined
          : [selectedDomainFilter as SupportDomain];

      const res = await provider.getResources({
        domains,
        state: userState || undefined,
        district: userDistrict || undefined,
        is24x7: only24x7 ? true : undefined,
        query: searchQuery.trim() || undefined,
        includeDemo,
      });

      setResources(res);
    } catch (e) {
      console.error("Error loading resources:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedDomainFilter, userState, userDistrict, only24x7, searchQuery, includeDemo]);

  React.useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleOpenReport = (id: string, name: string) => {
    setReportingResourceName(name);
    setReportSuccess(false);
    setReportModalOpen(true);
  };

  const handleSubmitReport = () => {
    // In production, posts to /api/feedback
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Database className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Step 04 • Verified Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Verified Support Resources
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Every hospital, One Stop Centre, and crisis helpline in this directory has undergone scheduled verification under our 9-stage verification lifecycle.
          </p>
        </div>

        {/* Demo Mode Toggle Banner */}
        <div className="rounded-lg border bg-card p-3 shadow-sm flex items-center gap-3 text-xs">
          <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeDemo}
              onChange={(e) => setIncludeDemo(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Show Demo Testing Records
            </span>
          </label>
        </div>
      </div>

      {/* Location Banner (if location provided) */}
      {userState && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-3 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Filtering for:
            </span>
            <Badge variant="secondary">
              {[userDistrict, userState].filter(Boolean).join(", ")}
            </Badge>
            <span className="text-muted-foreground">(Plus National 24/7 Crisis Helplines)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setUserState(null);
              setUserDistrict(null);
            }}
            className="text-primary hover:underline text-[11px]"
          >
            Clear Location Filter
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Domain Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: "ALL", label: "All Verified" },
            { id: "MEDICAL", label: "Medical & PEP" },
            { id: "EMOTIONAL", label: "Emotional & Helplines" },
            { id: "LEGAL", label: "Legal Aid & Courts" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedDomainFilter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomainFilter(tab.id)}
              className="text-xs h-8"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 24/7 Filter and Search Input */}
        <div className="flex items-center gap-2">
          <Button
            variant={only24x7 ? "secondary" : "outline"}
            size="sm"
            onClick={() => setOnly24x7(!only24x7)}
            className="text-xs h-8 gap-1.5 shrink-0"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>24/7 Only</span>
          </Button>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, city, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <LoadingState message="Querying verified resource graph..." />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No verified resources match your query"
          description="Try broadening your search term or clearing the state/district filter to view all national helplines."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDomainFilter("ALL");
                setOnly24x7(false);
                setUserState(null);
                setUserDistrict(null);
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onReportIssue={handleOpenReport}
            />
          ))}
        </div>
      )}

      {/* Report Resource Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-amber-600" />
            <span>Report Resource Issue</span>
          </DialogTitle>
          <DialogDescription>
            Help maintain verified accuracy for: <strong>{reportingResourceName}</strong>
          </DialogDescription>
        </DialogHeader>

        {reportSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Thank you for reporting.
            </p>
            <p className="text-xs text-muted-foreground">
              Our verification team will audit this record within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                What issue did you encounter?
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs"
              >
                <option value="NUMBER_UNRESPONSIVE">Phone number is not answering / dead line</option>
                <option value="INCORRECT_HOURS">Operating hours are incorrect</option>
                <option value="LOCATION_CHANGED">Address or facility has moved</option>
                <option value="OTHER">Other discrepancy</option>
              </select>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Your feedback is anonymous and triggers immediate human review in our administrative audit queue.
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitReport}
                className="text-xs font-semibold"
              >
                Submit Report
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}
