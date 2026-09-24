# SecuTrail — Product Requirements Document (PRD)

## 1. Executive Summary
**SecuTrail** is a privacy-first, verified AI decision-support platform designed to eliminate the fog of misinformation, fear, and fragmented support surrounding sexual violence and abuse.
Built under the guiding principle:
> **"Verified information. Private support. Your choice."**

SecuTrail bridges the critical gap between prevention awareness and survivor support through two complementary missions:
1. **Awareness Track**: Proactive, interactive educational modules covering consent, boundary recognition, bystander intervention (5Ds framework), and legal literacy.
2. **Survivor Track**: Non-directive, trauma-informed triage (Medical, Emotional, Legal), verified RAG-assisted guidance, geo-targeted verified resources, and agency-first decision support.

---

## 2. Core Problem & Product Mission
### 2.1 The Problem
- **Awareness Gap**: Limited societal and individual understanding of boundaries, consent nuances, and warning signs.
- **Misinformation & Myths**: Cultural myths, conflicting internet advice, and hearsay prevent timely intervention.
- **Scattered & Unvetted Information**: Medical timelines (e.g., 72h PEP window, forensic examination protocol), legal rights (zero-FIR, POCSO, BNS), and emotional support are scattered across unverified websites.
- **Fear of Exposure & Privacy Concerns**: Survivors and individuals fear search history exposure, surveillance, social stigma, or forced reporting.
- **Lost Autonomy**: Generic support or helpline systems often prescribe actions rather than presenting clear, user-led choices.

### 2.2 The SecuTrail Solution
SecuTrail provides a calm, accessible web portal where:
- Users explore educational content anonymously without an account.
- In-crisis users receive instant immediate safety checks, emergency hotline routing, and deterministic safety protection.
- AI assistance is constrained by deterministic safety rules and grounded solely in verified knowledge chunks.
- An omnipresent **Quick Exit** mechanism instantly purges transient state and redirects to neutral platforms (e.g., Google Weather).

---

## 3. Key User Personas
1. **The Proactive Learner (Student / Youth)**: Wants clear, myth-free education on consent, healthy relationships, and actionable bystander intervention strategies without feeling judged.
2. **The Person in Immediate Danger**: Needs immediate, zero-friction guidance on moving to safety, contacting trusted contacts, or dialing emergency responders.
3. **The Survivor Seeking Clarity**: Looking for confidential answers on medical care (STI/HIV prophylaxis, forensic exam steps), emotional stabilization, and legal rights without being pressured to report.
4. **The Ally / Bystander**: Witnessed or learned about an incident and needs structured advice on supporting someone respectfully and safely.
5. **The Community Resource Auditor (Admin)**: Verifies shelter capacity, helpline operating hours, NGO credentials, and updates the verified resource graph.

---

## 4. Product Principles
- **Survivor Agency First**: The system never tells a user "You must report to the police" or "You must do this now". It outlines options, timelines, and implications, empowering the user to make their own choices.
- **Deterministic Rules Where Safety Matters**: Immediate danger keywords and crisis states trigger hard-coded priority responses, bypassing probabilistic LLM generation.
- **Zero-PII Footprint**: No compulsory login, no tracking cookies, ephemeral session keys stored in memory only, and instant cache/history purging.
- **Verified Sources Only**: All health, legal, and crisis contact data is verified by administrators with clear verification tier badges (Government, Vetted NGO, Community Verified).
