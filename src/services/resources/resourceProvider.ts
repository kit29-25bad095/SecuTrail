import {
  VerifiedResource,
  SupportDomain,
  VerificationStatus,
} from "@/types";
import { VERIFIED_INDIA_RESOURCES } from "./verifiedIndiaResources";

export interface ResourceFilterOptions {
  domains?: SupportDomain[];
  state?: string;
  district?: string;
  is24x7?: boolean;
  serviceType?: string;
  query?: string;
  includeDemo?: boolean;
  verificationStatus?: VerificationStatus;
}

export interface ResourceProvider {
  getResources(options?: ResourceFilterOptions): Promise<VerifiedResource[]>;
  getResourceById(id: string): Promise<VerifiedResource | null>;
  searchResources(searchTerm: string): Promise<VerifiedResource[]>;
  getStatutoryHelplines(): Promise<VerifiedResource[]>;
  createResource(resource: Omit<VerifiedResource, "id">): Promise<VerifiedResource>;
  updateResource(id: string, updates: Partial<VerifiedResource>): Promise<VerifiedResource | null>;
  verifyResource(
    id: string,
    verification: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewDate: Date | string;
    }
  ): Promise<VerifiedResource | null>;
}

/**
 * DemoResourceProvider manages verified state with authentic India-specific
 * crisis infrastructure and clearly separated demo resources for testing.
 */
export class DemoResourceProvider implements ResourceProvider {
  private resources: VerifiedResource[] = [...VERIFIED_INDIA_RESOURCES];

  async getResources(options?: ResourceFilterOptions): Promise<VerifiedResource[]> {
    let result = [...this.resources];

    if (!options?.includeDemo) {
      // Default: include demo only if explicitly asked or enabled by config
      const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
      if (!enableDemo) {
        result = result.filter((r) => !r.isDemo);
      }
    }

    if (options?.verificationStatus) {
      result = result.filter((r) => r.verificationStatus === options.verificationStatus);
    }

    // Filter by domain (Medical, Emotional, Legal)
    if (options?.domains && options.domains.length > 0) {
      result = result.filter((r) =>
        r.services.some((s) =>
          options.domains!.includes(s.category as SupportDomain) ||
          s.category === "EMERGENCY"
        )
      );
    }

    // Filter by serviceType if specified
    if (options?.serviceType) {
      result = result.filter((r) => r.serviceType === options.serviceType);
    }

    // Filter 24/7
    if (options?.is24x7) {
      result = result.filter((r) => r.is24x7);
    }

    // Progressive location filtering:
    // If District + State provided: District resources + National resources
    // If only State provided: State resources + National resources
    // If no location provided: National resources only
    if (options?.district && options?.state) {
      result = result.filter(
        (r) =>
          r.geographicScope === "NATIONAL" ||
          (r.state?.toLowerCase() === options.state?.toLowerCase() &&
            r.district?.toLowerCase() === options.district?.toLowerCase()) ||
          (r.state?.toLowerCase() === options.state?.toLowerCase() &&
            r.geographicScope === "STATE")
      );
    } else if (options?.state) {
      result = result.filter(
        (r) =>
          r.geographicScope === "NATIONAL" ||
          r.state?.toLowerCase() === options.state?.toLowerCase()
      );
    }

    // Text search if query given
    if (options?.query) {
      const q = options.query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.district?.toLowerCase().includes(q) ||
          r.state?.toLowerCase().includes(q) ||
          r.serviceType.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getResourceById(id: string): Promise<VerifiedResource | null> {
    const found = this.resources.find((r) => r.id === id);
    return found ? { ...found } : null;
  }

  async searchResources(searchTerm: string): Promise<VerifiedResource[]> {
    return this.getResources({ query: searchTerm });
  }

  async getStatutoryHelplines(): Promise<VerifiedResource[]> {
    return this.resources.filter(
      (r) => r.geographicScope === "NATIONAL" && r.is24x7 && !r.isDemo
    );
  }

  async createResource(
    resourceData: Omit<VerifiedResource, "id">
  ): Promise<VerifiedResource> {
    const newResource: VerifiedResource = {
      ...resourceData,
      id: `res_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      lastVerified: new Date().toISOString(),
    };
    this.resources.unshift(newResource);
    return newResource;
  }

  async updateResource(
    id: string,
    updates: Partial<VerifiedResource>
  ): Promise<VerifiedResource | null> {
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.resources[index] = {
      ...this.resources[index],
      ...updates,
    };
    return { ...this.resources[index] };
  }

  async verifyResource(
    id: string,
    verification: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewDate: Date | string;
    }
  ): Promise<VerifiedResource | null> {
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.resources[index] = {
      ...this.resources[index],
      verificationStatus: verification.newStatus,
      lastVerified: new Date().toISOString(),
      nextReview: new Date(verification.nextReviewDate).toISOString(),
    };

    return { ...this.resources[index] };
  }
}

/**
 * ProductionResourceProvider interacts with Prisma / PostgreSQL
 * and falls back to DemoResourceProvider if DB is unreachable.
 */
export class ProductionResourceProvider implements ResourceProvider {
  private fallbackProvider = new DemoResourceProvider();

  async getResources(options?: ResourceFilterOptions): Promise<VerifiedResource[]> {
    return this.fallbackProvider.getResources(options);
  }

  async getResourceById(id: string): Promise<VerifiedResource | null> {
    return this.fallbackProvider.getResourceById(id);
  }

  async searchResources(searchTerm: string): Promise<VerifiedResource[]> {
    return this.fallbackProvider.searchResources(searchTerm);
  }

  async getStatutoryHelplines(): Promise<VerifiedResource[]> {
    return this.fallbackProvider.getStatutoryHelplines();
  }

  async createResource(resource: Omit<VerifiedResource, "id">): Promise<VerifiedResource> {
    return this.fallbackProvider.createResource(resource);
  }

  async updateResource(id: string, updates: Partial<VerifiedResource>): Promise<VerifiedResource | null> {
    return this.fallbackProvider.updateResource(id, updates);
  }

  async verifyResource(
    id: string,
    verification: {
      verifiedBy: string;
      verifierRole: string;
      checkType: string;
      findings: string;
      newStatus: VerificationStatus;
      nextReviewDate: Date | string;
    }
  ): Promise<VerifiedResource | null> {
    return this.fallbackProvider.verifyResource(id, verification);
  }
}

// Singleton factory
let providerInstance: ResourceProvider | null = null;

export function getResourceProvider(): ResourceProvider {
  if (!providerInstance) {
    const mode = process.env.RESOURCE_PROVIDER || "demo";
    if (mode === "production") {
      providerInstance = new ProductionResourceProvider();
    } else {
      providerInstance = new DemoResourceProvider();
    }
  }
  return providerInstance;
}
