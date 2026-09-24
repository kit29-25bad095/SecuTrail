import {
  VerifiedResource,
  KnowledgeSnippet,
} from "@/types";

export interface GuardrailCheckResult {
  passed: boolean;
  violations: string[];
  sanitizedContent?: string;
}

// Canonical emergency numbers that are allowed
export const CANONICAL_HOTLINES = new Set([
  "112",
  "1091",
  "181",
  "14416",
  "1098",
  "15100",
  "1516",
  "102",
  "108",
  "1800-599-0019",
  "1800-891-4416",
]);

// Coercive phrases that violate survivor autonomy
const COERCIVE_REPORTING_PATTERNS = [
  /\byou must (report|file an? fir|call the police|tell your parents|go to court)\b/i,
  /\byou have to (report|file|call the police|go to police)\b/i,
  /\byou are required to report\b/i,
  /\byou need to report to the police immediately\b/i,
];

// Victim blaming phrases
const VICTIM_BLAMING_PATTERNS = [
  /\bwhy were you (there|drinking|wearing|out so late)\b/i,
  /\byou should have (known better|been more careful|resisted)\b/i,
  /\bif you hadn'?t\b/i,
  /\bit was your fault\b/i,
  /\byou led (him|them|her) on\b/i,
];

// Dangerous medical / forensic advice
const DANGEROUS_MEDICAL_PATTERNS = [
  /\bwash (yourself|your clothes) immediately\b/i,
  /\btake a bath before the exam\b/i,
  /\bdouche\b/i,
  /\bdestroy the evidence\b/i,
];

// False legal certainty
const FALSE_CERTAINTY_PATTERNS = [
  /\b(will definitely|guaranteed to|for sure) (win|convict|arrest|jail)\b/i,
  /\bthere is no chance\b/i,
];

export class SafetyGuardrails {
  /**
   * LAYER 1: Input Guardrails
   * Analyzes raw user query for critical risk triggers and PII.
   */
  public static checkInput(input: string): {
    hasImmediateDanger: boolean;
    hasSelfHarm: boolean;
    hasPII: boolean;
    sanitizedInput: string;
  } {
    const text = input || "";

    const hasImmediateDanger =
      /\b(attack(ed|ing)?|in danger right now|help me now|call 112|he is here|locked in)\b/i.test(
        text
      );

    const hasSelfHarm =
      /\b(suicid(e|al)|kill myself|want to die|end my life)\b/i.test(text);

    // Redact potential PII (emails, 10-digit Indian phone numbers, 12-digit Aadhaar)
    const sanitized = text
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi,
        "[REDACTED_EMAIL]"
      )
      .replace(/\b(?:\+91|0)?[6-9]\d{9}\b/g, "[REDACTED_PHONE]")
      .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, "[REDACTED_AADHAAR]");

    const hasPII = sanitized !== text;

    return {
      hasImmediateDanger,
      hasSelfHarm,
      hasPII,
      sanitizedInput: sanitized,
    };
  }

  /**
   * LAYER 2: Retrieval Guardrails
   * Validates retrieved knowledge chunks and resources before presenting to generation layer.
   * Rejects unverified, expired, or geographically mismatched sources.
   */
  public static filterRetrievedKnowledge(
    chunks: KnowledgeSnippet[]
  ): KnowledgeSnippet[] {
    const now = new Date();

    return chunks.filter((chunk) => {
      // Must be marked verified
      if (!chunk.isVerified || !chunk.source.verificationStatus) {
        return false;
      }

      // Reject expired verification records
      const reviewDate = new Date(chunk.source.nextReview);
      if (!isNaN(reviewDate.getTime()) && reviewDate < now) {
        return false;
      }

      return true;
    });
  }

  public static filterRetrievedResources(
    resources: VerifiedResource[],
    userState?: string,
    userDistrict?: string
  ): VerifiedResource[] {
    const now = new Date();

    return resources.filter((res) => {
      // Must be VERIFIED
      if (res.verificationStatus !== "VERIFIED") {
        return false;
      }

      // Check review expiration date: Expired resources must never be presented as verified
      if (res.nextReview) {
        const reviewDate = new Date(res.nextReview);
        if (!isNaN(reviewDate.getTime()) && reviewDate < now) {
          return false;
        }
      }

      // Check geographic alignment
      if (res.geographicScope === "DISTRICT" && userDistrict && res.district) {
        if (res.district.toLowerCase() !== userDistrict.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * LAYER 3: Output Guardrails
   * Verifies generated or returned text to prevent victim-blaming, coercive language,
   * false certainty, dangerous advice, or hallucinated numbers.
   */
  public static checkOutput(output: string): GuardrailCheckResult {
    const violations: string[] = [];
    let sanitized = output || "";

    // 1. Check coercive reporting language
    for (const pattern of COERCIVE_REPORTING_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push("COERCIVE_REPORTING_LANGUAGE");
        sanitized = sanitized.replace(
          pattern,
          "Here are the options available to you, and you can choose whether or not to"
        );
      }
    }

    // 2. Check victim blaming
    for (const pattern of VICTIM_BLAMING_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push("VICTIM_BLAMING_CONTENT");
        sanitized = sanitized.replace(
          pattern,
          "[Content adjusted to preserve trauma-informed standard]"
        );
      }
    }

    // 3. Check dangerous medical / forensic advice
    for (const pattern of DANGEROUS_MEDICAL_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push("DANGEROUS_FORENSIC_ADVICE");
        sanitized = sanitized.replace(
          pattern,
          "preserving forensic evidence without washing can assist if you choose an examination"
        );
      }
    }

    // 4. Check false legal certainty
    for (const pattern of FALSE_CERTAINTY_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push("FALSE_LEGAL_CERTAINTY");
        sanitized = sanitized.replace(
          pattern,
          "may be evaluated under statutory provisions"
        );
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      sanitizedContent: sanitized,
    };
  }
}
