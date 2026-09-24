import * as React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  status: string; // "VERIFIED" | "PENDING_REVIEW" | "NEEDS_UPDATE" | "EXPIRED"
  tier?: string; // "TIER_1_OFFICIAL_GOVERNMENT" | "TIER_2_VETTED_NGO" | "TIER_3_COMMUNITY_VERIFIED"
  isDemo?: boolean;
  className?: string;
  showTier?: boolean;
  nextReview?: string | Date;
}

export function VerificationBadge({
  status,
  tier,
  isDemo = false,
  className,
  showTier = true,
  nextReview,
}: VerificationBadgeProps) {
  if (isDemo) {
    return (
      <Badge variant="demo" className={cn("gap-1 font-bold", className)}>
        <HelpCircle className="h-3 w-3" />
        DEMO DATA
      </Badge>
    );
  }

  const getTierLabel = (t?: string) => {
    switch (t) {
      case "TIER_1_OFFICIAL_GOVERNMENT":
        return "Govt Verified";
      case "TIER_2_VETTED_NGO":
        return "Vetted NGO";
      case "TIER_3_COMMUNITY_VERIFIED":
        return "Community Verified";
      default:
        return "Verified";
    }
  };

  const isExpired = nextReview ? new Date(nextReview) < new Date() : false;
  if (isExpired || status === "EXPIRED") {
    return (
      <Badge variant="destructive" className={cn("gap-1 bg-rose-500/20 text-rose-300 border-rose-500/30", className)}>
        <AlertTriangle className="h-3 w-3 text-rose-500" />
        <span>Expired Review</span>
      </Badge>
    );
  }

  if (status === "VERIFIED") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <Badge variant="verified" className="gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span>✓ Verified</span>
        </Badge>
        {showTier && tier && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {getTierLabel(tier)}
          </span>
        )}
      </div>
    );
  }

  if (status === "PENDING_REVIEW") {
    return (
      <Badge variant="warning" className={cn("gap-1", className)}>
        <Clock className="h-3 w-3 text-orange-600" />
        Pending Review
      </Badge>
    );
  }

  if (status === "NEEDS_UPDATE" || status === "EXPIRED") {
    return (
      <Badge variant="destructive" className={cn("gap-1", className)}>
        <AlertTriangle className="h-3 w-3" />
        Needs Verification
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn("gap-1 text-slate-600", className)}>
      <ShieldCheck className="h-3 w-3" />
      Unverified
    </Badge>
  );
}
