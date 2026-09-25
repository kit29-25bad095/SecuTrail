import {
  SafetyClassificationResult,
  RiskCategory,
  UrgencyLevel,
  SupportDomain,
} from "@/types";

// Critical danger patterns triggering deterministic emergency override
const IMMEDIATE_DANGER_PATTERNS = [
  /\b(attack(ed|ing)?|beaten|hitting me|choking|held captive|hostage|knife|gun|weapon|kill(ing)? me|locked in|in danger|immediate danger|in immediate danger|someone is breaking in|he is outside|following me|help me now|call police now|immediate help|unsafe right now)\b/i,
  /\b(i'?m in (immediate )?danger|help me please|save me|he will kill me|she will kill me|emergency(?!\s+contracept))\b/i,
];

// Self-harm / suicide patterns
const SELF_HARM_PATTERNS = [
  /\b(suicid(e|al)|end my life|kill myself|want to die|slit my wrist|take all pills|no reason to live|better off dead)\b/i,
];

// Minor / child involvement patterns (POCSO applicability)
const MINOR_PATTERNS = [
  /\b(child|minor|underage|1[0-7] years old|school girl|school boy|school student|daughter|son|kid|baby|toddler|pocso)\b/i,
];

// Medical urgency patterns (PEP, emergency contraception, heavy bleeding, injury, medical support)
const MEDICAL_URGENCY_PATTERNS = [
  /\b(medical|bleed(ing)?|pregnant|contracepti(on|ve)|pep|prep|hiv|sti|std|unprotected|hospital|forensic|doctor|pain|bruis(es|ed)|injury|fracture|morning after|pill|emergency room|er)\b/i,
  /\b(72 hours?|within 3 days|morning after pill)\b/i,
];

// Emotional distress patterns
const EMOTIONAL_DISTRESS_PATTERNS = [
  /\b(distress(ed)?|emotional|panic|anxi(ety|ous)|crying|depressed|nightmare|flashback|shaking|numb|scared|terrified|guilt|shame|overwhelmed|cannot sleep|lonely|isolated)\b/i,
];

// Legal information patterns
const LEGAL_PATTERNS = [
  /\b(legal|fir|police|complaint|zero fir|court|lawyer|bns|ipc|section|arrest|judge|evidence|recording|law|legal aid|nalsa|dlsa|warrant|charges)\b/i,
];

// PII detection patterns (Phone numbers, email addresses, Aadhaar numbers)
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i, // Email
  /\b(?:\+91|0)?[6-9]\d{9}\b/, // Indian mobile numbers
  /\b\d{4}\s\d{4}\s\d{4}\b/, // 12-digit Aadhaar pattern
];

export interface ISafetyClassifier {
  classify(input: string): SafetyClassificationResult;
}

export class SafetyClassifier implements ISafetyClassifier {
  /**
   * Classifies user input into risk categories and returns deterministic routing decisions
   */
  public classify(input: string): SafetyClassificationResult {
    return SafetyClassifier.classify(input);
  }

  public static classify(input: string): SafetyClassificationResult {
    const text = (input || "").trim();
    const detectedFlags: string[] = [];

    // Check PII presence
    for (const pattern of PII_PATTERNS) {
      if (pattern.test(text)) {
        detectedFlags.push("PII_DETECTED");
        break;
      }
    }

    // 1. Check for Immediate Danger (Life Threat / Physical Attack)
    const isImmediateDanger = IMMEDIATE_DANGER_PATTERNS.some((p) => p.test(text));
    if (isImmediateDanger) {
      detectedFlags.push("IMMEDIATE_PHYSICAL_DANGER");
      return {
        category: "IMMEDIATE_DANGER",
        urgency: "CRITICAL",
        requiresEmergencyRouting: true,
        requiresHumanReview: true,
        detectedFlags,
        recommendedPaths: ["MEDICAL", "LEGAL"],
        guidanceMessage:
          "Immediate physical safety risk detected. Prioritize finding a safe, locked location and contacting emergency services (112) immediately.",
        rationale: "Matched immediate physical harm or ongoing violence keywords.",
      };
    }

    // 2. Check for Self-Harm Risk
    const isSelfHarm = SELF_HARM_PATTERNS.some((p) => p.test(text));
    if (isSelfHarm) {
      detectedFlags.push("SELF_HARM_RISK");
      return {
        category: "EMOTIONAL_DISTRESS",
        urgency: "CRITICAL",
        requiresEmergencyRouting: true,
        requiresHumanReview: true,
        detectedFlags,
        recommendedPaths: ["EMOTIONAL"],
        guidanceMessage:
          "If you are feeling overwhelmed or having thoughts of self-harm, compassionate professionals are available 24/7 on Tele-MANAS (14416) or Kiran (1800-599-0019). You are not alone.",
        rationale: "Matched acute crisis or self-harm keywords.",
      };
    }

    // 3. Check for Minor / Child Involvement (POCSO Applicability)
    const isMinor = MINOR_PATTERNS.some((p) => p.test(text));
    if (isMinor) {
      detectedFlags.push("MINOR_INVOLVEMENT_POCSO");
    }

    // 4. Check for Medical Urgency (PEP 72-hour window, physical injury)
    const isMedical = MEDICAL_URGENCY_PATTERNS.some((p) => p.test(text));
    if (isMedical) {
      detectedFlags.push("MEDICAL_TIMEFRAME_RELEVANT");
    }

    // 5. Check for Emotional Distress
    const isEmotional = EMOTIONAL_DISTRESS_PATTERNS.some((p) => p.test(text));
    if (isEmotional) {
      detectedFlags.push("EMOTIONAL_SUPPORT_NEEDED");
    }

    // 6. Check for Legal Inquiries
    const isLegal = LEGAL_PATTERNS.some((p) => p.test(text));
    if (isLegal) {
      detectedFlags.push("LEGAL_RIGHTS_QUERY");
    }

    // Determine recommended paths
    const recommendedPaths: SupportDomain[] = [];
    if (isMedical) recommendedPaths.push("MEDICAL");
    if (isEmotional) recommendedPaths.push("EMOTIONAL");
    if (isLegal) recommendedPaths.push("LEGAL");

    // If nothing specific matched, provide all three pillars for open choice
    if (recommendedPaths.length === 0) {
      recommendedPaths.push("MEDICAL", "EMOTIONAL", "LEGAL");
    }

    // Map to primary category and urgency
    let category: RiskCategory = "GENERAL_AWARENESS";
    let urgency: UrgencyLevel = "LOW";

    if (isMinor) {
      category = "MINOR_INVOLVEMENT";
      urgency = "HIGH";
    } else if (isMedical) {
      category = "MEDICAL_URGENCY";
      urgency = "HIGH";
    } else if (isEmotional) {
      category = "EMOTIONAL_DISTRESS";
      urgency = "MEDIUM";
    } else if (isLegal) {
      category = "LEGAL_INFO";
      urgency = "MEDIUM";
    }

    return {
      category,
      urgency,
      requiresEmergencyRouting: false,
      requiresHumanReview: isMinor || isMedical,
      detectedFlags,
      recommendedPaths,
      guidanceMessage:
        "Based on your input, here are verified options and resources tailored to your circumstances. You remain fully in control of what you explore.",
      rationale: `Matched ${detectedFlags.join(", ") || "general exploration"}.`,
    };
  }
}

let classifierInstance: ISafetyClassifier | null = null;
export function getSafetyClassifier(): ISafetyClassifier {
  if (!classifierInstance) {
    classifierInstance = new SafetyClassifier();
  }
  return classifierInstance;
}
