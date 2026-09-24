"use client";

import * as React from "react";
import {
  BookOpen,
  ExternalLink,
  Scale,
  CheckCircle2,
  Search,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/adminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function AdminSourcesPage() {
  const { sources } = useAdmin();
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <span>Statutory Knowledge Sources & Authorities</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative legal statutes, medical protocol manuals, and government guidelines
            grounding SecuTrail&apos;s Verified RAG engine.
          </p>
        </div>

        <Badge variant="outline" className="text-teal-400 border-teal-500/30 text-xs w-fit">
          Zero-Hallucination Grounding
        </Badge>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Scale className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold block mb-0.5">
            Strict Retrieval-Grounded Architecture
          </strong>
          SecuTrail answers queries regarding rights, Zero FIRs, medical forensic protocols,
          and emergency contacts strictly from these vetted sources. If a user query cannot be
          grounded with high confidence in these sources, the system explicitly reports that it
          could not verify the information.
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        <Input
          placeholder="Filter sources by statute, ministry, authority, or jurisdiction..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500"
        />
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source) => (
          <Card key={source.id} className="bg-slate-900/90 border-slate-800 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] text-teal-300 border-teal-500/30">
                    {source.jurisdiction}
                  </Badge>
                  <CardTitle className="text-base font-bold text-white leading-snug">
                    {source.title}
                  </CardTitle>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {source.verificationStatus}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Issuing Organization:</span>
                  <span className="text-slate-200 font-medium">{source.organization}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Statutory Authority:</span>
                  <span className="text-slate-200 font-medium">{source.authority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Publication Year / Version:</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {source.publicationYear} (v{source.contentVersion})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Last Verified:</span>
                  <span className="text-slate-200 font-mono">{formatDate(source.lastVerified)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Next Scheduled Review:</span>
                  <span className="text-teal-300 font-mono font-medium">{formatDate(source.nextReview)}</span>
                </div>
              </div>

              {source.url && (
                <div className="pt-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-medium text-xs"
                  >
                    <span>View Official Government Publication / Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
