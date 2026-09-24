# SecuTrail — Implementation Roadmap & Execution Plan

## Implementation Order & Milestone Plan

### Milestone 1: Foundations & Design System (Phases 1 - 3)
- [x] Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons configuration
- [x] Color system: Calming slate/teal/neutral palette avoiding panic triggers
- [x] Base reusable UI library: Button, Card, Badge, Dialog, Input, Tabs, Alert, SafetyBar
- [x] Landing page with track choice, hero explanation, and clear ethical boundaries

### Milestone 2: Global Safety & Quick Exit Architecture (Phases 5 - 7)
- [x] Omnipresent persistent Quick Exit top safety bar for Survivor Track
- [x] Zero-confirmation instant exit via `window.location.replace()` to neutral destination (`NEXT_PUBLIC_QUICK_EXIT_URL`)
- [x] Double ESC key listener (`useQuickExit`) with ~1s timer window
- [x] Namespaced client-state purge (`secutrail_session`, `secutrail_triage`, etc.)
- [x] Server-side ephemeral session invalidation (`POST /api/session/exit`) without blocking exit
- [x] Accessible HTML anchor fallback for JS-disabled clients
- [x] Honest privacy warning: Explaining browser history, network logs, and device monitoring

### Milestone 3: Interactive Awareness Track (Phase 4)
- [x] 7 Core Educational Modules:
  1. Understanding Sexual Violence & Consent
  2. How Sexual Violence Happens & Recognizing Coercion
  3. Prevention, Boundaries & Self-Control
  4. How to Help & Active Bystander Intervention (5Ds Framework)
  5. Understanding Trauma & Psychological Impact
  6. After an Incident: Immediate Care & Practical Realities
  7. India-Specific Legal Literacy (BNS 2023, Zero-FIR, POCSO, NALSA)
- [x] Interactive quizzes, myth vs. reality reveals, and scenario simulations
- [x] Ephemeral progress tracking (zero-account requirement)

### Milestone 4: Safety & Risk Classifier and Triage Engine (Phases 8 - 10)
- [x] Deterministic Rule Engine for immediate crisis detection (immediate violence, self-harm, minor involvement, medical urgency)
- [x] Multi-path simultaneous triage matrix: Medical + Emotional + Legal
- [x] Trauma-informed, agency-preserving user interface

### Milestone 5: Verified Resource Graph & Verification Engine (Phases 11, 12, 19)
- [x] Hierarchical Schema: Organization -> Region -> State -> District -> Resource -> Service
- [x] Progressive location consent (National resources by default; optional State -> District drilldown)
- [x] ResourceCard component with verified badges, operating hours, authority tiers, and direct actions
- [x] 9-stage verification lifecycle with audit trails and automated expiry flags

### Milestone 6: Verified RAG & Safety Guardrails (Phases 13 - 15)
- [x] KnowledgeDocument and KnowledgeChunk schema with source verification
- [x] 3-tier safety guardrails: Input guardrail (PII/crisis detection), Retrieval guardrail (verification check), Output guardrail (anti-blaming, non-coercive, anti-hallucination)
- [x] LLM Abstraction Layer (`LLMProvider`: `MockLLMProvider` and `ProductionLLMProvider`)
- [x] Citation generation referencing official sources (BNS 2023, MoHFW, NALSA, WHO)

### Milestone 7: Agency-First Decision Layer & AI Assistant (Phases 16 - 18)
- [x] Non-prescriptive option cards with pros, timing considerations, and what to expect
- [x] Structured AI Assistant interface: Risk Class -> Paths -> Verified Knowledge -> Resources -> Agency Options
- [x] Complete separation between general legal/medical information and professional advice

### Milestone 8: Admin Dashboard, Privacy Center & Hardening (Phases 20 - 25)
- [x] Protected Admin Dashboard: Resource directory, verification queues, audit logs, feedback triage
- [x] Privacy Center (`/privacy`) detailing exact data boundaries and threat models
- [x] Security hardening: Input sanitization, rate limiting, secure headers, zero sensitive log policy
- [x] Full WCAG 2.1 AA accessibility audit: Keyboard navigation, high contrast, screen reader labels

### Milestone 9: Demo Mode, Automated Testing & Documentation (Phases 26 - 30)
- [x] Comprehensive demonstration data with explicit visual "DEMO DATA" badges
- [x] Automated test suite: Safety classification, triage combinations, RAG filtering, Quick Exit, session cleanup
- [x] Complete technical documentation suite (README, ARCHITECTURE, DATABASE, API, RAG, SECURITY, PRIVACY, QUICK-EXIT, RESOURCE-VERIFICATION, DEMO, DEVELOPMENT)
