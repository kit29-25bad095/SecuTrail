# SecuTrail — Comprehensive Technical Architecture

## 1. High-Level System Overview

SecuTrail is structured as a full-stack, modular TypeScript application using Next.js 14 App Router, Tailwind CSS, Prisma ORM, and an abstracted AI/RAG engine.

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  Next.js 14 App Router (React Server & Client Components)                       |
|  - Navigation & Persistent SafetyBar with Quick Exit                            |
|  - Awareness Track Module Player & Ephemeral Progress State                     |
|  - Survivor Triage Matrix, Agency Option Cards & Verified Decision Assistant    |
|  - Protected Admin Verification Dashboard                                       |
+---------------------------------------------------------------------------------+
                                      │
                                      ▼
+---------------------------------------------------------------------------------+
|                              API / SERVICE TIER                                 |
|  Next.js Edge & Node Route Handlers (/api/*)                                    |
|                                                                                 |
|  ┌─────────────────────┐   ┌─────────────────────┐   ┌───────────────────────┐  |
|  │   SessionManager    │   │  SafetyClassifier   │   │   SafetyGuardrails    │  |
|  │  (Zero-PII Ephemeral│   │ (Deterministic Risk │   │ (3-Tier Input, Filter,│  |
|  │   30-Min Expiration)│   │  & Crisis Routing)  │   │  Output Sanitizer)    │  |
|  └─────────────────────┘   └─────────────────────┘   └───────────────────────┘  |
|                                                                                 |
|  ┌─────────────────────┐   ┌─────────────────────┐   ┌───────────────────────┐  |
|  │ VerifiedRAGService  │   │ ResourceProvider    │   │ AgencyOptionsService  │  |
|  │(Grounding, Citations│   │ (Demo & Production  │   │ (Non-coercive Balanced│  |
|  │ & BNS 2023 Registry)│   │  Relational Graph)  │   │  Decision Framework)  │  |
|  └─────────────────────┘   └─────────────────────┘   └───────────────────────┘  |
+---------------------------------------------------------------------------------+
                                      │
                                      ▼
+---------------------------------------------------------------------------------+
|                                PERSISTENCE TIER                                 |
|  - Ephemeral Memory Cache: Session tokens & temporary triage in RAM             |
|  - Relational Database: PostgreSQL + Prisma ORM (Zero-PII Survivor Records)     |
|  - Verified Resource & Knowledge Graph: Statutory sources, OSCs, audit logs     |
+---------------------------------------------------------------------------------+
```

---

## 2. The Eight Component Subsystems

### 1. Global Safety Layer
- **Persistent Safety Bar**: Displayed on all Survivor Track routes (`/survivor/*`).
- **Quick Exit**: Non-blocking `window.location.replace(NEXT_PUBLIC_QUICK_EXIT_URL)` with instant client-state wipe (`clearSecuTrailClientState()`).
- **Double ESC Handler**: Window keydown listener executing emergency exit on two ESC presses within ~1000ms.

### 2. Safety & Risk Classifier
- Operates deterministically before LLM invocation.
- Regex and pattern matching for:
  - Immediate Physical Danger (`IMMEDIATE_DANGER` / `CRITICAL` urgency)
  - Self-Harm Risk (`EMOTIONAL_DISTRESS` / `CRITICAL` urgency)
  - Minor Involvement / POCSO (`MINOR_INVOLVEMENT` / `HIGH` urgency)
  - Medical Urgency (`MEDICAL_URGENCY` / `HIGH` urgency)
  - Legal Questions (`LEGAL_INFO` / `MEDIUM` urgency)
- Returns structured flags, urgency rating, emergency routing recommendations, and rationale.

### 3. Multi-Path Triage Engine
- Supports simultaneous evaluation of multiple domains:
  - Medical + Emotional
  - Medical + Legal
  - Medical + Emotional + Legal
- Progressive location consent: State -> District selection without GPS or device tracking.

### 4. Verified RAG Engine
- 9-Stage pipeline: User Input -> Input Guardrail -> Safety Classification -> Domain Resolution -> Chunk Retrieval -> Metadata Filtering -> Grounding -> LLM Synthesis -> Output Guardrail & Citation Generation.
- LLM Provider Abstraction: `MockLLMProvider` (zero credentials needed) and `ProductionLLMProvider` (external API compatible).

### 5. Verified Resource Graph
- Hierarchical models: Organization, Region, State, District, Resource, Service, ResourceVerification, Source.
- Complete canonical national helplines: 112 (National Emergency), 1091 (Women Helpline), 14416 (Tele-MANAS), 15100 (NALSA Legal Aid), 1098 (Childline).
- State and District facilities across Delhi, Maharashtra, Karnataka, Tamil Nadu, and Uttar Pradesh.

### 6. Safety Guardrail Layer
- **Input Guardrails**: Detects critical life threats and masks PII (emails, Indian phone numbers, Aadhaar).
- **Retrieval Guardrails**: Rejects unverified or expired sources.
- **Output Guardrails**: Intercepts victim-blaming, coercive reporting ("You must file an FIR"), dangerous forensic instructions, and false legal certainty.

### 7. Agency-First Decision Layer
- Translates crisis inputs into balanced option cards:
  - What it is
  - Who provides it
  - How to access it
  - Timing considerations (e.g. 72h PEP window)
  - What may happen during the process
  - Potential benefits
  - Potential considerations
  - Official source citations
- Respects survivor autonomy: *"You have options. You choose what feels appropriate for you."*

### 8. Resource Verification Engine (RVE)
- 9-stage verification lifecycle with audit trails.
- Administrative authentication via API key.
- Verification queues for pending audits and upcoming 45/90 day reviews.
