"use client";

import * as React from "react";
import { GraduationCap, School, Users, UserCheck, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

export type TargetAudience = "students" | "educators" | "parents" | "bystanders" | "supporters";

export const AUDIENCE_CONFIG: Record<
  TargetAudience,
  { label: string; icon: React.ElementType; color: string }
> = {
  students: {
    label: "Students",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
  },
  educators: {
    label: "Educators & Faculty",
    icon: School,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900",
  },
  parents: {
    label: "Parents & Families",
    icon: Users,
    color: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  },
  bystanders: {
    label: "Bystanders & Allies",
    icon: UserCheck,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
  },
  supporters: {
    label: "Friends & Supporters",
    icon: HeartHandshake,
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900",
  },
};

interface AudiencePillsProps {
  audiences: TargetAudience[];
  activeAudience?: TargetAudience | "all";
  onSelectAudience?: (audience: TargetAudience | "all") => void;
  className?: string;
  isFilter?: boolean;
}

export function AudiencePills({
  audiences,
  activeAudience,
  onSelectAudience,
  className,
  isFilter = false,
}: AudiencePillsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {isFilter && onSelectAudience && (
        <button
          type="button"
          onClick={() => onSelectAudience("all")}
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
            activeAudience === "all"
              ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          )}
        >
          All Audiences
        </button>
      )}

      {audiences.map((aud) => {
        const item = AUDIENCE_CONFIG[aud];
        const Icon = item.icon;
        const isSelected = activeAudience === aud;

        if (isFilter && onSelectAudience) {
          return (
            <button
              key={aud}
              type="button"
              onClick={() => onSelectAudience(aud)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : cn(item.color, "hover:opacity-90")
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        }

        return (
          <span
            key={aud}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
              item.color
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
