import { VerifiedResource, VerificationStatus } from "@/types";
import { getResourceProvider, ResourceProvider } from "@/services/resources/resourceProvider";

export type VerificationLifecycleStage =
  | "DISCOVERY"
  | "OFFICIAL_VERIFICATION"
  | "HUMAN_REVIEW"
  | "AVAILABILITY_CHECK"
  | "SCHEDULED_RE_VERIFICATION"
  | "USER_FEEDBACK"
  | "SECONDARY_HUMAN_REVIEW"
  | "UPDATE_OR_REMOVE";

export interface VerificationAuditRecord {
  id: string;
  resourceId: string;
  resourceName: string;
  stage: VerificationLifecycleStage;
  verifiedBy: string;
  verifierRole: string;
  checkType: string;
  findings: string;
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  timestamp: string;
  nextReviewDate: string;
}

export interface IResourceVerificationService {
  verifyResource(
    resourceId: string,
    params: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewMonths?: number;
    }
  ): Promise<VerifiedResource | null>;
  getAuditLog(resourceId?: string): Promise<VerificationAuditRecord[]>;
  getPendingQueues(): Promise<{
    expired: VerifiedResource[];
    upcomingReview: VerifiedResource[];
    pendingReview: VerifiedResource[];
  }>;
}

/**
 * DemoVerificationAdapter / ResourceVerificationEngine
 * Manages the 8-stage verification lifecycle for resource truth preservation.
 */
export class ResourceVerificationService implements IResourceVerificationService {
  private auditLogs: VerificationAuditRecord[] = [];
  private provider: ResourceProvider;

  constructor(provider?: ResourceProvider) {
    this.provider = provider || getResourceProvider();
  }

  async verifyResource(
    resourceId: string,
    params: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewMonths?: number;
    }
  ): Promise<VerifiedResource | null> {
    const months = params.nextReviewMonths || 3;
    const nextReviewDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();

    const existing = await this.provider.getResourceById(resourceId);
    const previousStatus = existing ? existing.verificationStatus : "PENDING_REVIEW";

    const updated = await this.provider.verifyResource(resourceId, {
      verifiedBy: params.verifiedBy,
      verifierRole: params.verifierRole,
      checkType: params.checkType,
      findings: params.findings,
      newStatus: params.newStatus,
      nextReviewDate,
    });

    if (updated) {
      const record: VerificationAuditRecord = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        resourceId,
        resourceName: updated.name,
        stage: "SCHEDULED_RE_VERIFICATION",
        verifiedBy: params.verifiedBy,
        verifierRole: params.verifierRole,
        checkType: params.checkType,
        findings: params.findings,
        previousStatus,
        newStatus: params.newStatus,
        timestamp: new Date().toISOString(),
        nextReviewDate,
      };
      this.auditLogs.unshift(record);
    }

    return updated;
  }

  async getAuditLog(resourceId?: string): Promise<VerificationAuditRecord[]> {
    if (resourceId) {
      return this.auditLogs.filter((l) => l.resourceId === resourceId);
    }
    return [...this.auditLogs];
  }

  async getPendingQueues(): Promise<{
    expired: VerifiedResource[];
    upcomingReview: VerifiedResource[];
    pendingReview: VerifiedResource[];
  }> {
    const allResources = await this.provider.getResources({ includeDemo: true });
    const now = Date.now();
    const fifteenDaysFromNow = now + 15 * 24 * 60 * 60 * 1000;

    const expired = allResources.filter(
      (r) => new Date(r.nextReview).getTime() < now || r.verificationStatus === "EXPIRED"
    );

    const upcomingReview = allResources.filter(
      (r) =>
        new Date(r.nextReview).getTime() >= now &&
        new Date(r.nextReview).getTime() <= fifteenDaysFromNow &&
        r.verificationStatus === "VERIFIED"
    );

    const pendingReview = allResources.filter(
      (r) => r.verificationStatus === "PENDING_REVIEW" || r.verificationStatus === "NEEDS_UPDATE"
    );

    return { expired, upcomingReview, pendingReview };
  }
}

let verificationServiceInstance: IResourceVerificationService | null = null;

export function getResourceVerificationService(): IResourceVerificationService {
  if (!verificationServiceInstance) {
    verificationServiceInstance = new ResourceVerificationService();
  }
  return verificationServiceInstance;
}
