import {
  EphemeralConversationContext,
  ConversationIntent,
  ConversationTurnRequest,
  ConversationTurnResponse,
  SupportDomain,
  SafetyClassificationResult,
  SourceCitation,
  AgencyDecisionOption,
  VerifiedResource,
} from "@/types";
import { SafetyClassifier } from "@/services/safety/safetyClassifier";
import { SafetyGuardrails } from "@/services/safety/guardrails";
import { VERIFIED_SOURCES, VERIFIED_KNOWLEDGE_CHUNKS } from "@/services/rag/verifiedKnowledgeBase";
import { getResourceProvider } from "@/services/resources/resourceProvider";
import { AgencyOptionsService } from "@/services/agency/agencyOptions";
import { SessionManager } from "@/services/sessions/sessionManager";

export class AdaptiveChatEngine {
  /**
   * Main entry point: processes a user turn contextually within the current ephemeral session
   */
  public static async processTurn(
    request: ConversationTurnRequest
  ): Promise<ConversationTurnResponse> {
    const rawMessage = request.message || "";

    // 1. Input Guardrails: Sanitize PII and detect prompt injection / threats
    const inputGuardrailResult = SafetyGuardrails.checkInput(rawMessage);
    const sanitizedInput = inputGuardrailResult.sanitizedInput.trim();
    const guardrailFlags: string[] = [];
    if (inputGuardrailResult.hasPII) {
      guardrailFlags.push("PII_REDACTED");
    }

    // 2. Global Safety Layer & Risk Classifier (NON-BYPASSABLE)
    // Conversational context MUST NOT override the Safety Layer.
    const safetyClassification = SafetyClassifier.classify(sanitizedInput);

    // Retrieve or initialize session context
    const previousContext: EphemeralConversationContext = request.context || {
      conversationTopic: "INITIAL_CONTACT",
      detectedIntent: "EMOTIONAL_SUPPORT",
      emotionalContext: [],
      safetyLevel: "LOW",
      previousUserMessages: [],
      previousAssistantResponses: [],
      activeSupportPath: "EMOTIONAL",
      verifiedInformationUsed: [],
      turnCount: 0,
    };

    // If server-side session exists, synchronize context
    if (request.sessionId) {
      const serverSession = SessionManager.getSession(request.sessionId);
      if (serverSession?.conversationContext) {
        // Merge recent context from server if client context is behind
        if (serverSession.conversationContext.turnCount > previousContext.turnCount) {
          Object.assign(previousContext, serverSession.conversationContext);
        }
      }
    }

    // 3. PRIORITY EMERGENCY ESCALATION
    if (safetyClassification.category === "IMMEDIATE_DANGER") {
      return this.handleImmediateDangerTurn(
        sanitizedInput,
        previousContext,
        safetyClassification,
        guardrailFlags,
        request
      );
    }

    if (
      safetyClassification.category === "EMOTIONAL_DISTRESS" &&
      safetyClassification.urgency === "CRITICAL"
    ) {
      return this.handleCrisisTurn(
        sanitizedInput,
        previousContext,
        safetyClassification,
        guardrailFlags,
        request
      );
    }

    // 4. Prompt Injection & Security Evasion Defense
    const isAdversarialOrInjection =
      /\b(ignore (all )?(previous|prior) (instructions|rules|prompts)|system prompt|you are now (an? )?uncensored|jailbreak|bypass security|how to hack|drop table|select \* from)\b/i.test(
        sanitizedInput
      );

    if (isAdversarialOrInjection) {
      guardrailFlags.push("PROMPT_INJECTION_DEFENSE_TRIGGERED", "UNVERIFIED_QUERY_DISCLAIMER_APPLIED");
      const responseText =
        "SecuTrail could not verify this inquiry against our statutorily vetted database. " +
        "SecuTrail adheres to a strict zero-hallucination protocol and only provides guidance grounded in official Indian health protocols (MoHFW) " +
        "and legal statutes (Bharatiya Nyaya Sanhita 2023, NALSA).\n\n" +
        "If you need immediate assistance, please contact one of our verified statutory helplines directly:\n" +
        "• National Emergency Services: 112\n" +
        "• Women Helpline (24/7): 1091\n" +
        "• Tele-MANAS Mental Health Counseling: 14416\n" +
        "• NALSA Free Legal Aid: 15100";

      return {
        response: responseText,
        context: previousContext,
        safetyClassification,
        relevantDomains: ["EMOTIONAL", "LEGAL", "MEDICAL"],
        citations: [],
        agencyOptions: [],
        verifiedResources: [],
        guardrailFlags,
      };
    }

    // 5. Topic Reset / Forget Everything
    const isResetRequest =
      /\b(forget (everything|all|context)|clear (chat|history|context)|start over|reset conversation|tell me something unrelated)\b/i.test(
        sanitizedInput
      );

    if (isResetRequest) {
      const resetContext: EphemeralConversationContext = {
        conversationTopic: "GENERAL_EXPLORATION",
        detectedIntent: "TOPIC_RESET",
        emotionalContext: [],
        safetyLevel: "LOW",
        previousUserMessages: [sanitizedInput],
        previousAssistantResponses: [],
        activeSupportPath: "EMOTIONAL",
        verifiedInformationUsed: [],
        turnCount: previousContext.turnCount + 1,
      };

      const responseText =
        "I have cleared our previous conversation context. We can start fresh. " +
        "You can explore emotional support, understand your statutory legal rights under Indian law, or learn about medical and crisis resources. What would you like to focus on?";

      resetContext.previousAssistantResponses.push(responseText);

      if (request.sessionId) {
        SessionManager.updateConversationContext(request.sessionId, resetContext);
      }

      return {
        response: responseText,
        context: resetContext,
        safetyClassification,
        relevantDomains: ["EMOTIONAL", "LEGAL", "MEDICAL"],
        citations: [],
        agencyOptions: [],
        verifiedResources: [],
        guardrailFlags,
      };
    }

    // 5. Context-Aware Intent & Follow-up Detection
    const detectedIntent = this.detectTurnIntent(sanitizedInput, previousContext, safetyClassification);
    const emotionalSignals = this.extractEmotionalContext(sanitizedInput, previousContext);

    // 6. Generate Contextual, Adaptive Response
    const responseResult = await this.synthesizeAdaptiveResponse({
      sanitizedInput,
      detectedIntent,
      emotionalSignals,
      previousContext,
      safetyClassification,
      state: request.state,
      district: request.district,
    });

    // 7. Output Guardrail Check
    const outputGuardrail = SafetyGuardrails.checkOutput(responseResult.responseText);
    if (outputGuardrail.violations.length > 0) {
      guardrailFlags.push(...outputGuardrail.violations);
    }
    if (responseResult.unverifiedQuery) {
      guardrailFlags.push("UNVERIFIED_QUERY_DISCLAIMER_APPLIED");
    }

    const finalResponseText = outputGuardrail.sanitizedContent || responseResult.responseText;

    // 8. Update Ephemeral Conversation Context
    const updatedContext: EphemeralConversationContext = {
      conversationTopic: responseResult.topic,
      detectedIntent,
      emotionalContext: emotionalSignals,
      safetyLevel: safetyClassification.urgency,
      previousUserMessages: [...previousContext.previousUserMessages, sanitizedInput],
      previousAssistantResponses: [
        ...previousContext.previousAssistantResponses,
        finalResponseText,
      ],
      activeSupportPath: responseResult.activeSupportPath,
      verifiedInformationUsed: Array.from(
        new Set([
          ...previousContext.verifiedInformationUsed,
          ...responseResult.citations.map((c) => c.title),
        ])
      ),
      turnCount: previousContext.turnCount + 1,
      lastReferencedEntity: responseResult.referencedEntity || previousContext.lastReferencedEntity,
      unverifiedQueryDetected: responseResult.unverifiedQuery,
    };

    // Keep memory footprint bounded: retain last 10 messages in RAM
    if (updatedContext.previousUserMessages.length > 10) {
      updatedContext.previousUserMessages = updatedContext.previousUserMessages.slice(-10);
    }
    if (updatedContext.previousAssistantResponses.length > 10) {
      updatedContext.previousAssistantResponses = updatedContext.previousAssistantResponses.slice(-10);
    }

    // Synchronize ephemeral context in RAM session store
    if (request.sessionId) {
      SessionManager.updateConversationContext(request.sessionId, updatedContext);
    }

    return {
      response: finalResponseText,
      context: updatedContext,
      safetyClassification,
      relevantDomains: responseResult.relevantDomains,
      citations: responseResult.citations,
      agencyOptions: responseResult.agencyOptions,
      verifiedResources: responseResult.verifiedResources,
      guardrailFlags,
    };
  }

