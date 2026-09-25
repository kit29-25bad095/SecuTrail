export type RiskCategory =
  | "IMMEDIATE_DANGER"
  | "MEDICAL_URGENCY"
  | "EMOTIONAL_DISTRESS"
  | "LEGAL_INFO"
  | "GENERAL_AWARENESS"
  | "MINOR_INVOLVEMENT";

export type UrgencyLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type SupportDomain = "MEDICAL" | "EMOTIONAL" | "LEGAL";

export interface SafetyClassificationResult {
  category: RiskCategory;
  urgency: UrgencyLevel;
  requiresEmergencyRouting: boolean;
  requiresHumanReview: boolean;
  detectedFlags: string[];
  recommendedPaths: SupportDomain[];
  guidanceMessage?: string;
  rationale?: string;
}

export interface TriageState {
  sessionId: string;
  selectedDomains: SupportDomain[];
  timeframe?: "UNDER_72_HOURS" | "UNDER_5_DAYS" | "PAST_MONTH" | "HISTORICAL" | "UNCERTAIN";
  hasImmediatePhysicalSafetyRisk: boolean;
  stateCode?: string;
  districtName?: string;
  notes?: string;
}

export type VerificationTier =
  | "TIER_1_OFFICIAL_GOVERNMENT"
  | "TIER_2_VETTED_NGO"
  | "TIER_3_COMMUNITY_VERIFIED";

export type VerificationStatus =
  | "VERIFIED"
  | "PENDING_REVIEW"
  | "NEEDS_UPDATE"
  | "EXPIRED"
  | "REJECTED";

export interface VerifiedResource {
  id: string;
  name: string;
  organizationId?: string | null;
  organizationName?: string | null;
  serviceType: string;
  description?: string | null;
  address?: string | null;
  state?: string | null;
  district?: string | null;
  contact: string;
  secondaryContact?: string | null;
  email?: string | null;
  website?: string | null;
  operatingHours: string;
  is24x7: boolean;
  eligibility?: string | null;
  availability: string;
  geographicScope: "NATIONAL" | "STATE" | "DISTRICT";
  verificationStatus: VerificationStatus;
  authorityLevel: VerificationTier;
  lastVerified: string | Date;
  nextReview: string | Date;
  sourceOrganization?: string | null;
  sourceUrl?: string | null;
  services: {
    category: SupportDomain | "EMERGENCY" | "SHELTER";
    name: string;
    isFree: boolean;
  }[];
  isDemo?: boolean;
}

export interface SourceCitation {
  id: string;
  title: string;
  organization: string;
  url?: string | null;
  authority: string;
  jurisdiction: string;
  publicationYear?: number | null;
  lastVerified: string | Date;
  nextReview: string | Date;
  contentVersion: string;
  verificationStatus: VerificationStatus;
}

export interface KnowledgeSnippet {
  id: string;
  topic: string;
  title: string;
  content: string;
  category: SupportDomain | "BYSTANDER" | "GENERAL";
  source: SourceCitation;
  isVerified: boolean;
}

export interface RAGAnswerResult {
  structuredExplanation: string;
  relevantDomains: SupportDomain[];
  safetyClassification: SafetyClassificationResult;
  verifiedResources: VerifiedResource[];
  citations: SourceCitation[];
  agencyOptions: AgencyDecisionOption[];
  guardrailFlags: string[];
}

export interface AgencyDecisionOption {
  id: string;
  letter: string;
  title: string;
  category: "EMERGENCY" | "MEDICAL" | "LEGAL" | "EMOTIONAL" | "COMBINED";
  summary: string;
  whatItIs: string;
  whoProvidesIt: string;
  howToAccess: string;
  timingConsiderations: string;
  whatMayHappen: string[];
  potentialBenefits: string[];
  potentialConsiderations: string[];
  sources: string[];
}

export type ConversationIntent =
  | "EMOTIONAL_SUPPORT"
  | "LEGAL_AWARENESS"
  | "GENERAL_AWARENESS"
  | "MEDICAL_SUPPORT"
  | "IMMEDIATE_SAFETY"
  | "MINOR_INVOLVEMENT"
  | "TOPIC_RESET";

export interface EphemeralConversationContext {
  conversationTopic: string;
  detectedIntent: ConversationIntent;
  emotionalContext: string[];
  safetyLevel: UrgencyLevel;
  previousUserMessages: string[];
  previousAssistantResponses: string[];
  activeSupportPath: SupportDomain | "SAFETY" | "EDUCATION";
  verifiedInformationUsed: string[];
  turnCount: number;
  lastReferencedEntity?: string;
  unverifiedQueryDetected?: boolean;
}

export interface ConversationTurnRequest {
  message: string;
  sessionId?: string;
  context?: EphemeralConversationContext;
  state?: string;
  district?: string;
}

export interface ConversationTurnResponse {
  response: string;
  context: EphemeralConversationContext;
  safetyClassification: SafetyClassificationResult;
  relevantDomains: SupportDomain[];
  citations: SourceCitation[];
  agencyOptions: AgencyDecisionOption[];
  verifiedResources: VerifiedResource[];
  guardrailFlags: string[];
}
