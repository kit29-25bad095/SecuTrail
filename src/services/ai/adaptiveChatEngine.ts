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
import { VERIFIED_SOURCES } from "@/services/rag/verifiedKnowledgeBase";
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

    // 5. Follow-up: "What are my options?"
    if (/\b(what are my options|what options do i have|what can i do)\b/i.test(text)) {
      if (context.activeSupportPath === "LEGAL") return "LEGAL_AWARENESS";
      if (context.activeSupportPath === "MEDICAL") return "MEDICAL_SUPPORT";
      return "EMOTIONAL_SUPPORT";
    }

    // 6. Explicit Medical Requests
    if (
      /\b(medical|pep|prep|hiv|sti|contracepti|hospital|doctor|bleeding|injury|fracture|morning after|pill)\b/i.test(
        text
      )
    ) {
      return "MEDICAL_SUPPORT";
    }

    // 7. Explicit Awareness & Education Requests (Consent, Boundaries, Bystander)
    if (
      /\b(what is consent|meaning of consent|define consent|consent mean|boundar(y|ies)|bystander|5ds|common myths)\b/i.test(
        text
      )
    ) {
      return "GENERAL_AWARENESS";
    }

    // 8. Explicit Legal Requests
    if (
      /\b(legal|rights|fir|zero fir|police|complaint|court|lawyer|bns|ipc|section|nalsa|dlsa|posh|counsel)\b/i.test(
        text
      )
    ) {
      return "LEGAL_AWARENESS";
    }

    // 9. Emotional Expressions
    if (
      /\b(scared|terrified|afraid|numb|crying|sad|anxiety|anxious|panic|overwhelmed|shame|guilt|alone|lonely|confused|uncertain)\b/i.test(
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
    if (/\b(numb|frozen|blank)\b/i.test(text)) currentEmotions.push("numbness");
    if (/\b(overwhelmed|too much|cannot take it)\b/i.test(text)) currentEmotions.push("overwhelm");
    if (/\b(anxious|anxiety|panic|shaking)\b/i.test(text)) currentEmotions.push("anxiety");
    if (/\b(sad|crying|hopeless|depressed)\b/i.test(text)) currentEmotions.push("sadness");
    if (/\b(shame|guilt|my fault|embarrassed)\b/i.test(text)) currentEmotions.push("shame");
    if (/\b(confused|uncertain|don'?t know what to do)\b/i.test(text)) currentEmotions.push("uncertainty");
    if (/\b(don'?t want to tell|secret|private|hide)\b/i.test(text)) currentEmotions.push("hesitation_to_disclose");

    // Combine with previous emotional context (deduplicated)
    return Array.from(new Set([...context.emotionalContext, ...currentEmotions])).slice(-5);
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

      let responseText = "";
      let topic = "EMOTIONAL_COPING";

      if (isDisclosureHesitation) {
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
      } else {
        topic = "EMOTIONAL_FIRST_AID";
        // Connect with previous messages if continuity exists
        const hasPreviousConversation = previousContext.turnCount > 0;
        const continuityLead = hasPreviousConversation
          ? "It sounds like you're carrying a lot right now, and it is completely normal to feel this way after what you've been through. "
          : "It sounds like you're dealing with a lot right now. You don't have to figure everything out at once. ";

        responseText =
          `${continuityLead}We can take this one step at a time. ` +
          "Your feelings are valid, and there is no right or wrong way to feel.\n\n" +
          "If you'd like, you can tell me more about what you're experiencing, or we can look at supportive options together at your own pace. You remain completely in control.";
      }

      const relevantDomains: SupportDomain[] = ["EMOTIONAL"];
      const rawResources = await resourceProvider.getResources({
        domains: relevantDomains,
        state,
        district,
        verificationStatus: "VERIFIED",
      });
      const verifiedResources = SafetyGuardrails.filterRetrievedResources(rawResources, state, district).slice(0, 3);

      const groundingCitation = VERIFIED_SOURCES.who_clinical_rape;
      const agencyOptions = AgencyOptionsService.getOptionsForContext(["EMOTIONAL"], "EMOTIONAL_DISTRESS");

      return {
        responseText,
        topic,
        activeSupportPath: "EMOTIONAL",
        relevantDomains,
        citations: [groundingCitation],
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
      } else {
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.nalsa_guidelines);

        // Check if query is about Zero-FIR, legal aid, or general options
        if (/zero.?fir/i.test(sanitizedInput)) {
          topic = "ZERO_FIR_RIGHTS";
          responseText =
            `Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), you have the statutory right to file a **Zero-FIR** at any police station regardless of where the incident occurred.\n\n` +
            `Key verified legal protections:\n` +
            `• The receiving police station is legally mandated to register the FIR, arrange immediate medical care, and initiate evidence collection before transferring the case file.\n` +
            `• Under Section 183 BNSS, your statement must be recorded by a woman magistrate or woman officer in a private setting.\n` +
            `• Under Section 12 of the Legal Services Authorities Act, you are entitled to free legal counsel from the District Legal Services Authority (DLSA).`;
        } else {
          responseText =
            `Here are the verified legal rights and options available to you under Indian law (Bharatiya Nyaya Sanhita 2023 and BNSS 2023):\n\n` +
            `• **Zero-FIR Provision (Section 173 BNSS):** An FIR can be lodged at any police station in India without territorial jurisdiction restrictions.\n` +
            `• **Right to Free Legal Aid:** Under NALSA and the Legal Services Authorities Act, all women and children are entitled to free, state-appointed legal representation regardless of financial status.\n` +
            `• **Privacy & Statements:** Statements must be taken by a female police officer or woman magistrate (Section 183 BNSS) in a private setting, and identity disclosure in media is strictly prohibited under BNS Section 72.\n` +
            `• **Voluntary Process:** Exploring your legal rights does not obligate you to proceed with an investigation. You decide if and when to proceed.`;
        }
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

      if (/consent/i.test(sanitizedInput)) {
        topic = "CONSENT_EDUCATION";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.pocso_act_statute);
        responseText =
          "In both healthy relationships and Indian statutory law, **consent** has precise and clear standards:\n\n" +
          "• **Active & Voluntary:** Consent must be an ongoing, freely given agreement. It cannot be coerced, pressured, or assumed.\n" +
          "• **Revocable:** Consent can be withdrawn at any time during an interaction. If someone says stop or freezes, all activity must stop immediately.\n" +
          "• **Never Inferred:** Silence, lack of resistance, past relationships, clothing, or being intoxicated do not equal consent.\n" +
          "• **Statutory Age in India:** Under Section 63 of Bharatiya Nyaya Sanhita (BNS 2023) and Section 2 of the POCSO Act 2012, the statutory age of consent in India is **18 years**. Any sexual act involving a person under 18 is legally an offence regardless of apparent agreement.";
      } else if (/boundar(y|ies)/i.test(sanitizedInput)) {
        topic = "BOUNDARIES_AWARENESS";
        citations.push(VERIFIED_SOURCES.it_act_statute, VERIFIED_SOURCES.bns_2023_statute);
        responseText =
          "**Boundaries** are self-defined guidelines that protect your emotional comfort, physical safety, and digital privacy:\n\n" +
          "• **Emotional & Communication:** You always have the right to set limits on how people speak to you, what topics you discuss, and when you respond.\n" +
          "• **Physical Autonomy:** Your body belongs solely to you. You have the right to decline any touch, anytime, without justification.\n" +
          "• **Digital Privacy Protections:** Non-consensual sharing of private or intimate images is a severe criminal offence under Sections 66E & 67A of the Information Technology Act and Section 77 of the BNS 2023 (Voyeurism). You have the right to have unauthorized material removed via cybercrime.gov.in.";
      } else if (/bystander|5d/i.test(sanitizedInput)) {
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
        topic = "GENERAL_COMMUNITY_AWARENESS";
        citations.push(VERIFIED_SOURCES.bns_2023_statute, VERIFIED_SOURCES.mohfw_pep_protocol);
        responseText =
          "SecuTrail provides verified educational tools to support healthy communities, dispel harmful myths, and guide survivors to safe resources:\n\n" +
          "• **Consent & Boundaries:** Clear understanding of active consent and digital protections.\n" +
          "• **Survivor Agency:** Complete control over medical care, emotional counseling, and reporting choices.\n" +
          "• **Bystander Action:** Practical techniques to safely step in and support others.\n\n" +
          "Would you like to explore consent standards, digital boundary safety, or bystander support options?";
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
        referencedEntity: "awareness and education",
      };
    }

    // ------------------------------------------------------------
    // 4. MEDICAL SUPPORT PATHWAY
    // ------------------------------------------------------------
    if (detectedIntent === "MEDICAL_SUPPORT") {
      const isPepQuery = /\b(pep|hiv|72 hours?)\b/i.test(sanitizedInput);
      const isEmergencyContraception = /\b(contracepti|morning after|pill|pregnant|pregnancy)\b/i.test(sanitizedInput);

      let topic = "MEDICAL_PROPHYLAXIS";
      const citations = [VERIFIED_SOURCES.mohfw_pep_protocol];
      let responseText = "";

      if (isPepQuery) {
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
    // 6. DEFAULT / FALLBACK HANDLING (Zero Hallucination)
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
