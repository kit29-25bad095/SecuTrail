# SecuTrail — Verified RAG Architecture & Grounding

## 1. Overview
The Verified Retrieval-Augmented Generation (RAG) engine powers the AI Decision Assistant. Unlike standard chatbots that freely synthesize probabilities from public internet text, SecuTrail **restricts generation strictly to vetted statutory and clinical documents**.

---

## 2. Nine-Stage RAG Pipeline

```
[1. User Query]
       ↓
[2. Input Guardrails] (PII Redaction & Crisis Detection)
       ↓
[3. Safety Classification] (Deterministic Emergency Flagging)
       ↓
[4. Query Understanding] (Domain Mapping: Medical / Emotional / Legal)
       ↓
[5. Knowledge Chunk Retrieval] (Topic & Keyword Semantic Matching)
       ↓
[6. Metadata Filtering & Guardrails] (Reject Expired or Unverified Sources)
       ↓
[7. Resource Graph Matching] (Progressive Location Filtering)
       ↓
[8. Grounded LLM Explanation] (Synthesize solely from vetted chunks)
       ↓
[9. Output Guardrails & Citations] (Anti-victim blaming, anti-coercion check)
```

---

## 3. Grounding Knowledge Base & Source Authorities

The current knowledge base is anchored in four primary authorities:

1. **MoHFW National Guidelines for Clinical Management of Sexual Violence (2022)**
   - *Key Guidance*: 72-hour window for HIV Post-Exposure Prophylaxis (PEP); emergency contraception timelines; Section 357C CrPC / 397 BNSS free medical treatment rights without prior FIR.
2. **Bharatiya Nyaya Sanhita (BNS 2023) & Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)**
   - *Key Guidance*: Section 173 BNSS Zero-FIR statutory right; Section 183 BNSS mandatory statement recording by a woman magistrate; Sections 63–79 BNS definitions of sexual offences and consent.
3. **National Legal Services Authority (NALSA) Guidelines**
   - *Key Guidance*: Section 12 Legal Services Authorities Act guaranteeing free legal representation to women and children; NALSA Victim Compensation Scheme.
4. **World Health Organization (WHO) Clinical Management of Rape Protocols**
   - *Key Guidance*: Neurobiological grounding (5-4-3-2-1 technique); preventing secondary victimization; autonomic tonic immobility (freezing) validation.

---

## 4. LLM Abstraction Layer

SecuTrail decouples model providers from business logic using the `LLMProvider` interface:

```typescript
export interface LLMProvider {
  generateGroundedExplanation(options: LLMRequestOptions): Promise<string>;
}
```

- **`MockLLMProvider`**: Zero external credentials required. Performs deterministic, grounded synthesis from verified chunks for evaluation and demo modes.
- **`ProductionLLMProvider`**: Connects to production LLM APIs with strict system prompts enforcing the zero-hallucination and trauma-informed standard.
