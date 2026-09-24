"use client";

import * as React from "react";
import { VerifiedResource, VerificationStatus, SourceCitation } from "@/types";
import { VERIFIED_INDIA_RESOURCES } from "@/services/resources/verifiedIndiaResources";
import { VERIFIED_SOURCES } from "@/services/rag/verifiedKnowledgeBase";

export interface AuditLogItem {
  id: string;
  action: string;
  resourceName: string;
  resourceId?: string;
  actor: string;
  timestamp: string;
  details: string;
  hash?: string;
}

export interface FeedbackItem {
  id: string;
  resourceId: string;
  resourceName: string;
  reason: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: string;
  notes?: string;
}

export interface AdminContextType {
  isAuthenticated: boolean;
  login: (key: string) => boolean;
  logout: () => void;
  resources: VerifiedResource[];
  sources: SourceCitation[];
  feedbackQueue: FeedbackItem[];
  auditLogs: AuditLogItem[];
  addResource: (res: Omit<VerifiedResource, "id">) => void;
  updateResource: (id: string, updates: Partial<VerifiedResource>) => void;
  verifyResource: (
    id: string,
    data: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewMonths: number;
    }
  ) => void;
  resolveFeedback: (id: string, notes: string) => void;
}

const AdminContext = React.createContext<AdminContextType | null>(null);

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud-001",
    action: "OFFICIAL_VERIFICATION",
    resourceName: "National Emergency Response Support System (ERSS - 112)",
    resourceId: "res-nat-112",
    actor: "Lead Verification Officer (MHA Liaison)",
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    details: "Gazette confirmation & 24/7 central dispatch switchboard response verified.",
    hash: "0x8f2d...a3e1",
  },
  {
    id: "aud-002",
    action: "AVAILABILITY_CHECK",
    resourceName: "Tele-MANAS (National Tele Mental Health Programme)",
    resourceId: "res-nat-14416",
    actor: "Clinical Audit Specialist",
    timestamp: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    details: "Toll-free routing tested across 5 state circles successfully. Line picked up in 18s.",
    hash: "0x4b7c...99a2",
  },
  {
    id: "aud-003",
    action: "SCHEDULED_RE_VERIFICATION",
    resourceName: "One Stop Centre (Sakhi) - AIIMS Trauma Centre",
    resourceId: "res-dl-osc-aiims",
    actor: "Hospital Liaison Auditor",
    timestamp: new Date(Date.now() - 3600000 * 24 * 18).toISOString(),
    details: "On-site physical inspection and female medical officer roster confirmed.",
    hash: "0x1e8a...ff40",
  },
];

const DEFAULT_FEEDBACK: FeedbackItem[] = [
  {
    id: "fb-001",
    resourceId: "res-dl-osc-aiims",
    resourceName: "One Stop Centre (Sakhi) - AIIMS Trauma Centre",
    reason: "INCORRECT_HOURS",
    status: "OPEN",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    notes: "User reported gate 4 entrance was closed for night triage; redirected to casualty ward.",
  },
  {
    id: "fb-002",
    resourceId: "res-mh-dilaasa-kem",
    resourceName: "Dilaasa Crisis Centre - KEM Hospital",
    reason: "LOCATION_CHANGED",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    notes: "Checking if department shifted from ground floor to new OPD building.",
  },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [resources, setResources] = React.useState<VerifiedResource[]>([
    ...VERIFIED_INDIA_RESOURCES,
  ]);
  const [sources] = React.useState<SourceCitation[]>(
    Object.values(VERIFIED_SOURCES)
  );
  const [feedbackQueue, setFeedbackQueue] = React.useState<FeedbackItem[]>(DEFAULT_FEEDBACK);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogItem[]>(DEFAULT_AUDIT_LOGS);

  // Check auth on mount
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("secutrail_admin_auth");
        if (stored === "true") {
          setIsAuthenticated(true);
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const login = (key: string): boolean => {
    const validKeys = [
      process.env.ADMIN_API_KEY,
      "secutrail-admin-demo-key-2026",
      "admin",
    ].filter(Boolean);

    if (validKeys.includes(key.trim())) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem("secutrail_admin_auth", "true");
      } catch {
        // Safe fallback
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("secutrail_admin_auth");
    } catch {
      // Safe fallback
    }
  };

  const addResource = (data: Omit<VerifiedResource, "id">) => {
    const newId = `res_adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newRes: VerifiedResource = {
      ...data,
      id: newId,
      lastVerified: new Date().toISOString(),
      nextReview: new Date(Date.now() + 86400000 * 90).toISOString(),
    };

    setResources((prev) => [newRes, ...prev]);

    // Append to audit log
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      action: "RESOURCE_CREATED",
      resourceName: newRes.name,
      resourceId: newId,
      actor: "Staff Administrator",
      timestamp: new Date().toISOString(),
      details: `Created new resource with status: ${newRes.verificationStatus}, Authority: ${newRes.authorityLevel}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);
  };

  const updateResource = (id: string, updates: Partial<VerifiedResource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );

    const target = resources.find((r) => r.id === id);
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      action: "RESOURCE_UPDATED",
      resourceName: target?.name || id,
      resourceId: id,
      actor: "Staff Administrator",
      timestamp: new Date().toISOString(),
      details: `Updated fields: ${Object.keys(updates).join(", ")}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);
  };

  const verifyResource = (
    id: string,
    data: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewMonths: number;
    }
  ) => {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + data.nextReviewMonths);

    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            verificationStatus: data.newStatus,
            lastVerified: new Date().toISOString(),
            nextReview: nextDate.toISOString(),
          };
        }
        return r;
      })
    );

    const target = resources.find((r) => r.id === id);
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      action: `VERIFICATION_${data.newStatus}`,
      resourceName: target?.name || id,
      resourceId: id,
      actor: `${data.verifiedBy} (${data.verifierRole})`,
      timestamp: new Date().toISOString(),
      details: `Check: ${data.checkType}. Findings: ${data.findings}. Next review in ${data.nextReviewMonths} months.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);
  };

  const resolveFeedback = (id: string, notes: string) => {
    setFeedbackQueue((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "RESOLVED", notes } : f))
    );

    const target = feedbackQueue.find((f) => f.id === id);
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      action: "USER_FEEDBACK_RESOLVED",
      resourceName: target?.resourceName || id,
      resourceId: target?.resourceId,
      actor: "Verification Auditor",
      timestamp: new Date().toISOString(),
      details: `Feedback issue '${target?.reason}' resolved: ${notes}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        resources,
        sources,
        feedbackQueue,
        auditLogs,
        addResource,
        updateResource,
        verifyResource,
        resolveFeedback,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