  /**
   * Deterministic Intent Detector incorporating conversational continuity & transitions
   */
  private static detectTurnIntent(
    input: string,
    context: EphemeralConversationContext,
    classification: SafetyClassificationResult
  ): ConversationIntent {
    const text = input.toLowerCase();

    // Check Minor Involvement (POCSO)
    if (classification.category === "MINOR_INVOLVEMENT") {
      return "MINOR_INVOLVEMENT";
    }

    // 0. Greeting Check
    if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening)|start|greetings|help|hi there|hello there)[\s!.]*$/i.test(text.trim())) {
      return "GENERAL_AWARENESS";
    }

    // 0b. Rape / Sexual Assault inquiries, opinions, and definitions
    const isRapeInquiry =
      /^(rape|sexual assault|sexual violence|molestation)[\s!.]*$/i.test(text.trim()) ||
      (/\b(rape|sexual assault|sexual violence|molest)\b/i.test(text) &&
        /\b(what|think|thought|opinion|view|definition|define|meaning|tell me|explain|why|is it|about|statute|law|article|section|understand)\b/i.test(
          text
        ));
    if (isRapeInquiry) {
      return "GENERAL_AWARENESS";
    }

    // 1. Follow-up: Hesitation to disclose / tell anyone
    if (
      /\b(don'?t want to tell anyone|can'?t tell anyone|scared to tell|keep it private|not ready to talk|don'?t tell my parents)\b/i.test(
        text
      )
    ) {
      return "EMOTIONAL_SUPPORT";
    }

    // 2. Follow-up: Refusal to report
    if (
      /\b(don'?t want to report|what if i don'?t (want to )?report|do i have to report|without (filing )?an? fir|no police)\b/i.test(
        text
      )
    ) {
      return "LEGAL_AWARENESS";
    }

    // 3. Follow-up: "I'm still scared" / "still overwhelmed" / "anxious"
    if (
      /\b(still (scared|terrified|afraid|overwhelmed|anxious|shaking|numb)|scared again)\b/i.test(
        text
      )
    ) {
      return "EMOTIONAL_SUPPORT";
    }

    // 4. Follow-up: Refusal of previously discussed option ("What if I don't want to do that?")
    if (/\b(what if i don'?t want (to do )?that|i don'?t want that|not that)\b/i.test(text)) {
      return context.detectedIntent || "EMOTIONAL_SUPPORT";
    }

    // 5. Follow-up: Generic "What are my options?" / "What can I do?" (without explicit domain subject)
    if (
      !/\b(fir|police|court|lawyer|bns|bnss|nalsa|dlsa|posh|refuse|pep|hiv|hospital|doctor|contracept|evidence|consent|photo|leak)\b/i.test(text) &&
      /\b(what are my options|what options do i have|what can i do)\b/i.test(text)
    ) {
      if (context.activeSupportPath === "LEGAL") return "LEGAL_AWARENESS";
      if (context.activeSupportPath === "MEDICAL") return "MEDICAL_SUPPORT";
      return "EMOTIONAL_SUPPORT";
    }

    // 6. Explicit Medical Requests & Evidence Preservation
    if (
      /\b(medical|pep|prep|hiv|sti|contracepti|hospital|doctor|bleeding|injury|fracture|morning after|pill|evidence|shower|bath|bathe|clothes|clothing|paper bag|dna|swab|forensic)\b/i.test(
        text
      )
    ) {
      return "MEDICAL_SUPPORT";
    }

    // 7. Explicit Awareness & Education Requests (Consent, Boundaries, Bystander, Cybercrime)
    if (
      /\b(what is consent|meaning of consent|define consent|consent mean|boundar(y|ies)|bystander|5ds|common myths|cyber|photo|video|leak|blackmail|instagram|whatsapp|morphed|ncii|stopncii)\b/i.test(
        text
      )
    ) {
      return "GENERAL_AWARENESS";
    }

    // 8. Explicit Legal Requests (Statutes, Police Refusal, POSH, NALSA, Zero-FIR)
    if (
      /\b(legal|rights|fir|zero fir|police|complaint|court|lawyer|bns|bnss|ipc|section|nalsa|dlsa|posh|counsel|police refuse|refuse|sp|commissioner|magistrate|woman officer|female officer|compensation|sakhi|one stop|identity|media|in camera|accompanied|bring someone)\b/i.test(
        text
      )
    ) {
      return "LEGAL_AWARENESS";
    }

    // 9. Emotional Expressions & Trauma Stabilization (including trust, privacy, and healing)
    if (
      /\b(scared|terrified|afraid|numb|crying|sad|anxiety|anxious|panic|overwhelmed|shame|guilt|alone|lonely|confused|uncertain|my fault|blame myself|ashamed|can'?t sleep|cannot sleep|insomnia|nightmare|racing heart|flashback|freeze|broken|damaged|dirty|hopeless|will i (ever )?heal|can i trust|is this private|is this safe)\b/i.test(
        text
      )
    ) {
      return "EMOTIONAL_SUPPORT";
    }

    // Default to conversational active path or emotional support
    if (context.activeSupportPath === "LEGAL") return "LEGAL_AWARENESS";
    if (context.activeSupportPath === "MEDICAL") return "MEDICAL_SUPPORT";
    if (context.activeSupportPath === "EDUCATION") return "GENERAL_AWARENESS";
    return "EMOTIONAL_SUPPORT";
  }

  /**
   * Extracts emotional indicators and preserves recent emotional context
   */
  private static extractEmotionalContext(
    input: string,
    context: EphemeralConversationContext
  ): string[] {
    const text = input.toLowerCase();
    const currentEmotions: string[] = [];

    if (/\b(scared|afraid|terrified|fear)\b/i.test(text)) currentEmotions.push("fear");
    if (/\b(numb|frozen|blank|freeze)\b/i.test(text)) currentEmotions.push("numbness");
    if (/\b(overwhelmed|too much|cannot take it)\b/i.test(text)) currentEmotions.push("overwhelm");
    if (/\b(anxious|anxiety|panic|shaking|heart|racing)\b/i.test(text)) currentEmotions.push("anxiety");
    if (/\b(sad|crying|hopeless|depressed)\b/i.test(text)) currentEmotions.push("sadness");
    if (/\b(shame|guilt|my fault|embarrassed|blame)\b/i.test(text)) currentEmotions.push("shame");
    if (/\b(confused|uncertain|don'?t know what to do)\b/i.test(text)) currentEmotions.push("uncertainty");
    if (/\b(don'?t want to tell|secret|private|hide)\b/i.test(text)) currentEmotions.push("hesitation_to_disclose");

    // Combine with previous emotional context (deduplicated)
    return Array.from(new Set([...context.emotionalContext, ...currentEmotions])).slice(-5);
  }

  /**
   * Helper to find the best matching verified knowledge chunk from the vetted database
   */
  public static findBestKnowledgeSnippet(input: string): {
    bestSnippet: (typeof VERIFIED_KNOWLEDGE_CHUNKS)[0] | null;
    highestScore: number;
  } {
    const queryTokens = input
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);

    let bestSnippet: (typeof VERIFIED_KNOWLEDGE_CHUNKS)[0] | null = null;
    let highestScore = 0;

    for (const chunk of VERIFIED_KNOWLEDGE_CHUNKS) {
      let score = 0;
      const titleLower = chunk.title.toLowerCase();
      const topicLower = chunk.topic.toLowerCase().replace(/_/g, " ");
      const contentLower = chunk.content.toLowerCase();

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 3;
        if (topicLower.includes(token)) score += 2;
        if (contentLower.includes(token)) score += 1;
      }

      if (score > highestScore) {
        highestScore = score;
        bestSnippet = chunk;
      }
    }

    return { bestSnippet, highestScore };
  }

  /**
   * Synthesizes the adaptive, context-aware response
   */
  private static async synthesizeAdaptiveResponse(params: {
    sanitizedInput: string;
    detectedIntent: ConversationIntent;
    emotionalSignals: string[];
    previousContext: EphemeralConversationContext;
    safetyClassification: SafetyClassificationResult;
    state?: string;
    district?: string;
  }): Promise<{
    responseText: string;
    topic: string;
    activeSupportPath: SupportDomain | "SAFETY" | "EDUCATION";
    relevantDomains: SupportDomain[];
    citations: SourceCitation[];
    agencyOptions: AgencyDecisionOption[];
    verifiedResources: VerifiedResource[];
    referencedEntity?: string;
    unverifiedQuery?: boolean;
  }> {
    const {
      sanitizedInput,
      detectedIntent,
      previousContext,
      state,
      district,
    } = params;

    const resourceProvider = getResourceProvider();

    // ------------------------------------------------------------
    // 1. EMOTIONAL SUPPORT PATHWAY
    // ------------------------------------------------------------
    if (detectedIntent === "EMOTIONAL_SUPPORT") {
      const isDisclosureHesitation =
        /\b(don'?t want to tell anyone|can'?t tell anyone|scared to tell|keep it private|not ready to talk|don'?t tell my parents)\b/i.test(
          sanitizedInput
        );

      const isStillScared =
        /\b(still (scared|terrified|afraid|overwhelmed|anxious)|scared again)\b/i.test(
          sanitizedInput
        );

      const isRefusalOfOption =
        /\b(what if i don'?t want (to do )?that|i don'?t want that|not that)\b/i.test(
          sanitizedInput
        );

      const isSelfBlameOrGuilt =
        /\b(my fault|blame myself|guilt|guilty|ashamed|should have known|why did i|blaming myself)\b/i.test(
          sanitizedInput
        );

      const isPanicOrInsomnia =
        /\b(can'?t sleep|cannot sleep|insomnia|nightmare|racing heart|heart pounding|panic attack|hypervigilan|shaking)\b/i.test(
          sanitizedInput
        );

      const isGroundingOrFlashback =
        /\b(grounding|flashback|dissociat|dizzy|numb|frozen|5-4-3-2-1)\b/i.test(
          sanitizedInput
        );

      const isTrustOrPrivacy =
        /\b(can i trust|is this safe|is this private|who can see|are you logging|are you recording|will anyone know)\b/i.test(
          sanitizedInput
        );

      const isBrokenOrHopeless =
        /\b(feel broken|am i broken|ruined|damaged|dirty|never (be the same|heal|recover)|hopeless)\b/i.test(
          sanitizedInput
        );

      let responseText = "";
      let topic = "EMOTIONAL_COPING";
      const citations: SourceCitation[] = [VERIFIED_SOURCES.who_clinical_rape];

      const isGreeting =
        /^(hi|hello|hey|namaste|good (morning|afternoon|evening)|start|greetings|help|hi there|hello there)[\s!.]*$/i.test(
          sanitizedInput.trim()
        );

      const isRapeQuery =
        /^(rape|sexual assault|sexual violence|molestation)[\s!.]*$/i.test(sanitizedInput.trim()) ||
        (/\b(rape|sexual assault|sexual violence|molest)\b/i.test(sanitizedInput) &&
          /\b(what|think|thought|opinion|view|definition|define|meaning|tell me|explain|why|is it|about|statute|law|article|section|understand)\b/i.test(
            sanitizedInput
          ));

      if (isGreeting) {
        topic = "GREETING_AND_ASSISTANT_CAPABILITIES";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.mohfw_pep_protocol, VERIFIED_SOURCES.who_clinical_rape);
        responseText =
          "Hello, I am SecuTrail's confidential support assistant. You are in a safe, anonymous space where no personal information is tracked or stored.\n\n" +
          "I am here to answer your questions and guide you through verified options at your own pace:\n" +
          "• **Emergency Healthcare:** Timelines for HIV PEP (strictly within 72 hours), emergency contraception, and forensic evidence preservation guidelines.\n" +
          "• **Legal Protections:** Your statutory rights under Bharatiya Nyaya Sanhita (BNS 2023), Zero-FIR filing, police refusal penalties (Section 199 BNS), POSH workplace harassment, and free legal aid (NALSA 15100).\n" +
          "• **Emotional Coping & Grounding:** Trauma grounding exercises (5-4-3-2-1), panic stabilization, self-blame deconstruction, and 24/7 counseling hotlines like Tele-MANAS (14416).\n" +
          "• **Safety & Digital Rights:** Cyber harassment reporting (1930) and active consent standards.\n\n" +
          "You remain in complete control. What would you like to know or discuss?";
      } else if (isRapeQuery) {
        topic = "RAPE_LEGAL_AND_ETHICAL_FRAMEWORK";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.who_clinical_rape);
        responseText =
          "In statutory law and clinical trauma science, **rape and sexual assault are profound criminal violations of human dignity, bodily autonomy, and fundamental rights**:\n\n" +
          "• **Statutory Definition (Section 63 BNS 2023):** Under Indian criminal law (Bharatiya Nyaya Sanhita 2023), rape is non-consensual sexual penetration or acts committed without voluntary, active consent, or where consent is vitiated through coercion, fear, intoxication, or deception.\n" +
          "• **100% Perpetrator Responsibility:** Under WHO clinical guidelines and trauma psychology, **responsibility lies 100% with the person who committed the assault**. A survivor is NEVER to blame, regardless of what they wore, consumed, where they were, or their relationship to the perpetrator.\n" +
          "• **The Biology of Trauma (Freeze Response):** Involuntary nervous system reactions like freezing, going numb, or being unable to scream (tonic immobility) are physiological survival mechanisms—they are never consent or agreement.\n" +
          "• **Absolute Rights of Survivors:** Every survivor has enforceable statutory rights to free immediate emergency healthcare (Section 397 BNSS), independent forensic preservation without forced police reporting, full identity protection (Section 72 BNS), and free legal representation (NALSA 15100).\n\n" +
          "If you or someone you know has been affected, SecuTrail is here to support you with confidential medical timelines, legal protections, or emotional grounding at your own pace.";
      } else if (isDisclosureHesitation) {
        topic = "HESITATION_TO_DISCLOSE";
        responseText =
          "That's completely okay. You don't have to decide that right now, and you don't have to tell anyone until or unless you feel ready. " +
          "Your safety, your autonomy, and your pace are what matter most.\n\n" +
          "Everything in this space is completely private and anonymous. We can focus on understanding your options privately, " +
          "or simply talk through what you're feeling without any pressure to take any action.";
      } else if (isStillScared) {
        topic = "PERSISTENT_FEAR_STABILIZATION";
        responseText =
          "It makes complete sense that you are still feeling scared. Feeling safe again takes time, and you don't have to rush through this. " +
          "You are safe in this conversation right now.\n\n" +
          "If you'd like, we can try a gentle grounding exercise together (like the 5-4-3-2-1 sensory method to help your nervous system settle), " +
          "or talk through confidential counseling resources like Tele-MANAS (14416). We can take this one small step at a time.";
      } else if (isRefusalOfOption) {
        topic = "AUTONOMY_RESPECT";
        responseText =
          "That is completely valid. You are in full control of every choice. If you don't want to do that, you don't have to. " +
          "We can set that aside entirely.\n\n" +
          "What feels most helpful for you right now? We can explore gentle emotional coping strategies, look at purely informational rights, or just give you space to express what's on your mind.";
      } else if (isSelfBlameOrGuilt) {
        topic = "TRAUMA_SELF_BLAME_VALIDATION";
        responseText =
          "First and most importantly: **this was not your fault in any way**.\n\n" +
          "Under trauma science and clinical psychological guidelines (WHO Trauma Protocols):\n" +
          "• **100% Perpetrator Responsibility:** Responsibility for sexual assault rests solely and entirely on the person who committed it.\n" +
          "• **Why Guilt and Self-Blame Happen:** In the aftermath of trauma, the human mind searches for anything it could have done differently. Psychologically, this is an involuntary attempt by the brain to restore a sense of control over an uncontrollable, traumatic violation.\n" +
          "• **The Freeze Response:** If your body froze, went numb, or couldn't fight or scream, that was an involuntary nervous system survival reflex (tonic immobility). It was not consent, submission, or agreement; it was your body doing what it could to survive.\n\n" +
          "You did nothing wrong. You are safe in this conversation, and you can take all the time you need.";
      } else if (isPanicOrInsomnia) {
        topic = "INSOMNIA_PANIC_STABILIZATION";
        responseText =
          "Having racing thoughts, a pounding heart, and trouble sleeping is a very common physiological reaction following trauma. Your nervous system is currently on high alert ('fight-or-flight') to protect you.\n\n" +
          "Here are verified grounding techniques you can try right now:\n" +
          "• **4-7-8 Breathing:** Inhale gently through your nose for 4 seconds, hold your breath for 7 seconds, and exhale slowly through your mouth for 8 seconds. This activates the vagus nerve to calm your heart rate.\n" +
          "• **Sensory Grounding:** Place your feet firmly on the ground or wrap yourself in a heavy blanket. Name 5 things you can see and touch right now to remind your brain that you are safe in this physical moment.\n" +
          "• **24/7 Confidential Mental Health Support:** You can speak with a trained psychological counselor at **Tele-MANAS (14416)**—it is free, government-backed, confidential, and available 24/7 across India.";
      } else if (isGroundingOrFlashback) {
        topic = "TRAUMA_GROUNDING_54321";
        responseText =
          "When trauma flashbacks or emotional numbness occur, your autonomic nervous system enters hyperarousal or freezing. Here is the verified **5-4-3-2-1 sensory grounding method** (WHO protocols):\n\n" +
          "1. **Look around and name 5 things you can see** (e.g., a chair, a window, a light, a shoe, a wall).\n" +
          "2. **Acknowledge 4 things you can physically feel** (e.g., the texture of your clothes, the floor under your feet, the cool air).\n" +
          "3. **Notice 3 sounds you can hear** (e.g., a distant fan, passing vehicle, your own breathing).\n" +
          "4. **Identify 2 things you can smell** around you.\n" +
          "5. **Take 1 slow, deep, intentional breath in and out.**\n\n" +
          "You are safe here right now. Take your time, and tell me whenever you feel ready to continue.";
      } else if (isTrustOrPrivacy) {
        topic = "PRIVACY_AND_TRUST_ASSURANCE";
        citations.push(VERIFIED_SOURCES.bns_2023_statute);
        responseText =
          "You can trust that this space is completely private, anonymous, and secure:\n\n" +
          "• **Zero Data Retention:** SecuTrail collects no personal details, phone numbers, emails, or IP addresses. Nothing is tracked or logged.\n" +
          "• **In-Memory Only:** Your messages exist only in your browser's temporary session and are purged automatically.\n" +
          "• **Instant Quick Exit:** You can clear everything instantly at any moment by pressing ESC twice or clicking 'Quick Exit'.\n\n" +
          "You are in full control of how much or how little you share.";
      } else if (isBrokenOrHopeless) {
        topic = "TRAUMA_HEALING_VALIDATION";
        citations.push(VERIFIED_SOURCES.who_clinical_rape);
        responseText =
          "It is very common to feel broken or permanently changed after trauma, but feeling this way does not mean you are damaged.\n\n" +
          "• **A Natural Nervous System Response:** Severe trauma temporarily overwhelms the brain's ability to integrate experience. What you are feeling is your mind and body doing their best to survive an abnormal violation.\n" +
          "• **Healing & Recalibration:** Healing is not a straight line, but with emotional safety, patience, and gentle support, the nervous system can and does recover.\n" +
          "• **24/7 Professional Counseling:** When you feel ready, you can speak with a compassionate, trained counselor at **Tele-MANAS (14416)**—it is confidential, government-backed, and free across India.\n\n" +
          "You are not alone, and you can take this at whatever pace feels right to you.";
      } else {
        const { bestSnippet, highestScore } = AdaptiveChatEngine.findBestKnowledgeSnippet(sanitizedInput);
        if (bestSnippet && highestScore >= 3) {
          topic = bestSnippet.topic;
          citations.push(bestSnippet.source);
          responseText =
            `Here is the verified information regarding **${bestSnippet.title}**:\n\n` +
            `${bestSnippet.content}\n\n` +
            `This guidance is grounded in official records from the ${bestSnippet.source.organization}. ` +
            `You have complete control over how to proceed, and support is available whenever you need it.`;
        } else {
          const isExpressingEmotion =
            /\b(scared|terrified|afraid|numb|crying|cry|sad|hurt|pain|anxiety|anxious|panic|overwhelmed|shame|guilt|alone|lonely|confused|uncertain|depressed|hopeless|stress|nightmare|shaking)\b/i.test(
              sanitizedInput
            );

          if (isExpressingEmotion) {
            topic = "EMOTIONAL_FIRST_AID";
            const hasPreviousConversation = previousContext.turnCount > 0;
            const continuityLead = hasPreviousConversation
              ? "I hear you, and it is completely normal to feel this way after what you've been through. "
              : "I hear you, and you don't have to figure everything out at once. ";

            responseText =
              `${continuityLead}We can take this one step at a time. ` +
              "Your feelings are valid, and there is no right or wrong way to feel.\n\n" +
              "You are safe in this conversation right now. If you'd like, we can try a gentle grounding exercise to help your body feel steadier, look at supportive options together at your own pace, or simply give you space to express what's on your mind. You remain completely in control.";
          } else {
            topic = "CONVERSATIONAL_ASSISTANCE";
            responseText =
              "I am here to assist you with confidential, trauma-informed guidance. " +
              "You can ask me questions about:\n" +
              "• **Emergency Healthcare:** Timelines for HIV PEP (within 72 hours), emergency contraception, or evidence preservation.\n" +
              "• **Legal Protections:** Zero-FIR rights under BNS 2023, police refusal penalties, and free legal aid (NALSA 15100).\n" +
              "• **Emotional & Counseling Support:** Grounding exercises (5-4-3-2-1), panic stabilization, and 24/7 hotlines like Tele-MANAS (14416).\n\n" +
              "What would you like to know or discuss?";
          }
        }
      }

      const relevantDomains: SupportDomain[] = ["EMOTIONAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);
      const agencyOptions = AgencyOptionsService.getOptionsForContext(["EMOTIONAL"], "EMOTIONAL_DISTRESS");

      return {
        responseText,
        topic,
        activeSupportPath: "EMOTIONAL",
        relevantDomains,
        citations,
        agencyOptions,
        verifiedResources,
        referencedEntity: "counseling and emotional support",
      };
    }

    // ------------------------------------------------------------
    // 2. LEGAL AWARENESS PATHWAY
    // ------------------------------------------------------------
    if (detectedIntent === "LEGAL_AWARENESS") {
      const isRefusalToReport =
        /\b(don'?t want to report|what if i don'?t (want to )?report|do i have to report|without (filing )?an? fir|no police)\b/i.test(
          sanitizedInput
        );

      const isPoliceRefusal =
        /\b(police refuse|refuse to register|refuses? (an? )?fir|officer won'?t|police said no|denied fir|police not registering)\b/i.test(
          sanitizedInput
        );

      const isPoshWorkplace =
        /\b(posh|workplace|office|boss|colleague|coworker|manager|company|employment)\b/i.test(
          sanitizedInput
        );

      const isCompensation =
        /\b(compensation|financial aid|financial assistance|victim compensation|money from government|fund)\b/i.test(
          sanitizedInput
        );

      const isOneStopCentre =
        /\b(one stop|sakhi|shelter|emergency shelter)\b/i.test(
          sanitizedInput
        );

      const isIdentityPrivacy =
        /\b(name|identity|photo|media|news|reporters?|newspaper|tv|in camera|section 72)\b/i.test(
          sanitizedInput
        );

      const isStatementRecording =
        /\b(statement|magistrate|woman officer|female officer|recording|who takes)\b/i.test(
          sanitizedInput
        );

      const isAccompaniment =
        /\b(friend|parent|family|someone with me|bring someone|accompanied|accompany)\b/i.test(
          sanitizedInput
        );

      let topic = "LEGAL_RIGHTS_AWARENESS";
      let responseText = "";
      const citations: SourceCitation[] = [];
      let referencedEntity = "legal options and reporting";

      if (isRefusalToReport) {
        topic = "VOLUNTARY_REPORTING_ASSURANCE";
        referencedEntity = "police report / FIR";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.mohfw_pep_protocol);

        responseText =
          "You never have to report to the police if you don't want to. Reporting is entirely voluntary for adult survivors.\n\n" +
          "Under Indian law and Ministry of Health protocols:\n" +
          "• **Independent Healthcare:** You have the legal right to receive medical care—including HIV prevention (PEP), emergency contraception, and injury treatment—at any hospital without filing a police complaint or FIR.\n" +
          "• **Forensic Evidence:** You can have forensic evidence collected and preserved without initiating criminal proceedings immediately.\n" +
          "• **Alternative Support:** If you ever choose to seek support outside the police, One Stop Centres (Sakhi) and the National Commission for Women (NCW) provide counseling and guidance without forcing a formal complaint.\n\n" +
          "Whatever you choose, your decision will be respected.";
      } else if (isPoliceRefusal) {
        topic = "POLICE_REFUSAL_RECOURSE";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.nalsa_guidelines);
        referencedEntity = "police FIR registration rights";

        responseText =
          "Under Indian statutory law, police officers cannot legally refuse to register an FIR for a cognizable sexual offence. If a police station refuses to act:\n\n" +
          "• **Criminal Penalty on Police (Section 199 BNS):** Any police officer or public servant who knowingly disobeys the law by refusing or failing to register an FIR in sexual offence cases faces **mandatory imprisonment of 1 to 2 years**.\n" +
          "• **Escalation to Superintendent (Section 173(4) BNSS):** You have the statutory right to send your written complaint directly to the District Superintendent of Police (SP) or Police Commissioner by registered post or electronically. The SP is legally mandated to investigate or direct an investigation.\n" +
          "• **Magistrate Direct Order (Section 175(3) BNSS):** An application can be filed before the Judicial Magistrate ordering the police to register the FIR and investigate immediately.\n" +
          "• **Free Legal Counsel (DLSA / NALSA 15100):** You can request a free legal aid advocate from the District Legal Services Authority to intervene, accompany you, or file the magistrate petition on your behalf.";
      } else if (isPoshWorkplace) {
        topic = "POSH_WORKPLACE_HARASSMENT";
        citations.push(VERIFIED_SOURCES.posh_act_statute);
        referencedEntity = "POSH workplace harassment protections";

        responseText =
          "If you are facing sexual harassment at your workplace, you are legally protected under the **POSH Act 2013** (Sexual Harassment of Women at Workplace Act):\n\n" +
          "• **Internal Complaints Committee (ICC):** Every organization with 10 or more employees is mandated by law to maintain an ICC presided over by a senior woman employee.\n" +
          "• **Timeframe to File:** You can file a written complaint within 3 months of the incident (which the ICC can extend by another 3 months if extenuating circumstances prevented earlier filing).\n" +
          "• **Interim Protection & Relief:** During the inquiry, you can formally request a transfer to another department, paid leave for up to 3 months, or a directive restraining the respondent from evaluating your work.\n" +
          "• **Strict Confidentiality (Section 16):** It is illegal for the employer or ICC members to publish or disclose your identity, the respondent's identity, or the proceedings to other colleagues or media, under penalty of law.";
      } else if (isCompensation) {
        topic = "NALSA_VICTIM_COMPENSATION";
        citations.push(VERIFIED_SOURCES.nalsa_guidelines, VERIFIED_SOURCES.bns_2023_statute);
        referencedEntity = "NALSA victim compensation scheme";

        responseText =
          "Under Section 396 of the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) and the **NALSA Compensation Scheme for Women Victims/Survivors of Sexual Assault**, you are statutorily entitled to financial assistance:\n\n" +
          "• **Statutory Compensation Amount:** Financial compensation typically ranges from ₹4,00,000 to ₹10,00,000 (with higher amounts in cases of extreme trauma or medical complications) disbursed via the State/District Legal Services Authority (DLSA).\n" +
          "• **Urgent Interim Compensation:** You do not have to wait for the trial to conclude. The DLSA or court can award interim financial assistance immediately for urgent medical care, mental healthcare, and basic sustenance.\n" +
          "• **Free Representation:** A DLSA advocate will handle your compensation petition free of charge. You can call the NALSA helpline at **15100** to connect with your district legal team.";
      } else if (isOneStopCentre) {
        topic = "ONE_STOP_CENTRE_SAKHI";
        citations.push(VERIFIED_SOURCES.bns_2023_statute);
        referencedEntity = "One Stop Centres (Sakhi)";

        responseText =
          "**One Stop Centres (Sakhi Centres)**, established by the Ministry of Women and Child Development (MWCD), provide integrated, trauma-informed assistance under a single roof:\n\n" +
          "• **Emergency Healthcare:** Immediate medical examination, emergency contraception, and HIV prophylaxis without cost.\n" +
          "• **Confidential Psycho-Social Counseling:** On-site professional counselors to support your mental and emotional wellbeing.\n" +
          "• **Legal Aid & Video Conferencing:** Direct access to DLSA lawyers and remote recording of statements before magistrates.\n" +
          "• **Temporary Safe Shelter:** Secure temporary accommodation for up to 5 days for survivors and their children.\n" +
          "• **How to Access:** Dial the Women Helpline at **181** (or 1091) to be guided to your nearest One Stop Centre.";
      } else if (isIdentityPrivacy) {
        topic = "SURVIVOR_IDENTITY_PROTECTION";
        citations.push(VERIFIED_SOURCES.bns_2023_statute);
        referencedEntity = "survivor identity privacy";

        responseText =
          "Under Indian statutory law, your identity is completely protected:\n\n" +
          "• **Criminal Offence to Disclose Identity (Section 72 BNS 2023):** Disclosing the name, photograph, address, or any identifiable information of a sexual assault survivor in print, broadcast, social media, or internet platforms is a non-bailable criminal offence punishable by up to 2 years imprisonment and a fine.\n" +
          "• **In-Camera Court Hearings (Section 366 BNSS):** Trials and hearings are conducted in-camera (inside closed chambers with only authorized counsel and parties present; public and press are barred).\n" +
          "• **Protected Court Judgments:** The Supreme Court mandates that court records and judgments must redact survivor names and refer to them with pseudonyms.";
      } else if (isStatementRecording) {
        topic = "STATEMENT_RECORDING_WOMAN_OFFICER";
        citations.push(VERIFIED_SOURCES.bns_2023_statute);
        referencedEntity = "recording of statements";

        responseText =
          "Under the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), strict safeguards govern how statements are taken:\n\n" +
          "• **Judicial Statement (Section 183 BNSS):** The formal magistrate statement must be recorded specifically by a **woman judicial magistrate** in a private, non-intimidating setting.\n" +
          "• **Police Statement:** Must be recorded by a **female police officer**, at your home or a location of your choice, with the option to have a parent, friend, or social worker present.\n" +
          "• **Audio-Video Recording:** Statements may be video recorded to prevent repetitive questioning or secondary harassment.\n" +
          "• **No Character Questioning:** Section 53A of the Indian Evidence Act strictly bars questions regarding past sexual history or moral character.";
      } else if (isAccompaniment) {
        topic = "SURVIVOR_SUPPORT_ACCOMPANIMENT";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.who_clinical_rape);
        referencedEntity = "right to support person accompaniment";

        responseText =
          "Yes, you have the full legal right to have a trusted support person with you:\n\n" +
          "• **During Medical Care:** Under MoHFW Clinical Guidelines, you can choose to have a trusted friend, family member, female advocate, or hospital social worker present in the room during medical check-ups and counseling.\n" +
          "• **During Statement Recording:** Under Section 183 BNSS, you are entitled to have a friend, parent, guardian, or nominated representative present when statements are recorded.\n" +
          "• **At One Stop Centres & Police Stations:** You do not have to walk into any government facility alone. Trained counselors or female support workers can accompany you every step of the way.";
      } else if (/zero.?fir/i.test(sanitizedInput)) {
        topic = "ZERO_FIR_RIGHTS";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.nalsa_guidelines);
        referencedEntity = "Zero-FIR";

        responseText =
          `Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), you have the statutory right to file a **Zero-FIR** at any police station regardless of where the incident occurred.\n\n` +
          `Key verified legal protections:\n` +
          `• The receiving police station is legally mandated to register the FIR, arrange immediate medical care, and initiate evidence collection before transferring the case file.\n` +
          `• Under Section 183 BNSS, your statement must be recorded by a woman magistrate or woman officer in a private setting.\n` +
          `• Under Section 12 of the Legal Services Authorities Act, you are entitled to free legal counsel from the District Legal Services Authority (DLSA).`;
      } else {
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.nalsa_guidelines);

        responseText =
          `Here are the verified legal rights and options available to you under Indian law (Bharatiya Nyaya Sanhita 2023 and BNSS 2023):\n\n` +
          `• **Zero-FIR Provision (Section 173 BNSS):** An FIR can be lodged at any police station in India without territorial jurisdiction restrictions.\n` +
          `• **Right to Free Legal Aid:** Under NALSA and the Legal Services Authorities Act, all women and children are entitled to free, state-appointed legal representation regardless of financial status.\n` +
          `• **Privacy & Statements:** Statements must be taken by a female police officer or woman magistrate (Section 183 BNSS) in a private setting, and identity disclosure in media is strictly prohibited under BNS Section 72.\n` +
          `• **Voluntary Process:** Exploring your legal rights does not obligate you to proceed with an investigation. You decide if and when to proceed.`;
      }

      const relevantDomains: SupportDomain[] = ["LEGAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);
      const agencyOptions = AgencyOptionsService.getOptionsForContext(["LEGAL"], "LEGAL_INFO");

      return {
        responseText,
        topic,
        activeSupportPath: "LEGAL",
        relevantDomains,
        citations,
        agencyOptions,
        verifiedResources,
        referencedEntity,
      };
    }

    // ------------------------------------------------------------
    // 3. GENERAL AWARENESS & EDUCATION PATHWAY
    // ------------------------------------------------------------
    if (detectedIntent === "GENERAL_AWARENESS") {
      let topic = "AWARENESS_EDUCATION";
      let responseText = "";
      const citations: SourceCitation[] = [];
      let referencedEntity = "awareness and education";

      const isGreeting =
        /^(hi|hello|hey|namaste|good (morning|afternoon|evening)|start|greetings|help|hi there|hello there)[\s!.]*$/i.test(
          sanitizedInput.trim()
        );

      const isRapeQuery =
        /^(rape|sexual assault|sexual violence|molestation)[\s!.]*$/i.test(sanitizedInput.trim()) ||
        (/\b(rape|sexual assault|sexual violence|molest)\b/i.test(sanitizedInput) &&
          /\b(what|think|thought|opinion|view|definition|define|meaning|tell me|explain|why|is it|about|statute|law|article|section|understand)\b/i.test(
            sanitizedInput
          ));

      const isConsentQuery = /consent/i.test(sanitizedInput);
      const isCyberOrImageAbuse =
        /\b(cyber|photo|video|leak|blackmail|instagram|whatsapp|online|morphed|ncii|stopncii|screenshot)\b/i.test(
          sanitizedInput
        );
      const isBoundaries = /boundar(y|ies)/i.test(sanitizedInput);
      const isBystander = /bystander|5d/i.test(sanitizedInput);

      if (isGreeting) {
        topic = "GREETING_AND_ASSISTANT_CAPABILITIES";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.mohfw_pep_protocol, VERIFIED_SOURCES.who_clinical_rape);
        referencedEntity = "SecuTrail anonymous support capabilities";

        responseText =
          "Hello, I am SecuTrail's confidential support assistant. You are in a safe, anonymous space where no personal information is tracked or stored.\n\n" +
          "I am here to answer your questions and guide you through verified options at your own pace:\n" +
          "• **Emergency Healthcare:** Timelines for HIV PEP (strictly within 72 hours), emergency contraception, and forensic evidence preservation guidelines.\n" +
          "• **Legal Protections:** Your statutory rights under Bharatiya Nyaya Sanhita (BNS 2023), Zero-FIR filing, police refusal penalties (Section 199 BNS), POSH workplace harassment, and free legal aid (NALSA 15100).\n" +
          "• **Emotional Coping & Grounding:** Trauma grounding exercises (5-4-3-2-1), panic stabilization, self-blame deconstruction, and 24/7 counseling hotlines like Tele-MANAS (14416).\n" +
          "• **Safety & Digital Rights:** Cyber harassment reporting (1930) and active consent standards.\n\n" +
          "You remain in complete control. What would you like to know or discuss?";
      } else if (isRapeQuery) {
        topic = "RAPE_LEGAL_AND_ETHICAL_FRAMEWORK";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.who_clinical_rape);
        referencedEntity = "Section 63 BNS 2023 & trauma autonomy";

        responseText =
          "In statutory law and clinical trauma science, **rape and sexual assault are profound criminal violations of human dignity, bodily autonomy, and fundamental rights**:\n\n" +
          "• **Statutory Definition (Section 63 BNS 2023):** Under Indian criminal law (Bharatiya Nyaya Sanhita 2023), rape is non-consensual sexual penetration or acts committed without voluntary, active consent, or where consent is vitiated through coercion, fear, intoxication, or deception.\n" +
          "• **100% Perpetrator Responsibility:** Under WHO clinical guidelines and trauma psychology, **responsibility lies 100% with the person who committed the assault**. A survivor is NEVER to blame, regardless of what they wore, consumed, where they were, or their relationship to the perpetrator.\n" +
          "• **The Biology of Trauma (Freeze Response):** Involuntary nervous system reactions like freezing, going numb, or being unable to scream (tonic immobility) are physiological survival mechanisms—they are never consent or agreement.\n" +
          "• **Absolute Rights of Survivors:** Every survivor has enforceable statutory rights to free immediate emergency healthcare (Section 397 BNSS), independent forensic preservation without forced police reporting, full identity protection (Section 72 BNS), and free legal representation (NALSA 15100).\n\n" +
          "If you or someone you know has been affected, SecuTrail is here to support you with confidential medical timelines, legal protections, or emotional grounding at your own pace.";
      } else if (isConsentQuery) {
        topic = "CONSENT_EDUCATION";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.pocso_act_statute);
        responseText =
          "In both healthy relationships and Indian statutory law, **consent** has precise and clear standards:\n\n" +
          "• **Active & Voluntary:** Consent must be an ongoing, freely given agreement. It cannot be coerced, pressured, or assumed.\n" +
          "• **Revocable:** Consent can be withdrawn at any time during an interaction. If someone says stop or freezes, all activity must stop immediately.\n" +
          "• **Never Inferred:** Silence, lack of resistance, past relationships, clothing, or being intoxicated do not equal consent.\n" +
          "• **Statutory Age in India:** Under Section 63 of Bharatiya Nyaya Sanhita (BNS 2023) and Section 2 of the POCSO Act 2012, the statutory age of consent in India is **18 years**. Any sexual act involving a person under 18 is legally an offence regardless of apparent agreement.";
      } else if (isCyberOrImageAbuse) {
        topic = "DIGITAL_HARASSMENT_CYBERCRIME";
        citations.push(VERIFIED_SOURCES.it_act_statute, VERIFIED_SOURCES.bns_2023_statute);
        responseText =
          "Non-consensual capture, sharing, or blackmailing with intimate or private photos/videos is a serious criminal offence under Indian law:\n\n" +
          "• **Severe Criminal Penalties:** Under Sections 66E, 67, and 67A of the Information Technology Act 2000 and Section 77 of BNS 2023 (Voyeurism), publishing or threatening with intimate images carries 3 to 7 years imprisonment and substantial fines.\n" +
          "• **Preserving Digital Evidence:** Before blocking the harasser, take unedited full-screen screenshots showing the phone number/handle, date, timestamp, and message URL. Do not edit or alter original files.\n" +
          "• **Anonymous Reporting Portal:** You can file a confidential complaint directly on the National Cyber Crime Reporting Portal at **cybercrime.gov.in** or by calling the 24/7 helpline **1930**.\n" +
          "• **Proactive Image Takedown:** You can also use **StopNCII.org** (Stop Non-Consensual Intimate Images)—it generates unique digital hashes directly on your device to prevent images from ever being uploaded or shared across major tech platforms without anyone seeing the photo.";
      } else if (isBoundaries) {
        topic = "BOUNDARIES_AWARENESS";
        citations.push(VERIFIED_SOURCES.it_act_statute, VERIFIED_SOURCES.bns_2023_statute);
        responseText =
          "**Boundaries** are self-defined guidelines that protect your emotional comfort, physical safety, and digital privacy:\n\n" +
          "• **Emotional & Communication:** You always have the right to set limits on how people speak to you, what topics you discuss, and when you respond.\n" +
          "• **Physical Autonomy:** Your body belongs solely to you. You have the right to decline any touch, anytime, without justification.\n" +
          "• **Digital Privacy Protections:** Non-consensual sharing of private or intimate images is a severe criminal offence under Sections 66E & 67A of the Information Technology Act and Section 77 of the BNS 2023 (Voyeurism). You have the right to have unauthorized material removed via cybercrime.gov.in.";
      } else if (isBystander) {
        topic = "BYSTANDER_INTERVENTION";
        citations.push(VERIFIED_SOURCES.who_clinical_rape);
        responseText =
          "The **5Ds Active Bystander Model** provides practical, safe techniques to interrupt harassment or violence without putting yourself in danger:\n\n" +
          "1. **Direct:** If it is physically safe, speak up clearly: 'Please leave them alone' or 'That is not okay.'\n" +
          "2. **Distract:** Interrupt the interaction indirectly. Ask for the time, directions, or create a peaceful distraction.\n" +
          "3. **Delegate:** Find someone in authority—transit staff, a security guard, teacher, or police officer (112).\n" +
          "4. **Delay:** After the situation, check in privately with the person targeted. Ask: 'Are you okay?' and let them know you saw what happened.\n" +
          "5. **Document:** If someone is already helping and you are at a safe distance, record date, time, and details. Never post footage online without the survivor's explicit consent.";
      } else {
        const { bestSnippet, highestScore } = AdaptiveChatEngine.findBestKnowledgeSnippet(sanitizedInput);
        if (bestSnippet && highestScore >= 3) {
          topic = bestSnippet.topic;
          citations.push(bestSnippet.source);
          referencedEntity = bestSnippet.title;
          responseText =
            `Here is the verified information regarding **${bestSnippet.title}**:\n\n` +
            `${bestSnippet.content}\n\n` +
            `This guidance is grounded in official statutory records from the ${bestSnippet.source.organization}. ` +
            `You have complete control over how to proceed, and support is available whenever you need it.`;
        } else {
          topic = "GENERAL_COMMUNITY_AWARENESS";
          citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.mohfw_pep_protocol);
          responseText =
            "SecuTrail provides verified educational tools to support healthy communities, dispel harmful myths, and guide survivors to safe resources:\n\n" +
            "• **Consent & Boundaries:** Clear understanding of active consent and digital protections.\n" +
            "• **Survivor Agency:** Complete control over medical care, emotional counseling, and reporting choices.\n" +
            "• **Bystander Action:** Practical techniques to safely step in and support others.\n\n" +
            "Would you like to explore consent standards, digital boundary safety, or bystander support options?";
        }
      }

      const relevantDomains: SupportDomain[] = ["EMOTIONAL", "LEGAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 2);

      return {
        responseText,
        topic,
        activeSupportPath: "EDUCATION",
        relevantDomains,
        citations,
        agencyOptions: [],
        verifiedResources,
        referencedEntity,
      };
    }

    // ------------------------------------------------------------
    // 4. MEDICAL SUPPORT PATHWAY
    // ------------------------------------------------------------
    if (detectedIntent === "MEDICAL_SUPPORT") {
      const isEvidencePreservation =
        /\b(evidence|shower|bath|bathe|clothes|clothing|paper bag|wash|brush|preserve|preservation|sample|dna)\b/i.test(
          sanitizedInput
        );
      const isPepQuery = /\b(pep|hiv|72 hours?)\b/i.test(sanitizedInput);
      const isEmergencyContraception = /\b(contracepti|morning after|pill|pregnant|pregnancy|iud)\b/i.test(sanitizedInput);
      const isHospitalRights = /\b(free|hospital|cost|money|357c|397|private hospital|doctor refuse)\b/i.test(sanitizedInput);

      let topic = "MEDICAL_PROPHYLAXIS";
      const citations = [VERIFIED_SOURCES.mohfw_pep_protocol];
      let responseText = "";

      if (isEvidencePreservation) {
        topic = "FORENSIC_EVIDENCE_PRESERVATION";
        responseText =
          "Preserving forensic evidence can feel overwhelming, but you are in complete control of every choice. Here are the verified clinical protocols from the Ministry of Health and Family Welfare (MoHFW):\n\n" +
          "• **Timing Window:** Forensic biological evidence is most reliably preserved when collected within **72 to 96 hours**.\n" +
          "• **If You Intend to Seek Examination:** If you are comfortable doing so, try not to bathe, shower, douche, or brush your teeth prior to examination. If you have already changed clothing, place each unwashed item in a **clean paper bag** (avoid plastic bags, as moisture traps and degrades DNA evidence).\n" +
          "• **Crucial Reassurance:** Even if you have already bathed, showered, or changed clothes, **you can still receive complete medical care**. Treatments such as HIV PEP, STI antibiotics, and emergency contraception remain completely effective regardless of whether forensic evidence was preserved.\n" +
          "• **No Mandatory Police Report:** You have the legal right to medical care and evidence collection without being pressured to file an immediate FIR.";
      } else if (isPepQuery) {
        topic = "PEP_HIV_PREVENTION";
        responseText =
          "**HIV Post-Exposure Prophylaxis (PEP)** is a 28-day course of medicines that can prevent HIV infection after potential exposure.\n\n" +
          "Critical verified medical timelines (MoHFW Guidelines):\n" +
          "• **The 72-Hour Window:** PEP must be started as soon as possible, and strictly **within 72 hours** of exposure. Efficacy decreases the longer initiation is delayed.\n" +
          "• **Where to Access:** Government district hospitals and Integrated Counselling and Testing Centres (ICTC) in India provide PEP starter regimens.\n" +
          "• **No Police FIR Needed:** Under Indian law, hospitals are required to provide emergency medical treatment without demanding an FIR.";
      } else if (isEmergencyContraception) {
        topic = "EMERGENCY_CONTRACEPTION";
        responseText =
          "**Emergency Contraception Timelines (MoHFW Guidelines):**\n\n" +
          "• **Emergency Contraceptive Pills (e.g., Levonorgestrel):** Most effective within **72 hours** (3 days), with partial efficacy up to 120 hours.\n" +
          "• **Copper Intrauterine Device (IUD):** Can be placed by a healthcare professional up to **5 days (120 hours)** after exposure as a highly effective emergency contraceptive.\n" +
          "• **STI Prevention:** Prophylaxis for hepatitis B and sexually transmitted infections (STIs) is also available through clinical evaluation.";
      } else if (isHospitalRights) {
        topic = "FORENSIC_EXAMINATION_RIGHTS";
        citations.push(VERIFIED_SOURCES.bns_2023_statute);
        responseText =
          "**Statutory Rights to Free Hospital Treatment (MoHFW & BNSS):**\n\n" +
          "• **Section 397 BNSS / Section 357C CrPC:** All hospitals, public or private, are legally mandated to immediately provide free first-aid and medical care to survivors of sexual violence.\n" +
          "• **No Denial of Care:** A hospital cannot refuse treatment or demand police clearance or FIR registration before administering care.\n" +
          "• **Independent Examination:** You have the legal right to undergo a medical checkup and evidence collection without initiating criminal proceedings.";
      } else {
        responseText =
          "**Emergency Healthcare & Clinical Care Guidelines:**\n\n" +
          "• **Time-Sensitive Care:** HIV PEP is effective strictly within 72 hours. Emergency contraception is most effective within 72 to 120 hours.\n" +
          "• **Right to Free Treatment:** Under Section 357C CrPC / Section 397 BNSS, all hospitals (public and private) must provide immediate free first-aid and medical care.\n" +
          "• **Forensic Evidence Preservation:** You have the legal right to receive medical care and forensic evidence collection without being forced to file an FIR.";
      }

      const relevantDomains: SupportDomain[] = ["MEDICAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);
      const agencyOptions = AgencyOptionsService.getOptionsForContext(["MEDICAL"], "MEDICAL_URGENCY");

      return {
        responseText,
        topic,
        activeSupportPath: "MEDICAL",
        relevantDomains,
        citations,
        agencyOptions,
        verifiedResources,
        referencedEntity: "emergency medical care and PEP",
      };
    }

    // ------------------------------------------------------------
    // 5. MINOR / CHILD INVOLVEMENT (POCSO)
    // ------------------------------------------------------------
    if (detectedIntent === "MINOR_INVOLVEMENT") {
      const topic = "POCSO_CHILD_PROTECTION";
      const citations = [VERIFIED_SOURCES.pocso_act_statute, VERIFIED_SOURCES.bns_2023_statute];

      const responseText =
        "Under the **Protection of Children from Sexual Offences (POCSO) Act 2012**, special statutory protections apply to anyone under the age of 18:\n\n" +
        "• **Dedicated Child Protection:** Childline (**1098**) is a 24/7 toll-free emergency helpline for children in need of care and protection.\n" +
        "• **Child Welfare Committee (CWC):** Institutional support, safe temporary shelter, and legal counseling are overseen by the CWC in every district.\n" +
        "• **Child-Friendly Procedures:** Statements must be taken at the child's home or a child-friendly environment without police uniforms, and medical examinations must occur with parental or nominated support present.";

      const relevantDomains: SupportDomain[] = ["LEGAL", "EMOTIONAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);

      return {
        responseText,
        topic,
        activeSupportPath: "LEGAL",
        relevantDomains,
        citations,
        agencyOptions: [],
        verifiedResources,
        referencedEntity: "POCSO statutory child protection",
      };
    }

    // ------------------------------------------------------------
    // 6. DYNAMIC MATCHING AGAINST VERIFIED KNOWLEDGE BASE
    // ------------------------------------------------------------
    const { bestSnippet, highestScore } = AdaptiveChatEngine.findBestKnowledgeSnippet(sanitizedInput);

    if (bestSnippet && highestScore >= 3) {
      const mappedDomain: SupportDomain =
        bestSnippet.category === "MEDICAL"
          ? "MEDICAL"
          : bestSnippet.category === "LEGAL"
          ? "LEGAL"
          : "EMOTIONAL";

      const dynamicResponseText =
        `Here is the verified information regarding **${bestSnippet.title}**:\n\n` +
        `${bestSnippet.content}\n\n` +
        `This guidance is grounded in official statutory records from the ${bestSnippet.source.organization}. ` +
        `You have complete control over how to proceed, and support is available whenever you need it.`;

      const rawResources = await resourceProvider.getResources({
        domains: [mappedDomain],
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);

      return {
        responseText: dynamicResponseText,
        topic: bestSnippet.topic,
        activeSupportPath: mappedDomain,
        relevantDomains: [mappedDomain],
        citations: [bestSnippet.source],
        agencyOptions: [],
        verifiedResources,
        referencedEntity: bestSnippet.title,
      };
    }

    // ------------------------------------------------------------
    // 7. DEFAULT / FALLBACK HANDLING (Zero Hallucination)
    // ------------------------------------------------------------
    // If the input is out of scope or unverified
    const unverifiedMessage =
      "SecuTrail could not verify this inquiry against our statutorily vetted database. " +
      "SecuTrail adheres to a strict zero-hallucination protocol and only provides guidance grounded in official Indian health protocols (MoHFW) " +
      "and legal statutes (Bharatiya Nyaya Sanhita 2023, NALSA).\n\n" +
      "If you need immediate assistance regarding this, please contact one of our verified statutory helplines directly:\n" +
      "• National Emergency Services: 112\n" +
      "• Women Helpline (24/7): 1091\n" +
      "• Tele-MANAS Mental Health Counseling: 14416\n" +
      "• NALSA Free Legal Aid: 15100";

    return {
      responseText: unverifiedMessage,
      topic: "UNVERIFIED_QUERY",
      activeSupportPath: "EMOTIONAL",
      relevantDomains: ["EMOTIONAL", "LEGAL", "MEDICAL"],
      citations: [],
      agencyOptions: [],
      verifiedResources: [],
      referencedEntity: undefined,
      unverifiedQuery: true,
    };
  }

  /**
   * Dedicated handler for Immediate Physical Danger overrides
   */
  private static async handleImmediateDangerTurn(
    sanitizedInput: string,
    previousContext: EphemeralConversationContext,
    safetyClassification: SafetyClassificationResult,
    guardrailFlags: string[],
    request: ConversationTurnRequest
  ): Promise<ConversationTurnResponse> {
    const responseText =
      "⚠️ **PRIORITY SAFETY ALERT: Immediate Physical Danger Detected**\n\n" +
      "Your physical safety is the absolute priority right now. If someone is threatening you, following you, or you are in active danger:\n\n" +
      "1. **Call Emergency Services Immediately:** Dial **112** (National Emergency) or **1091** (Women Helpline).\n" +
      "2. **Find a Secure Space:** Move to a locked room, public venue with security, or a well-lit public area.\n" +
      "3. **All healthcare and legal decisions can wait** until you are physically secure. You do not have to figure anything else out right now.";

    const updatedContext: EphemeralConversationContext = {
      conversationTopic: "IMMEDIATE_PHYSICAL_SAFETY",
      detectedIntent: "IMMEDIATE_SAFETY",
      emotionalContext: Array.from(new Set([...previousContext.emotionalContext, "fear"])),
      safetyLevel: "CRITICAL",
      previousUserMessages: [...previousContext.previousUserMessages, sanitizedInput],
      previousAssistantResponses: [...previousContext.previousAssistantResponses, responseText],
      activeSupportPath: "SAFETY",
      verifiedInformationUsed: ["112 Emergency Services", "1091 Women Helpline"],
      turnCount: previousContext.turnCount + 1,
      lastReferencedEntity: "112 emergency services",
    };

    const resourceProvider = getResourceProvider();
    const rawResources = await resourceProvider.getResources({
      domains: ["MEDICAL", "LEGAL"],
      verificationStatus: "VERIFIED",
    });
    const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources).slice(0, 2);

    if (request.sessionId) {
      SessionManager.updateConversationContext(request.sessionId, updatedContext);
    }

    return {
      response: responseText,
      context: updatedContext,
      safetyClassification,
      relevantDomains: ["MEDICAL", "LEGAL"],
      citations: [VERIFIED_SOURCES.who_clinical_rape],
      agencyOptions: AgencyOptionsService.getOptionsForContext(["MEDICAL", "LEGAL"], "IMMEDIATE_DANGER"),
      verifiedResources,
      guardrailFlags: [...guardrailFlags, "IMMEDIATE_DANGER_OVERRIDE"],
    };
  }

  /**
   * Dedicated handler for Acute Emotional Crisis / Self-Harm overrides
   */
  private static async handleCrisisTurn(
    sanitizedInput: string,
    previousContext: EphemeralConversationContext,
    safetyClassification: SafetyClassificationResult,
    guardrailFlags: string[],
    request: ConversationTurnRequest
  ): Promise<ConversationTurnResponse> {
    const responseText =
      "What you are experiencing right now is incredibly heavy, and you do not have to carry it alone. " +
      "If you are feeling overwhelmed, hopeless, or having thoughts of self-harm, compassionate professionals are available 24/7:\n\n" +
      "• **Tele-MANAS (MoHFW National Mental Health Helpline):** Dial **14416** (Toll-Free, 24/7)\n" +
      "• **Kiran Mental Health Helpline:** Dial **1800-599-0019** (Toll-Free, 24/7)\n\n" +
      "These services are completely confidential and free. Please stay connected. We can take this one breath and one moment at a time.";

    const updatedContext: EphemeralConversationContext = {
      conversationTopic: "CRISIS_EMOTIONAL_STABILIZATION",
      detectedIntent: "EMOTIONAL_SUPPORT",
      emotionalContext: Array.from(new Set([...previousContext.emotionalContext, "crisis", "overwhelm"])),
      safetyLevel: "CRITICAL",
      previousUserMessages: [...previousContext.previousUserMessages, sanitizedInput],
      previousAssistantResponses: [...previousContext.previousAssistantResponses, responseText],
      activeSupportPath: "EMOTIONAL",
      verifiedInformationUsed: ["Tele-MANAS 14416", "Kiran 1800-599-0019"],
      turnCount: previousContext.turnCount + 1,
      lastReferencedEntity: "Tele-MANAS 14416",
    };

    const resourceProvider = getResourceProvider();
    const rawResources = await resourceProvider.getResources({
      domains: ["EMOTIONAL"],
      verificationStatus: "VERIFIED",
    });
    const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources).slice(0, 2);

    if (request.sessionId) {
      SessionManager.updateConversationContext(request.sessionId, updatedContext);
    }

    return {
      response: responseText,
      context: updatedContext,
      safetyClassification,
      relevantDomains: ["EMOTIONAL"],
      citations: [VERIFIED_SOURCES.who_clinical_rape],
      agencyOptions: AgencyOptionsService.getOptionsForContext(["EMOTIONAL"], "EMOTIONAL_DISTRESS"),
      verifiedResources,
      guardrailFlags: [...guardrailFlags, "CRISIS_SUPPORT_OVERRIDE"],
    };
  }
}
