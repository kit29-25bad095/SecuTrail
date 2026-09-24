"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquareWarning,
  CheckCircle2,
} from "lucide-react";
import { useAdmin, FeedbackItem } from "@/lib/admin/adminStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/utils";

export default function AdminFeedbackPage() {
  const { feedbackQueue, resolveFeedback } = useAdmin();

  const [selectedTicket, setSelectedTicket] = React.useState<FeedbackItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  const openResolveModal = (ticket: FeedbackItem) => {
    setSelectedTicket(ticket);
    setResolutionNotes("");
    setModalOpen(true);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !resolutionNotes.trim()) return;

    resolveFeedback(selectedTicket.id, resolutionNotes.trim());
    setModalOpen(false);
    setSelectedTicket(null);
  };

  const openTickets = feedbackQueue.filter((f) => f.status !== "RESOLVED");
  const resolvedTickets = feedbackQueue.filter((f) => f.status === "RESOLVED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-400" />
            <span>Community Feedback & Inaccuracy Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stage 6 & 7 of lifecycle: Survivor and field reports flagging inaccurate contacts,
            relocated centres, or altered operating hours.
          </p>
        </div>

        <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-xs w-fit">
          {openTickets.length} Active Reports Needing Review
        </Badge>
      </div>

      {/* Active Reports Queue */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Pending Verification Reports ({openTickets.length})
        </h2>

        {openTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-slate-900 border-amber-800/60 bg-amber-950/10">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {ticket.reason.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Reported: {formatDate(ticket.createdAt)}
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-amber-500/20 text-amber-300">
                      {ticket.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {ticket.resourceName}
                  </h3>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    &ldquo;{ticket.notes}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    onClick={() => openResolveModal(ticket)}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Review & Resolve
                  </Button>
                  {ticket.resourceId && (
                    <Link href={`/admin/verification?id=${ticket.resourceId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                      >
                        Inspect Resource
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {openTickets.length === 0 && (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-semibold text-white">No Open Discrepancy Reports</h4>
            <p className="text-xs text-slate-400 mt-1">All user feedback has been audited and resolved.</p>
          </div>
        )}
      </div>

      {/* Resolved Reports Section */}
      {resolvedTickets.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Resolved Historical Reports ({resolvedTickets.length})
          </h2>

          <div className="space-y-3">
            {resolvedTickets.map((ticket) => (
              <Card key={ticket.id} className="bg-slate-900/60 border-slate-800">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{ticket.resourceName}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                        RESOLVED
                      </span>
                    </div>
                    <p className="text-slate-400">{ticket.notes}</p>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0">
                    {formatDate(ticket.createdAt)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Resolve Feedback & Update Resource</DialogTitle>
          <DialogDescription>
            {selectedTicket ? selectedTicket.resourceName : "Resource Report"}
          </DialogDescription>
        </DialogHeader>

        {selectedTicket && (
          <form onSubmit={handleResolveSubmit} className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block font-semibold">User Reported Issue:</span>
              <p className="text-white italic">{selectedTicket.notes}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Auditor Resolution Notes & Actions Taken *
              </label>
              <textarea
                required
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Explain verification steps taken (e.g. called supervisor, corrected room number, validated night triage door)..."
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
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
                Mark Resolved & Log Audit Entry
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </div>
  );
}
