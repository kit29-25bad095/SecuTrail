import { KnowledgeSnippet, SourceCitation } from "@/types";

export const VERIFIED_SOURCES: Record<string, SourceCitation> = {
  mohfw_pep_protocol: {
    id: "src-mohfw-pep",
    title: "National Guidelines for Clinical Management of Sexual Violence",
    organization: "Ministry of Health and Family Welfare (MoHFW), Govt of India",
    url: "https://main.mohfw.gov.in",
    authority: "GOVERNMENT",
    jurisdiction: "India",
    publicationYear: 2022,
    lastVerified: "2026-08-01T00:00:00Z",
    nextReview: "2026-11-01T00:00:00Z",
    contentVersion: "3.2",
    verificationStatus: "VERIFIED",
  },
  bns_2023_statute: {
    id: "src-bns-2023",
    title: "Bharatiya Nyaya Sanhita (BNS 2023) & Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)",
    organization: "Ministry of Law and Justice, Govt of India",
    url: "https://legislative.gov.in",
    authority: "STATUTORY_BODY",
    jurisdiction: "India",
    publicationYear: 2023,
    lastVerified: "2026-08-15T00:00:00Z",
    nextReview: "2026-11-15T00:00:00Z",
    contentVersion: "1.0-Enacted",
    verificationStatus: "VERIFIED",
  },
  nalsa_guidelines: {
    id: "src-nalsa-legal-aid",
    title: "Legal Services Authorities Act (Section 12) & NALSA Compensation Scheme",
    organization: "National Legal Services Authority (Supreme Court of India)",
    url: "https://nalsa.gov.in",
    authority: "STATUTORY_BODY",
    jurisdiction: "India",
    publicationYear: 2024,
    lastVerified: "2026-08-10T00:00:00Z",
    nextReview: "2026-11-10T00:00:00Z",
    contentVersion: "2.1",
    verificationStatus: "VERIFIED",
  },
  who_clinical_rape: {
    id: "src-who-trauma",
    title: "Clinical Management of Rape Survivors: Developing Protocols for Use with Refugees and Internally Displaced Persons",
    organization: "World Health Organization (WHO) & UNHCR",
    url: "https://www.who.int",
    authority: "VETTED_ACADEMIC",
    jurisdiction: "Global / WHO Standard",
    publicationYear: 2020,
    lastVerified: "2026-07-20T00:00:00Z",
    nextReview: "2026-10-20T00:00:00Z",
    contentVersion: "Revised 2020",
    verificationStatus: "VERIFIED",
  },
  pocso_act_statute: {
    id: "src-pocso-2012",
    title: "Protection of Children from Sexual Offences (POCSO) Act, 2012",
    organization: "Ministry of Women and Child Development, Govt of India",
    url: "https://wcd.nic.in",
    authority: "STATUTORY_BODY",
    jurisdiction: "India",
    publicationYear: 2012,
    lastVerified: "2026-08-15T00:00:00Z",
    nextReview: "2026-11-15T00:00:00Z",
    contentVersion: "Amended 2019",
    verificationStatus: "VERIFIED",
  },
  posh_act_statute: {
    id: "src-posh-2013",
    title: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
    organization: "Ministry of Women and Child Development, Govt of India",
    url: "https://wcd.nic.in",
    authority: "STATUTORY_BODY",
    jurisdiction: "India",
    publicationYear: 2013,
    lastVerified: "2026-08-15T00:00:00Z",
    nextReview: "2026-11-15T00:00:00Z",
    contentVersion: "1.0",
    verificationStatus: "VERIFIED",
  },
  it_act_statute: {
    id: "src-it-act-2000",
    title: "Information Technology Act, 2000 (Sections 66E, 67A - Privacy & Digital Evidence)",
    organization: "Ministry of Electronics and Information Technology (MeitY), Govt of India",
    url: "https://meity.gov.in",
    authority: "STATUTORY_BODY",
    jurisdiction: "India",
    publicationYear: 2008,
    lastVerified: "2026-08-15T00:00:00Z",
    nextReview: "2026-11-15T00:00:00Z",
    contentVersion: "Amended 2008",
    verificationStatus: "VERIFIED",
  },
};

