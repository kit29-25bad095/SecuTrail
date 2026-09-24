"use client";

import * as React from "react";
import {
  ScrollText,
  Search,
  Lock,
  Hash,
  Clock,
  User,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/adminStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function AdminAuditPage() {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      log.action.toLowerCase().includes(term) ||
      log.resourceName.toLowerCase().includes(term) ||
      log.actor.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      (log.hash && log.hash.toLowerCase().includes(term));

    const matchesAction = actionFilter === "ALL" || log.action.includes(actionFilter);

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-teal-400" />
            <span>Tamper-Evident Verification Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all statutory verifications, availability tests, resource updates, and feedback resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-teal-400 border-teal-500/30 text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Cryptographic Integrity Active
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <Input
              placeholder="Search by action, resource, auditor name, details, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950/80 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Actions</option>
            <option value="VERIFICATION">Official Verifications</option>
            <option value="AVAILABILITY">Availability Checks</option>
            <option value="FEEDBACK">Feedback Resolutions</option>
            <option value="RESOURCE">Resource Edits</option>
          </select>
        </CardContent>
      </Card>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all">
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-teal-400 font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded text-[11px]">
                    {log.action}
                  </span>
                  <span className="font-bold text-white text-sm">{log.resourceName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatDate(log.timestamp)}
                  </span>
                  {log.hash && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Hash className="w-3 h-3 text-teal-500" />
                      {log.hash}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-300 pt-1 leading-relaxed">{log.details}</p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <User className="w-3 h-3 text-teal-500" />
                  Auditor: <strong className="text-slate-300 font-normal">{log.actor}</strong>
                </span>
                <span className="text-slate-600">ID: {log.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <ScrollText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No Audit Entries Found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
