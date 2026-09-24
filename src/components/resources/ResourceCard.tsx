import * as React from "react";
import { Phone, Globe, MapPin, Clock, ExternalLink, Flag, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { VerificationBadge } from "./VerificationBadge";
import { formatDate } from "@/lib/utils";

export interface ResourceItem {
  id: string;
  name: string;
  serviceType: string;
  description?: string | null;
  address?: string | null;
  state?: string | null;
  district?: string | null;
  contact: string;
  secondaryContact?: string | null;
  website?: string | null;
  operatingHours: string;
  is24x7: boolean;
  availability: string;
  verificationStatus: string;
  authorityLevel: string;
  lastVerified: string | Date;
  sourceOrganization?: string | null;
  isDemo?: boolean;
}

interface ResourceCardProps {
  resource: ResourceItem;
  onReportIssue?: (resourceId: string, resourceName: string) => void;
  className?: string;
}

export function ResourceCard({
  resource,
  onReportIssue,
  className,
}: ResourceCardProps) {
  const formatServiceType = (st: string) => {
    return st.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md border-border/80 ${className || ""}`}>
      {resource.isDemo && (
        <div className="bg-amber-100 dark:bg-amber-950/80 px-4 py-1 text-center text-xs font-bold text-amber-900 dark:text-amber-200 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
          <span>DEMO DATA — For system evaluation and prototype testing only</span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {formatServiceType(resource.serviceType)}
              </span>
              <VerificationBadge
                status={resource.verificationStatus}
                tier={resource.authorityLevel}
                isDemo={resource.isDemo}
              />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {resource.name}
            </CardTitle>
          </div>
        </div>

        {resource.sourceOrganization && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Source: <span className="font-medium text-slate-700 dark:text-slate-300">{resource.sourceOrganization}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {resource.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Location & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
          {(resource.district || resource.state || resource.address) && (
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {resource.address ? `${resource.address}, ` : ""}
                {[resource.district, resource.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          <div className="flex items-start gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className={resource.is24x7 ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>
              {resource.is24x7 ? "24/7 Crisis Support" : resource.operatingHours}
            </span>
          </div>
        </div>

        {/* Verification audit timestamp */}
        <div className="rounded-md bg-slate-50 dark:bg-slate-900/60 p-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Last Verified: {formatDate(resource.lastVerified)}</span>
          <span className="text-[10px] text-slate-400">Strict Verification Protocol</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${resource.contact.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            aria-label={`Call ${resource.name} at ${resource.contact}`}
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call {resource.contact}</span>
          </a>

          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-accent transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span>Website</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          )}
        </div>

        {onReportIssue && (
          <button
            type="button"
            onClick={() => onReportIssue(resource.id, resource.name)}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
            title="Report inaccurate phone number or address"
          >
            <Flag className="h-3 w-3" />
            <span>Report Info</span>
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