export const VERIFIED_KNOWLEDGE_CHUNKS: KnowledgeSnippet[] = [
  // ------------------------------------------------------------
  // MEDICAL KNOWLEDGE CHUNKS
  // ------------------------------------------------------------
  {
    id: "chunk-med-pep-72h",
    topic: "PEP_WINDOW_72H",
    title: "HIV Post-Exposure Prophylaxis (PEP) Timelines",
    content:
      "HIV Post-Exposure Prophylaxis (PEP) is a course of antiretroviral medicines that can prevent HIV infection after potential exposure. PEP MUST be initiated as early as possible and strictly within 72 hours (3 days) of exposure to be effective. Government district hospitals and ICTC (Integrated Counselling and Testing Centres) in India provide PEP starter packs without requiring an FIR.",
    category: "MEDICAL",
    source: VERIFIED_SOURCES.mohfw_pep_protocol,
    isVerified: true,
  },
  {
    id: "chunk-med-emergency-contraception",
    topic: "EMERGENCY_CONTRACEPTION_TIMEFRAME",
    title: "Emergency Contraceptive Timelines",
    content:
      "Emergency contraceptive pills (such as levonorgestrel) are most effective when taken within 72 hours, with declining efficacy up to 120 hours. Copper intrauterine devices (IUDs) can provide emergency contraception up to 5 days (120 hours) after unconsented intercourse when placed by a healthcare provider.",
    category: "MEDICAL",
    source: VERIFIED_SOURCES.mohfw_pep_protocol,
    isVerified: true,
  },
  {
    id: "chunk-med-forensic-rights",
    topic: "FORENSIC_EXAMINATION_RIGHTS",
    title: "Forensic Examination Rights Without Mandatory Police Complaint",
    content:
      "Under Section 357C of the Code of Criminal Procedure / Section 397 Bharatiya Nagarik Suraksha Sanhita (BNSS), all hospitals, public or private, are legally obligated to immediately provide free first-aid and medical treatment to rape survivors. A survivor has the legal right to undergo medical examination and forensic evidence collection without being forced to file an immediate police complaint.",
    category: "MEDICAL",
    source: VERIFIED_SOURCES.mohfw_pep_protocol,
    isVerified: true,
  },

  // ------------------------------------------------------------
  // LEGAL KNOWLEDGE CHUNKS (INDIA-SPECIFIC: BNS 2023)
  // ------------------------------------------------------------
  {
    id: "chunk-leg-zero-fir",
    topic: "ZERO_FIR_PROVISION",
    title: "Right to File a Zero-FIR Regardless of Location",
    content:
      "Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), any police station is legally required to register a First Information Report (FIR) irrespective of territorial jurisdiction if a cognizable sexual offence is reported. This is known as a 'Zero-FIR'. The receiving police station is responsible for initiating urgent medical examination and evidence preservation before transferring the case file to the jurisdictional police station.",
    category: "LEGAL",
    source: VERIFIED_SOURCES.bns_2023_statute,
    isVerified: true,
  },
  {
    id: "chunk-leg-statement-recording",
    topic: "STATEMENT_RECORDING_WOMAN_OFFICER",
    title: "Mandatory Woman Magistrate & Female Police Officer for Statements",
    content:
      "Under Section 183 of the BNSS 2023 (formerly Section 164 CrPC), the survivor's judicial statement must be recorded by a woman magistrate. Police statements must be recorded by a woman police officer, at the survivor's residence or a place of their choice, in the presence of parents, guardian, or a nominated social worker, with mandatory video recording.",
    category: "LEGAL",
    source: VERIFIED_SOURCES.bns_2023_statute,
    isVerified: true,
  },
  {
    id: "chunk-leg-nalsa-free-counsel",
    topic: "NALSA_FREE_LEGAL_AID",
    title: "Statutory Free Legal Aid and Victim Compensation",
    content:
      "Under Section 12 of the Legal Services Authorities Act, 1987, all women and children are entitled to free legal aid from trained advocates appointed by the District Legal Services Authority (DLSA), regardless of income. Survivors are also entitled to apply for interim and final financial compensation under the NALSA Compensation Scheme for Women Victims/Survivors of Sexual Assault.",
    category: "LEGAL",
    source: VERIFIED_SOURCES.nalsa_guidelines,
    isVerified: true,
  },

  // ------------------------------------------------------------
  // EMOTIONAL & TRAUMA STABILIZATION CHUNKS
  // ------------------------------------------------------------
  {
    id: "chunk-emo-grounding",
    topic: "TRAUMA_GROUNDING_54321",
    title: "Neurobiological Grounding & Sensory Re-orientation",
    content:
      "During acute stress and trauma flashbacks, the autonomic nervous system enters hyperarousal or tonic immobility (freezing). The 5-4-3-2-1 sensory method activates the prefrontal cortex: acknowledge 5 things you can see, 4 things you can physically touch, 3 sounds you can hear, 2 scents you can smell, and 1 slow breath.",
    category: "EMOTIONAL",
    source: VERIFIED_SOURCES.who_clinical_rape,
    isVerified: true,
  },
  {
    id: "chunk-emo-secondary-victimization",
    topic: "AVOIDING_SECONDARY_VICTIMIZATION",
    title: "Trauma-Informed Support Principles",
    content:
      "Secondary victimization occurs when support systems, interrogators, or acquaintances subject a survivor to victim-blaming, skepticism, or intrusive moral questioning. Supportive interaction requires unconditional belief, emotional safety, validation of shock symptoms, and absolute respect for survivor agency.",
    category: "EMOTIONAL",
    source: VERIFIED_SOURCES.who_clinical_rape,
    isVerified: true,
  },

  // ------------------------------------------------------------
  // AWARENESS, CONSENT, BOUNDARIES & BYSTANDER CHUNKS
  // ------------------------------------------------------------
  {
    id: "chunk-aware-consent-standards",
    topic: "CONSENT_STANDARDS_AND_AGE",
    title: "Standards of Active Consent and Statutory Age in India",
    content:
      "Active consent is an unambiguous, voluntary, and ongoing agreement to engage in specific sexual activity, which can be freely revoked at any time. Silence, submission, lack of physical protest, intoxication, or marital/dating status do not constitute consent. Under Section 63 of Bharatiya Nyaya Sanhita (BNS 2023) and Section 2(1)(d) of the POCSO Act 2012, the statutory age of consent in India is strictly 18 years. Any sexual act with a person under 18 is legally an offence regardless of mutual agreement.",
    category: "GENERAL",
    source: VERIFIED_SOURCES.bns_2023_statute,
    isVerified: true,
  },
  {
    id: "chunk-aware-boundaries-digital",
    topic: "PERSONAL_AND_DIGITAL_BOUNDARIES",
    title: "Personal Boundaries and Digital Privacy Protections",
    content:
      "Boundaries define personal limits regarding emotional communication, physical space, and digital interactions. In India, non-consensual capture, sharing, or blackmailing with intimate photographs or videos is punishable under Sections 66E and 67A of the Information Technology Act (up to 5 years imprisonment) and Section 77 of the BNS 2023 (Voyeurism). Survivors are advised to preserve digital records (screenshots, sender handles, message URLs) without altering original files before blocking the offender.",
    category: "GENERAL",
    source: VERIFIED_SOURCES.it_act_statute,
    isVerified: true,
  },
  {
    id: "chunk-aware-bystander-5ds",
    topic: "BYSTANDER_INTERVENTION_5DS",
    title: "The 5Ds Active Bystander Intervention Model",
    content:
      "The 5Ds Active Bystander Model provides practical, safe techniques to interrupt harassment or violence: 1. Direct (confronting the harassment directly if physically safe); 2. Distract (creating an indirect diversion, such as asking for transit directions or dropping an item); 3. Delegate (alerting security personnel, transit staff, or bystanders); 4. Delay (checking in with the targeted person afterward to offer quiet support); and 5. Document (safely recording date, time, and details from a distance, then providing the notes to the survivor for their decision).",
    category: "BYSTANDER",
    source: VERIFIED_SOURCES.who_clinical_rape,
    isVerified: true,
  },
  {
    id: "chunk-leg-reporting-avenues",
    topic: "VOLUNTARY_REPORTING_AND_SUPPORT_AVENUES",
    title: "Voluntary Reporting Avenues and Support Portals",
    content:
      "Reporting a sexual offence is entirely voluntary for an adult survivor. Multiple avenues exist: 1. Police Zero-FIR (Section 173 BNSS) at any police station; 2. Internal Complaints Committees (ICC) for workplace harassment under the POSH Act 2013; 3. National Commission for Women (NCW 24/7 Helpline 7827170170); 4. Ministry of Home Affairs Cybercrime Portal (cybercrime.gov.in / 1930); and 5. One Stop Centres (Sakhi) under MWCD providing medical, legal, and counseling services under one roof. Medical treatment and forensic examination at hospitals do not require a mandatory police report.",
    category: "LEGAL",
    source: VERIFIED_SOURCES.bns_2023_statute,
    isVerified: true,
  },
];
