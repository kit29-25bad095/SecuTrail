import { AgencyDecisionOption, SupportDomain, RiskCategory } from "@/types";

export interface IAgencyOptionsService {
  getOptionsForContext(
    domains: SupportDomain[],
    riskCategory?: RiskCategory
  ): AgencyDecisionOption[];
}

export class AgencyOptionsService implements IAgencyOptionsService {
  public getOptionsForContext(
    domains: SupportDomain[],
    riskCategory?: RiskCategory
  ): AgencyDecisionOption[] {
    return AgencyOptionsService.getOptionsForContext(domains, riskCategory);
  }

  /**
   * Generates trauma-informed, balanced decision options based on selected domains and risk level
   */
  public static getOptionsForContext(
    domains: SupportDomain[],
    riskCategory?: RiskCategory
  ): AgencyDecisionOption[] {
    const options: AgencyDecisionOption[] = [];

    // Option A: Emergency Immediate Assistance (Always present if danger detected, or as first emergency choice)
    if (riskCategory === "IMMEDIATE_DANGER") {
      options.push({
        id: "opt-emergency",
        letter: "A",
        title: "Immediate Physical Safety & Emergency Dispatch",
        category: "EMERGENCY",
        summary: "Prioritize reaching physical safety and contacting official emergency responders (112 / 1091).",
        whatItIs: "Emergency police or rescue dispatch to your physical location to secure your immediate environment.",
        whoProvidesIt: "Police Emergency Response Support System (112) or Women Helpline (1091).",
        howToAccess: "Call 112 from a safe, locked location. If speaking is unsafe, silent emergency calls or SMS to 112 are supported in India.",
        timingConsiderations: "Immediate (within minutes). Do not delay if an active physical threat exists.",
        whatMayHappen: [
          "Emergency dispatchers will ask for your current location and whether weapons are involved.",
          "An emergency patrol van (PCR / ERSS) will be dispatched to secure the area.",
          "Paramedics may be dispatched if injuries require immediate triage.",
        ],
        potentialBenefits: [
          "Removes you from immediate physical danger or confinement.",
          "Establishes official presence to deter further violence.",
        ],
        potentialConsiderations: [
          "Involves formal police presence which can feel overwhelming.",
          "Family or neighbors may become aware of emergency vehicle arrivals.",
        ],
        sources: ["Ministry of Home Affairs ERSS Standard Operating Procedures"],
      });
    }

    // Option B: Medical Care First (Preserve health, PEP window)
    if (domains.includes("MEDICAL") || !riskCategory || riskCategory === "MEDICAL_URGENCY") {
      options.push({
        id: "opt-medical-first",
        letter: options.length === 0 ? "A" : "B",
        title: "Medical Care & Prophylaxis First",
        category: "MEDICAL",
        summary: "Prioritize physical health: HIV prophylaxis (PEP), emergency contraception, and wound care without pressure to report.",
        whatItIs: "Clinical evaluation, preventive medication against HIV/STIs, and optional forensic sample collection.",
        whoProvidesIt: "Government District Hospitals, One Stop Centres (Sakhi), or Private Hospitals.",
        howToAccess: "Visit the emergency / casualty ward of any hospital. You can bring a trusted friend or go directly.",
        timingConsiderations: "HIV PEP is effective within 72 hours (3 days). Emergency contraception is effective within 72-120 hours. Sooner is always better.",
        whatMayHappen: [
          "A medical doctor will conduct a private health checkup and examine any injuries.",
          "You will be offered emergency contraception and a starter pack of antiretroviral PEP pills.",
          "You can choose whether or not to preserve forensic samples for legal use later.",
        ],
        potentialBenefits: [
          "Prevents HIV transmission and unwanted pregnancy.",
          "Under Indian law (Section 357C CrPC / 397 BNSS), treatment is free and DOES NOT require an FIR.",
          "Leaves legal options open for the future without committing you right now.",
        ],
        potentialConsiderations: [
          "PEP medication course requires daily adherence for 28 days and may cause mild initial nausea.",
          "Hospitals are required to notify police medico-legal departments, but cannot force you to give a statement.",
        ],
        sources: [
          "MoHFW National Guidelines for Clinical Management of Sexual Violence",
          "Section 357C CrPC / 397 BNSS",
        ],
      });
    }

    // Option C: Emotional Support & Crisis Counseling
    if (domains.includes("EMOTIONAL") || riskCategory === "EMOTIONAL_DISTRESS") {
      options.push({
        id: "opt-emotional-counseling",
        letter: options.length === 0 ? "A" : options.length === 1 ? "B" : "C",
        title: "Confidential Emotional Support & Grounding",
        category: "EMOTIONAL",
        summary: "Speak with a trained counselor anonymously to process feelings, reduce panic, and regain equilibrium.",
        whatItIs: "Trauma-informed psychological first aid, suicide prevention counseling, or support group connection.",
        whoProvidesIt: "Tele-MANAS (14416), Kiran (1800-599-0019), or vetted trauma counseling NGOs.",
        howToAccess: "Call 14416 toll-free 24/7. No registration, identification, or fees required.",
        timingConsiderations: "Available anytime. Can be accessed immediately or days, weeks, or years after an incident.",
        whatMayHappen: [
          "A compassionate listener will listen without judgment or interruption.",
          "They will guide you through grounding exercises if you are experiencing flashbacks or panic.",
          "They can help you organize your thoughts if you feel overwhelmed by decisions.",
        ],
        potentialBenefits: [
          "100% confidential and non-directive.",
          "Helps de-escalate acute emotional shock, numbness, or shame.",
          "No legal or police involvement whatsoever.",
        ],
        potentialConsiderations: [
          "Talking about trauma can sometimes trigger temporary emotional fatigue; you can pause or hang up anytime.",
        ],
        sources: [
          "National Tele Mental Health Programme (Tele-MANAS)",
          "WHO Psychological First Aid Guidelines",
        ],
      });
    }

    // Option D: Legal Information & Free Counsel (No forced FIR)
    if (domains.includes("LEGAL") || riskCategory === "LEGAL_INFO") {
      options.push({
        id: "opt-legal-counsel",
        letter: String.fromCharCode(65 + options.length),
        title: "Confidential Legal Consultation & Rights Review",
        category: "LEGAL",
        summary: "Consult an advocate to understand your statutory rights (BNS 2023, Zero-FIR, POCSO) before taking any formal action.",
        whatItIs: "Privileged legal consultation to evaluate evidence, explore remedies, or prepare a written complaint if you decide to proceed.",
        whoProvidesIt: "District Legal Services Authority (DLSA / NALSA) or One Stop Centre legal counselors.",
        howToAccess: "Call NALSA helpline 15100 or visit your local District Court legal aid clinic.",
        timingConsiderations: "No statute of limitation on serious sexual offences under BNS, but earlier consultation assists in preserving evidence.",
        whatMayHappen: [
          "An advocate explains the exact legal provisions (e.g. BNS Sections 63-79).",
          "They explain how a Zero-FIR works and what statement recording involves.",
          "They review whether you wish to seek interim financial compensation from the state.",
        ],
        potentialBenefits: [
          "Free legal representation for women and children under Section 12 LSA Act.",
          "You learn your rights before speaking to the police.",
          "The advocate can accompany you so you are not alone at the police station.",
        ],
        potentialConsiderations: [
          "Court processes in India can involve procedural delays.",
          "Understanding the legal system requires candid discussion of sensitive facts with your lawyer.",
        ],
        sources: [
          "Legal Services Authorities Act, 1987",
          "Bharatiya Nyaya Sanhita (BNS 2023)",
          "NALSA Compensation Scheme",
        ],
      });
    }

    // Option E: One Stop Centre (All three combined)
    if (domains.length >= 2 || options.length < 3) {
      options.push({
        id: "opt-osc-combined",
        letter: String.fromCharCode(65 + options.length),
        title: "Integrated One Stop Centre (Sakhi) Support",
        category: "COMBINED",
        summary: "Access medical care, counseling, temporary shelter, and legal guidance simultaneously under one roof.",
        whatItIs: "Government-supported crisis center designed to prevent survivors from having to visit multiple separate offices.",
        whoProvidesIt: "Ministry of Women & Child Development (One Stop Centre Scheme).",
        howToAccess: "Dial 181 or visit the One Stop Centre located in your district hospital premises.",
        timingConsiderations: "Open 24/7 for emergency shelter and medical referrals.",
        whatMayHappen: [
          "You are welcomed into a safe, secure room with a female case manager.",
          "Medical examination and counseling are conducted on-site.",
          "Temporary stay of up to 5 days is available if you need immediate physical respite.",
        ],
        potentialBenefits: [
          "Holistic support: Medical + Legal + Emotional + Shelter coordinated in one place.",
          "Female staff and trauma-informed environment.",
          "Free services funded by the Nirbhaya Fund.",
        ],
        potentialConsiderations: [
          "Center staff are required to document the visit, though your privacy is safeguarded by strict confidentiality norms.",
        ],
        sources: [
          "MWCD One Stop Centre Scheme Guidelines",
          "Nirbhaya Framework",
        ],
      });
    }

    return options;
  }
}

let agencyOptionsInstance: IAgencyOptionsService | null = null;
export function getAgencyOptionsService(): IAgencyOptionsService {
  if (!agencyOptionsInstance) {
    agencyOptionsInstance = new AgencyOptionsService();
  }
  return agencyOptionsInstance;
}
