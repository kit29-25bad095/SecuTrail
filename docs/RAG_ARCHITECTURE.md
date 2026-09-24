# SecuTrail — Verified RAG Architecture

## 1. RAG Workflow

```
User Query ──> Deterministic Safety Filter ──> Intent & Domain Classifier
                                                       │
                                                       ▼
                                            Semantic Vector Retrieval
                                          (Knowledge Base Chunks)
                                                       │
                                                       ▼
                                            Context Assembly & System Prompt
                                          (Strict Citation & Grounding Rules)
                                                       │
                                                       ▼
                                               LLMProvider Generation
                                                       │
                                                       ▼
                                            Output Guardrail Verification
                                          (Check facts & verify phone numbers)
                                                       │
                                                       ▼
                                            Sanitized Response + Citations
```

---

## 2. Knowledge Base Structure
Chunks are curated from official medical guidelines, statutory laws, and crisis intervention protocols:
- **Medical Chunks**: PEP (within 72 hours), Emergency Contraception (within 120 hours), Forensic Examination (evidence preservation, chain of custody).
- **Legal Chunks (India)**: Bharatiya Nyaya Sanhita (BNS) 2023 provisions, POCSO Act 2012, Zero-FIR, Section 357C (mandatory free medical treatment in all hospitals), POSH Act 2013.
- **Emotional Support Chunks**: Grounding exercises (5-4-3-2-1 technique), acute trauma responses, trauma-informed active listening.

---

## 3. Strict Source Attribution
Every AI response MUST cite the verified source chunk ID and title. If no vetted knowledge chunk matches the query with confidence:
> *"SecuTrail could not locate a verified source to answer this question accurately. Please contact a verified helpline or legal professional."*
Hallucinations are strictly disallowed.
