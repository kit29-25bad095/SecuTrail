# SecuTrail — Page Map

| Route | Page Name | Primary Purpose | Key Components |
|---|---|---|---|
| `/` | Landing & Intake Hub | Hero, Dual-Track introduction, Quick Exit notice, Mission statement | `Hero`, `TrackSelectorCard`, `SafetyBar`, `HowItWorksSection` |
| `/awareness` | Awareness Dashboard | Prevention education overview & progress tracking | `ModuleGrid`, `ProgressSummary`, `CategoryFilter` |
| `/awareness/understanding-violence` | Module 1: Understanding Sexual Violence | Consent, boundaries, definition of spectrum of abuse | `InteractiveLesson`, `ConsentQuiz`, `MythBuster` |
| `/awareness/how-it-happens` | Module 2: How Sexual Violence Happens | Power dynamics, digital harassment, coercion patterns | `ScenarioSimulation`, `RedFlagsChecklist` |
| `/awareness/prevention-control` | Module 3: Prevention & Self-Control | Emotional regulation, peer accountability, healthy relationships | `ReflectionCard`, `PersonalCommitmentTool` |
| `/awareness/bystander-intervention` | Module 4: Bystander Intervention | 5Ds framework (Direct, Distract, Delegate, Delay, Document) | `InteractiveBystanderSim`, `DecisionTree` |
| `/awareness/understanding-impact` | Module 5: Understanding Impact | Trauma responses, neurobiology of trauma, supporting others | `TraumaResponseExplainer`, `DosAndDonts` |
| `/awareness/after-incident` | Module 6: After an Incident | Immediate physical steps, evidence preservation, support options | `TimelineGuide`, `PreservationChecklist` |
| `/awareness/legal-literacy` | Module 7: India-Specific Legal Literacy | POCSO, BNS 63-79 / IPC 376, Zero-FIR, POSH Act | `LawPlainLanguageCard`, `FAQAccordion` |
| `/survivor` | Survivor Intake & Safety Check | "Are you currently in a safe place?" screening | `ImmediateSafetyPrompt`, `EmergencyHotlineModal` |
| `/survivor/immediate` | Immediate Emergency Support | Critical actions, emergency dialers (112, 1091, 14416) | `DirectDialerList`, `SafeExitGuide` |
| `/survivor/triage` | Structured Triage Hub | Guided assessment across Medical, Emotional, Legal | `TriageQuestionnaire`, `DomainBadge` |
| `/survivor/assistant` | Verified RAG AI Assistant | Confidential conversational Q&A with verified citations | `ChatInterface`, `SourceCitationBox`, `AgencyDisclaimer` |
| `/survivor/plan` | Survivor Decision Plan | Non-directive personalized action checklist & resource pack | `ActionChecklist`, `ExportPurgeControls` |
| `/resources` | Verified Resource Explorer | Geo-aware search for hospitals, shelters, legal aid, helplines | `ResourceFilters`, `GeoLocationPrompt`, `ResourceCardList` |
| `/resources/[id]` | Resource Detail Profile | Operating hours, verified badge level, directions, services | `VerificationBadge`, `ContactButtons`, `AuditHistory` |
| `/admin` | Resource Verification Dashboard | NGO/Facility vetting, status updates, audit logs | `VerificationQueueTable`, `StatusUpdateModal`, `AuditLogView` |
| `/privacy` | Privacy Architecture & Guarantees | Explanation of ephemeral sessions, zero-tracking, data rights | `PrivacyPledgeCard`, `ThreatModelFAQ` |
| `/how-it-works` | Architectural Transparency | Visual breakdown of the 8 core layers and deterministic safety | `ArchitectureDiagram`, `VerificationCriteria` |
