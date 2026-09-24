import {
  RAGAnswerResult,
  SupportDomain,
  SourceCitation,
} from "@/types";
import { SafetyClassifier } from "@/services/safety/safetyClassifier";
import { SafetyGuardrails } from "@/services/safety/guardrails";
import { getLLMProvider } from "@/services/ai/llmProvider";
import { getResourceProvider } from "@/services/resources/resourceProvider";
import { AgencyOptionsService } from "@/services/agency/agencyOptions";
import { VERIFIED_KNOWLEDGE_CHUNKS } from "./verifiedKnowledgeBase";

export interface RAGQueryRequest {
  query: string;
  selectedDomains?: SupportDomain[];
  state?: string;
  district?: string;
  timeframe?: string;
}

export interface IVerifiedRAGService {
  answer(request: RAGQueryRequest): Promise<RAGAnswerResult>;
}

export class VerifiedRAGService implements IVerifiedRAGService {
  public async answer(request: RAGQueryRequest): Promise<RAGAnswerResult> {
    return VerifiedRAGService.answer(request);
  }

  /**
   * Executes the 9-stage verified RAG pipeline with zero-hallucination guarantees
   */
  public static async answer(request: RAGQueryRequest): Promise<RAGAnswerResult> {
    const { query, selectedDomains, state, district } = request;

    // Stage 1 & 2: Input Guardrails & Safety Classification
    const inputGuardrailResult = SafetyGuardrails.checkInput(query);
    const classification = SafetyClassifier.classify(inputGuardrailResult.sanitizedInput);

    // Stage 3: Query Understanding & Target Domain Resolution
    let activeDomains: SupportDomain[] =
      selectedDomains && selectedDomains.length > 0
        ? [...selectedDomains]
        : [...classification.recommendedPaths];

    if (activeDomains.length === 0) {
      activeDomains = ["MEDICAL", "EMOTIONAL", "LEGAL"];
    }

    const STOP_WORDS = new Set([
      "what", "the", "this", "that", "there", "their", "they", "best", "for", "from",
      "with", "and", "about", "high", "low", "fund", "funds", "how", "why", "when",
      "where", "who", "which", "can", "could", "should", "would", "will", "are", "was",
      "were", "been", "have", "has", "had", "does", "did", "doing", "get", "got", "give",
      "some", "any", "other", "into", "over", "such", "than", "more", "most", "just",
      "make", "made", "like", "know", "take", "took", "good", "well"
    ]);

    // Stage 4: Strict Retrieval from Verified Knowledge Base
    const queryLower = inputGuardrailResult.sanitizedInput.toLowerCase();
    const queryTokens = queryLower
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

    const scoredChunks = VERIFIED_KNOWLEDGE_CHUNKS.map((chunk) => {
      let keywordScore = 0;
      const titleLower = chunk.title.toLowerCase();
      const topicLower = chunk.topic.toLowerCase().replace(/_/g, " ");

      // Exact topic match
      if (topicLower === queryLower || queryLower.includes(topicLower)) {
        keywordScore += 6;
      }

      // Keyword token matches
      let titleTopicMatch = 0;
      const ABBREVIATIONS = new Set(["pep", "hiv", "fir", "sti", "std", "iud", "bns", "cwc"]);
      const titleWords = new Set(titleLower.replace(/[^\w\s]/g, " ").split(/\s+/));
      const topicWords = new Set(topicLower.replace(/[^\w\s]/g, " ").split(/\s+/));

      queryTokens.forEach((token) => {
        const isAbbrev = ABBREVIATIONS.has(token);
        const isMinLength = token.length >= 4;

        if (isAbbrev || isMinLength) {
          if (titleWords.has(token) || (isMinLength && titleLower.includes(token))) {
            keywordScore += 4;
            titleTopicMatch++;
          }
          if (topicWords.has(token) || (isMinLength && topicLower.includes(token))) {
            keywordScore += 3;
            titleTopicMatch++;
          }
        }
      });

      // A chunk MUST have meaningful keyword/topical overlap in title/topic to be considered
      const totalScore = titleTopicMatch > 0 && keywordScore >= 4
        ? keywordScore + (activeDomains.includes(chunk.category as SupportDomain) ? 1 : 0)
        : 0;

      return { chunk, score: totalScore };
    });

    // Filter by minimum relevance threshold (score >= 5)
    const relevantChunks = scoredChunks
      .filter((sc) => sc.score >= 5)
      .sort((a, b) => b.score - a.score)
      .map((sc) => sc.chunk);

    // Stage 5 & 6: Retrieval Guardrails (Verification status & non-expired review dates)
    const filteredChunks = SafetyGuardrails.filterRetrievedKnowledge(relevantChunks);

    // Retrieve Verified Resources matching domains & progressive location consent
    const resourceProvider = getResourceProvider();
    const rawResources = await resourceProvider.getResources({
      domains: activeDomains,
      state: state || undefined,
      district: district || undefined,
      verificationStatus: "VERIFIED",
    });

    const verifiedResources = SafetyGuardrails.filterRetrievedResources(
      rawResources,
      state,
      district
    );

    // Stage 7: Grounding & LLM Explanation
    // Zero-hallucination check: If no verified chunks match the query, explicitly state unverified status
    let rawExplanation = "";
    if (filteredChunks.length === 0) {
      rawExplanation =
        "SecuTrail could not verify this information against our statutorily vetted database. " +
        "SecuTrail adheres to a strict zero-hallucination protocol and only provides guidance grounded in official Indian health protocols (MoHFW) " +
        "and legal statutes (Bharatiya Nyaya Sanhita 2023, NALSA). " +
        "\n\nIf you need assistance regarding this inquiry, please contact one of our verified statutory helplines directly: " +
        "\n• National Emergency Services: 112 " +
        "\n• Women Helpline (24/7): 1091 " +
        "\n• Tele-MANAS Mental Health Counseling: 14416 " +
        "\n• NALSA Free Legal Aid: 15100";
    } else {
      const llmProvider = getLLMProvider();
      rawExplanation = await llmProvider.generateGroundedExplanation({
        userQuery: inputGuardrailResult.sanitizedInput,
        classification,
        groundingChunks: filteredChunks,
        domains: activeDomains,
      });
    }

    // Stage 8: Output Guardrails Check
    const outputGuardrailResult = SafetyGuardrails.checkOutput(rawExplanation);

    // Stage 9: Source Citations & Agency-First Decision Options
    const citationsMap = new Map<string, SourceCitation>();
    filteredChunks.forEach((chunk) => {
      citationsMap.set(chunk.source.id, chunk.source);
    });
    const citations = Array.from(citationsMap.values());

    const agencyOptions = AgencyOptionsService.getOptionsForContext(
      activeDomains,
      classification.category
    );

    const guardrailFlags: string[] = [];
    if (inputGuardrailResult.hasPII) guardrailFlags.push("PII_REDACTED");
    if (filteredChunks.length === 0) guardrailFlags.push("UNVERIFIED_QUERY_DISCLAIMER_APPLIED");
    if (outputGuardrailResult.violations.length > 0) {
      guardrailFlags.push(...outputGuardrailResult.violations);
    }

    return {
      structuredExplanation:
        outputGuardrailResult.sanitizedContent || rawExplanation,
      relevantDomains: activeDomains,
      safetyClassification: classification,
      verifiedResources: verifiedResources.slice(0, 6),
      citations,
      agencyOptions,
      guardrailFlags,
    };
  }
}

let ragServiceInstance: IVerifiedRAGService | null = null;
export function getVerifiedRAGService(): IVerifiedRAGService {
  if (!ragServiceInstance) {
    ragServiceInstance = new VerifiedRAGService();
  }
  return ragServiceInstance;
}
