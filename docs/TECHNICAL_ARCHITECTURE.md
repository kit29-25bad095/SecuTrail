# SecuTrail — Technical Architecture

## 1. High-Level System Architecture

```
                                  SECUTRAIL
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
             AWARENESS TRACK                     SURVIVOR TRACK
                     │                                 │
           Prevention & Education            Immediate Safety Check
                     │                                 │
           Interactive Modules               ┌─────────┴─────────┐
                     │                       ▼                   ▼
           Client-Side Progress         [EMERGENCY]         [SAFE NOW]
                                             │                   │
                                      Emergency Hotlines   Triage Engine
                                                         (Med / Emo / Leg)
                                                                 │
                                                           Verified RAG
                                                                 │
                                                          Resource Graph
                                                                 │
                                                         Safety Guardrails
                                                                 │
                                                        Agency-First Layer
                                                                 │
                                                      Survivor-Led Action
```

---

## 2. Eight Core Components

### 2.1 Global Safety Layer
- **Omnipresent Quick Exit**: Sticky desktop and mobile exit buttons. Pressing `Escape` key twice triggers immediate redirection.
- **Safe Redirection**: Automatically replaces browser history with an innocuous URL (`https://weather.com` or `https://www.google.com/search?q=weather+today`).
- **History Wipe & Purge**: Clears session storage, clears local storage state, and triggers `location.replace()`.

### 2.2 Safety & Risk Classifier
- Operates on user input before invoking generative models.
- Uses deterministic regex and keyword pattern matching for active self-harm, suicidal ideation, or immediate physical assault.
- Immediately short-circuits to emergency crisis numbers (National Emergency 112, Women Helpline 1091, Tele-MANAS 14416).

### 2.3 Triage Engine
- Multi-dimensional categorizer routing survivor needs:
  - **Medical**: Physical trauma, STI/HIV prophylaxis (PEP within 72 hours), emergency contraception (within 120 hours), forensic examination requirements (preservation of evidence).
  - **Emotional**: Immediate panic/shock de-escalation, grounding exercises, professional trauma counseling, support groups.
  - **Legal**: Understanding Zero-FIR, Section 63-79 of Bharatiya Nyaya Sanhita (BNS) / Section 376 IPC, POCSO provisions, protection orders, and free legal aid through NALSA/SLSA.

### 2.4 Verified RAG Engine
- Knowledge base of verified legal, medical, and psychological guides stored as semantic chunks.
- Vector search retrieves relevant context strictly from vetted documents.
- Prompts constrain responses to cite verified sources and avoid medical or legal diagnosis.

### 2.5 Verified Resource Graph
- Structured entities: Organization, Type (Hospital, Police, Crisis Center, Legal Aid, Shelter), Location (Geo coordinates, City, State, Country), Contacts, Availability (24/7, Hours), Verification Tier.
- Allows geo-distance calculation and filtering by service capabilities.

### 2.6 Safety Guardrail Layer
- Dual-pass guardrail validation:
  1. **Pre-generation**: Classifies intent, filters malicious prompts or jailbreak attempts.
  2. **Post-generation**: Scans output for prescriptive commands ("You must..."), hallucinated emergency numbers, or victim-blaming language. Replaces or appends safety disclaimers.

### 2.7 Agency-First Decision Layer
- Translates RAG answers into non-directive decision cards.
- Provides objective Pros, Considerations, Timelines, and "What to Expect" for each pathway.
- Leaves decision ownership 100% in the hands of the survivor.

### 2.8 Resource Verification Engine
- Resource lifecycle management: `UNVERIFIED` -> `PENDING_REVIEW` -> `VERIFIED` -> `EXPIRED`.
- Multi-tier verification levels (Tier 1: Official/Govt, Tier 2: Vetted NGO, Tier 3: Community Verified).
- Verification audit log capturing verifier ID, check date, and evidence notes.

---

## 3. Technology Stack & Integration
- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide icons.
- **Backend**: Next.js Server Actions & API Routes (`/api/triage`, `/api/chat`, `/api/resources`, `/api/verify`).
- **Database & ORM**: PostgreSQL with Prisma ORM, supporting `pgvector` for semantic indexing.
- **Abstraction Layers**:
  - `LLMProvider`: `MockLLMProvider` (local deterministic fallback) & `ProductionLLMProvider` (pluggable cloud AI).
  - `ResourceProvider`: `DemoResourceProvider` (instant verified dataset) & `ProductionResourceProvider` (dynamic DB client).
