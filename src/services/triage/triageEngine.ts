import {
  SupportDomain,
  AgencyDecisionOption,
} from "@/types";
import { AgencyOptionsService } from "@/services/agency/agencyOptions";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export interface TriageInput {
  domains: SupportDomain[];
  timeframe?: string;
  state?: string | null;
  district?: string | null;
  notes?: string;
}

export interface TriageEvaluationResult {
  selectedDomains: SupportDomain[];
  timeframeAlerts: string[];
  criticalActions: string[];
  recommendedOptions: AgencyDecisionOption[];
  matchedResourcesCount: number;
  locationScope: {
    state?: string | null;
    district?: string | null;
    isProgressiveConsentActive: boolean;
  };
  summary: string;
}

export interface ITriageEngine {
  evaluateTriage(input: TriageInput): Promise<TriageEvaluationResult>;
}

export class TriageEngine implements ITriageEngine {
  public async evaluateTriage(input: TriageInput): Promise<TriageEvaluationResult> {
    const domains: SupportDomain[] =
      input.domains && input.domains.length > 0
        ? input.domains
        : ["MEDICAL", "EMOTIONAL", "LEGAL"];

    const timeframe = input.timeframe || "UNDER_72_HOURS";
    const timeframeAlerts: string[] = [];
    const criticalActions: string[] = [];

    // Evaluate Clinical & Forensic Windows
    if (domains.includes("MEDICAL")) {
      if (timeframe === "UNDER_72_HOURS" || timeframe === "CRITICAL_72H") {
        timeframeAlerts.push(
          "HIV Post-Exposure Prophylaxis (PEP) is clinically time-critical and should ideally begin within 72 hours."
        );
        timeframeAlerts.push(
          "Emergency oral contraception is most effective when taken as early as possible within 72 hours."
        );
        criticalActions.push(
          "Consider visiting an emergency medical department or One Stop Centre if you wish to evaluate HIV PEP."
        );
      } else if (timeframe === "UNDER_5_DAYS") {
        timeframeAlerts.push(
          "Emergency copper IUD contraception can remain an option up to 120 hours (5 days) post-incident."
        );
      } else {
        timeframeAlerts.push(
          "Comprehensive baseline STI screening and trauma medical evaluations remain available regardless of elapsed time."
        );
      }
    }

    if (domains.includes("LEGAL")) {
      timeframeAlerts.push(
        "Under Indian law (BNS 2023), you have the right to file a Zero-FIR at any police station regardless of where the incident occurred."
      );
      criticalActions.push(
        "You are entitled to free legal counsel under Section 12 of the Legal Services Authorities Act (DLSA/NALSA)."
      );
    }

    if (domains.includes("EMOTIONAL")) {
      criticalActions.push(
        "Free, confidential emotional crisis support is accessible 24/7 via Tele-MANAS (14416)."
      );
    }

    // Retrieve balanced agency option cards
    const recommendedOptions = AgencyOptionsService.getOptionsForContext(domains);

    // Count matched verified facilities
    const resourceProvider = getResourceProvider();
    const matchedResources = await resourceProvider.getResources({
      domains,
      state: input.state || undefined,
      district: input.district || undefined,
      verificationStatus: "VERIFIED",
    });

    const isProgressiveConsentActive = Boolean(input.state || input.district);

    const summary = `Evaluated ${domains.length} support domain(s) [${domains.join(", ")}]. Found ${matchedResources.length} verified facility match(es).`;

    return {
      selectedDomains: domains,
      timeframeAlerts,
      criticalActions,
      recommendedOptions,
      matchedResourcesCount: matchedResources.length,
      locationScope: {
        state: input.state,
        district: input.district,
        isProgressiveConsentActive,
      },
      summary,
    };
  }
}

let triageEngineInstance: ITriageEngine | null = null;
export function getTriageEngine(): ITriageEngine {
  if (!triageEngineInstance) {
    triageEngineInstance = new TriageEngine();
  }
  return triageEngineInstance;
}
