import {
  KnowledgeSnippet,
  SafetyClassificationResult,
  SupportDomain,
} from "@/types";

export interface LLMRequestOptions {
  userQuery: string;
  classification: SafetyClassificationResult;
  groundingChunks: KnowledgeSnippet[];
  domains: SupportDomain[];
}

export interface LLMProvider {
  generateGroundedExplanation(options: LLMRequestOptions): Promise<string>;
}

/**
 * MockLLMProvider generates strictly grounded, dynamic explanations
 * synthesized directly from the retrieved knowledge chunks without external network dependencies.
 */
export class MockLLMProvider implements LLMProvider {
  async generateGroundedExplanation(
    options: LLMRequestOptions
  ): Promise<string> {
    const { classification, groundingChunks, domains } = options;

    // Safety priority overrides
    if (classification.category === "IMMEDIATE_DANGER") {
      return (
        "Your immediate physical safety is paramount. If you are facing active violence or someone is threatening you, " +
        "please prioritize reaching a safe, locked location and dial 112 (National Emergency Helpline) or 1091 (Women Helpline) immediately. " +
        "All healthcare evaluations and legal steps can wait until you are physically secure."
      );
    }

    if (classification.category === "EMOTIONAL_DISTRESS" && classification.urgency === "CRITICAL") {
      return (
        "What you are experiencing right now is valid, and you do not have to carry it alone. " +
        "Compassionate, trained counselors are available toll-free 24/7 through Tele-MANAS (14416) or Kiran (1800-599-0019) " +
        "to offer confidential emotional stabilization and psychological first aid."
      );
    }

    // Zero-hallucination check: If no verified chunks exist, explicitly state unverified status
    if (!groundingChunks || groundingChunks.length === 0) {
      return (
        "SecuTrail could not verify this information against our statutorily vetted database. " +
        "SecuTrail adheres to a strict zero-hallucination protocol and only provides guidance grounded in official Indian health protocols (MoHFW) " +
        "and legal statutes (Bharatiya Nyaya Sanhita 2023, NALSA). " +
        "\n\nIf you need assistance regarding this inquiry, please contact one of our verified statutory helplines directly: " +
        "\n• National Emergency Services: 112 " +
        "\n• Women Helpline (24/7): 1091 " +
        "\n• Tele-MANAS Mental Health Counseling: 14416 " +
        "\n• NALSA Free Legal Aid: 15100"
      );
    }

    // Synthesize grounded explanation from vetted knowledge chunks
    const domainLabels = domains.map((d: SupportDomain) => {
      if (d === "MEDICAL") return "medical care & prophylaxis";
      if (d === "EMOTIONAL") return "emotional support & counseling";
      return "statutory rights (BNS 2023)";
    }).join(" and ");

    const sections: string[] = [];

    sections.push(
      `Based on verified statutory and clinical protocols regarding ${domainLabels}, here is the verified guidance relevant to your inquiry:`
    );

    // Group chunks by category for structured reading
    const medicalChunks = groundingChunks.filter((c) => c.category === "MEDICAL");
    const legalChunks = groundingChunks.filter((c) => c.category === "LEGAL");
    const emotionalChunks = groundingChunks.filter((c) => c.category === "EMOTIONAL");

    if (medicalChunks.length > 0) {
      sections.push("\n### Medical & Clinical Considerations (MoHFW Guidelines)");
      medicalChunks.forEach((c) => {
        sections.push(`• **${c.title}**: ${c.content}`);
      });
    }

    if (legalChunks.length > 0) {
      sections.push("\n### Legal Rights & Statutory Framework (BNS 2023 / NALSA)");
      legalChunks.forEach((c) => {
        sections.push(`• **${c.title}**: ${c.content}`);
      });
    }

    if (emotionalChunks.length > 0) {
      sections.push("\n### Emotional Stabilization & Support (Tele-MANAS)");
      emotionalChunks.forEach((c) => {
        sections.push(`• **${c.title}**: ${c.content}`);
      });
    }

    sections.push(
      "\n---\n*Verified Grounding Notice*: This guidance is strictly retrieved from audited official sources " +
      "(including Ministry of Health & Family Welfare clinical guidelines and Bharatiya Nyaya Sanhita 2023). " +
      "It is provided for decision-support and educational purposes and does not replace personalized medical treatment or direct advocate consultation."
    );

    return sections.join("\n");
  }
}

/**
 * ProductionLLMProvider connects to external LLM providers (e.g. OpenAI / Gemini)
 * with strict system instructions enforcing zero-hallucination, grounding, and anti-victim blaming.
 */
export class ProductionLLMProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private fallbackProvider = new MockLLMProvider();

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.LLM_API_KEY || "";
    this.model = model || process.env.LLM_MODEL || "gpt-4o";
  }

  async generateGroundedExplanation(
    options: LLMRequestOptions
  ): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateGroundedExplanation(options);
    }

    const { userQuery, groundingChunks } = options;

    if (!groundingChunks || groundingChunks.length === 0) {
      return (
        "SecuTrail could not verify this information against our statutorily vetted database. " +
        "SecuTrail adheres to a strict zero-hallucination protocol and only provides guidance grounded in official Indian health protocols (MoHFW) " +
        "and legal statutes (Bharatiya Nyaya Sanhita 2023, NALSA). " +
        "\n\nIf you need assistance regarding this inquiry, please contact one of our verified statutory helplines directly: " +
        "\n• National Emergency Services: 112 " +
        "\n• Women Helpline (24/7): 1091 " +
        "\n• Tele-MANAS Mental Health Counseling: 14416 " +
        "\n• NALSA Free Legal Aid: 15100"
      );
    }

    try {
      const systemPrompt = `You are the SecuTrail Verified Decision Assistant.
CRITICAL SAFETY & GROUNDING RULES:
1. Base your answer EXCLUSIVELY on the verified knowledge chunks provided below.
2. NEVER hallucinate emergency phone numbers, hospital names, legal provisions, or medicines.
3. If an answer cannot be determined strictly from the provided knowledge chunks, state: "SecuTrail could not verify this information against our statutorily vetted database."
4. NEVER use coercive language such as "you must report" or "you have to go to the police". Emphasize survivor choice and autonomy.
5. NEVER ask victim-blaming questions (e.g. "why were you there?", "what were you wearing?").
6. Tone: Calm, supportive, clear, objective, and trauma-informed.

VERIFIED KNOWLEDGE CHUNKS:
${groundingChunks.map((c, i) => `[Source ${i + 1}: ${c.source.title} (${c.source.organization})]\n${c.content}`).join("\n\n")}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
          ],
          temperature: 0.1, // Near deterministic
        }),
      });

      if (!response.ok) {
        return this.fallbackProvider.generateGroundedExplanation(options);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      return content || this.fallbackProvider.generateGroundedExplanation(options);
    } catch {
      return this.fallbackProvider.generateGroundedExplanation(options);
    }
  }
}

let llmProviderInstance: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (!llmProviderInstance) {
    const providerType = process.env.LLM_PROVIDER || "mock";
    if (providerType === "production" && process.env.LLM_API_KEY) {
      llmProviderInstance = new ProductionLLMProvider();
    } else {
      llmProviderInstance = new MockLLMProvider();
    }
  }
  return llmProviderInstance;
}
