export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScenarioChoice {
  action: string;
  consequence: string;
  isRecommended: boolean;
  strategyUsed?: string; // e.g. "5Ds: Distract", "5Ds: Delegate", "5Ds: Direct"
}

export interface InteractiveScenario {
  id: string;
  title: string;
  situation: string;
  dilemma: string;
  choices: ScenarioChoice[];
}

export interface MythVsReality {
  myth: string;
  reality: string;
  detailedContext: string;
}

export interface AwarenessModule {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  estimatedMinutes: number;
  overview: string;
  keyTakeaways: string[];
  myths: MythVsReality[];
  scenarios: InteractiveScenario[];
  quizzes: {
    question: string;
    options: QuizOption[];
  }[];
  reflectionPrompt: string;
  legalFramework?: {
    statute: string;
    section: string;
    explanation: string;
  }[];
}

export const AWARENESS_MODULES: AwarenessModule[] = [
  {
    id: "understanding-sexual-violence",
    number: 1,
    title: "Understanding Sexual Violence & Consent",
    shortDescription: "Core definitions, spectrum of violations, enthusiastic consent, and bodily autonomy.",
    estimatedMinutes: 6,
    overview:
      "Sexual violence is an umbrella term encompassing any non-consensual sexual act, attempt to obtain a sexual act, unwanted sexual comments or advances, or acts to traffic or otherwise direct sexual acts against someone's sexuality using coercion. It is fundamentally an abuse of power, control, and entitlement, rather than about desire or romance.",
    keyTakeaways: [
      "Consent must be freely given, reversible, informed, enthusiastic, and specific (FRIES model).",
      "Silence, passivity, freezing, or lack of physical resistance does NOT equal consent.",
      "Intoxication impairs legal and cognitive capacity to give valid consent.",
      "Prior consent or an existing relationship never grants blanket consent for future acts.",
    ],
    myths: [
      {
        myth: "If someone didn't fight back or scream, it wasn't non-consensual.",
        reality: "Freezing is an involuntary neurological survival mechanism.",
        detailedContext:
          "Neurobiology confirms that during severe trauma or danger, the nervous system often triggers tonic immobility (freezing) rather than fight-or-flight. Freezing is an automatic instinct to minimize physical harm, not consent.",
      },
      {
        myth: "Consent given at the start cannot be revoked midway.",
        reality: "Consent is an ongoing dialogue and can be withdrawn at any second.",
        detailedContext:
          "Any party has the absolute right to pause, change their mind, or stop an activity at any time. Once consent is withdrawn, continuing the act constitutes a violation under both ethics and law.",
      },
    ],
    scenarios: [
      {
        id: "sc-1-1",
        title: "The Ambiguous Silence",
        situation:
          "Pooja and Karan are dating. While together at Karan's apartment, Karan initiates physical intimacy. Pooja looks away, goes quiet, does not lean in, but does not verbally say 'No'.",
        dilemma: "What is the respectful and safe course of action for Karan?",
        choices: [
          {
            action: "Assume silence means acceptance and continue unless she explicitly objects.",
            consequence:
              "Unsafe and coercive. Silence and withdrawal of engagement are indicators of discomfort or freezing.",
            isRecommended: false,
          },
          {
            action: "Pause immediately, step back gently, and ask: 'I notice you seem quiet. Are you comfortable with this?'",
            consequence:
              "Correct and trauma-informed. Enthusiastic consent requires affirmative engagement. Pausing honors autonomy.",
            isRecommended: true,
          },
          {
            action: "Get visibly frustrated and demand to know why she is ruining the mood.",
            consequence:
              "Coercive behavior. Emotional guilt-tripping undermines free will and is a form of boundary violation.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "Which of the following describes affirmative, valid consent?",
        options: [
          {
            text: "The person didn't say no or pull away physically.",
            isCorrect: false,
            explanation: "Absence of 'no' is not consent; affirmative 'yes' through mutual enthusiastic engagement is required.",
          },
          {
            text: "Clear, freely given, sober, and revocable verbal and non-verbal agreement.",
            isCorrect: true,
            explanation: "Consent must always be freely chosen, sober, informed, and ongoing.",
          },
          {
            text: "Consent agreed to on a previous date.",
            isCorrect: false,
            explanation: "Consent is specific to the exact moment and act; past consent never carries forward automatically.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "Consider a time when someone respected your subtle boundaries without you having to raise your voice. How did that impact your sense of safety and trust?",
  },
  {
    id: "how-violence-happens",
    number: 2,
    title: "How Sexual Violence Happens & Recognizing Coercion",
    shortDescription: "Grooming, psychological manipulation, power differentials, and boundary erosion.",
    estimatedMinutes: 8,
    overview:
      "Sexual violence rarely occurs in a vacuum. Most perpetrators are known to the survivor (acquaintances, colleagues, partners, authority figures). Violations often begin with subtle boundary testing, emotional manipulation, isolation, or the weaponization of social and workplace power dynamics.",
    keyTakeaways: [
      "Coercion includes guilt-tripping, wear-down tactics, threats of social exclusion, and professional leverage.",
      "Perpetrators often test boundaries with small violations (jokes, invading personal space) before escalating.",
      "Digital coercion (demanding intimate photos, tracking location) is a recognized form of abuse.",
      "Substance-facilitated assault leverages incapacitation to circumvent consent.",
    ],
    myths: [
      {
        myth: "Most assaults are committed by strangers in dark alleyways.",
        reality: "Over 85% of sexual violence is perpetrated by someone known to the survivor.",
        detailedContext:
          "Statistical data from NCRB and global agencies consistently shows that violations occur predominantly within known circles—friends, dates, spouses, mentors, or colleagues—where social trust is exploited.",
      },
    ],
    scenarios: [
      {
        id: "sc-2-1",
        title: "Workplace Hierarchy & Favors",
        situation:
          "A senior project manager implies to a junior associate that a coveted performance rating and promotion depend on attending private late-night dinners.",
        dilemma: "How should this conduct be recognized and addressed?",
        choices: [
          {
            action: "Recognize this as textbook sexual harassment and workplace coercion (POSH Act violation).",
            consequence:
              "Accurate recognition. Leveraging appraisal or employment terms for personal compliance is prohibited under the POSH Act 2013.",
            isRecommended: true,
          },
          {
            action: "Assume it's normal networking and comply to avoid career sabotage.",
            consequence:
              "Coercive grooming often relies on victims feeling trapped by professional consequences.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "What is 'boundary erosion' in the context of relationship abuse?",
        options: [
          {
            text: "Gradually introducing minor boundary infringements to test compliance before escalating.",
            isCorrect: true,
            explanation: "Boundary erosion normalizes discomfort step-by-step so the target feels less able to resist larger violations.",
          },
          {
            text: "A mutual agreement to be more open.",
            isCorrect: false,
            explanation: "Erosion is unilateral and manipulative, not a mutually agreed healthy boundary change.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "What are healthy ways to express discomfort when you notice someone subtly testing your boundaries or those of a friend?",
  },
  {
    id: "prevention-and-self-control",
    number: 3,
    title: "Prevention, Boundaries & Self-Control",
    shortDescription: "Cultivating respect, managing rejection, addressing toxic peer pressure, and self-accountability.",
    estimatedMinutes: 7,
    overview:
      "Primary prevention requires shifting focus from 'how to avoid being targeted' to 'how to act with integrity, self-control, and respect.' Every individual is responsible for honoring boundaries, taking 'no' with dignity, and checking peer behaviors that normalize misogyny or entitlement.",
    keyTakeaways: [
      "Rejection is normal; responding with anger, persistence, or entitlement is predatory behavior.",
      "Check your own assumptions: never assume someone's clothing, dancing, or friendliness is an invitation for sexual touch.",
      "Holding peers accountable stops normalization of harm before it escalates.",
      "Alcohol does not excuse or diminish personal culpability for boundary violations.",
    ],
    myths: [
      {
        myth: "If someone is being friendly and drinking with you, they are giving implicit consent.",
        reality: "Friendliness and social drinking are never substitutes for explicit consent.",
        detailedContext:
          "Assuming social warmth implies sexual willingness violates basic bodily autonomy. Being intoxicated reduces cognitive capacity, making affirmative consent impossible.",
      },
    ],
    scenarios: [
      {
        id: "sc-3-1",
        title: "Handling Rejection at a Social Event",
        situation:
          "Rohan asks a college classmate to dance. She politely declines with 'No thank you, I'm catching up with friends.' Rohan's friends tease him to 'not give up so easily and be persistent.'",
        dilemma: "What should Rohan do?",
        choices: [
          {
            action: "Accept the refusal gracefully: 'No problem, enjoy your evening' and tell friends to drop it.",
            consequence:
              "Demonstrates respect, emotional maturity, and de-escalates harmful peer pressure.",
            isRecommended: true,
          },
          {
            action: "Keep cornering her throughout the party to prove his persistence.",
            consequence:
              "Persistent pursuit after a clear refusal transforms into harassment and intimidation.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "When someone says 'I'm not ready for this right now', the correct response is:",
        options: [
          {
            text: "Argue and explain why they shouldn't feel that way.",
            isCorrect: false,
            explanation: "Arguing is a form of pressure and disrespects personal boundaries.",
          },
          {
            text: "Stop immediately, validate their boundary, and ensure they feel safe and comfortable.",
            isCorrect: true,
            explanation: "Respecting boundaries instantly and without guilt-tripping is the fundamental standard of care.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "How do you personally handle feeling rejected or told 'no'? What internal self-talk helps you remain calm and respectful?",
  },
  {
    id: "bystander-intervention-5ds",
    number: 4,
    title: "How to Help: Active Bystander Intervention (5Ds)",
    shortDescription: "Evidence-based 5Ds framework: Direct, Distract, Delegate, Delay, and Document.",
    estimatedMinutes: 10,
    overview:
      "Active bystanders disrupt the continuum of violence. You do not need to be aggressive or risk personal harm to make a difference. The globally recognized 5Ds methodology provides five distinct, safe intervention strategies.",
    keyTakeaways: [
      "Direct: Call out the behavior directly if it is safe to do so.",
      "Distract: Create an interruption to de-escalate the tension (e.g. ask for directions, spill a drink).",
      "Delegate: Find someone with authority (security, staff, trusted friend) to step in.",
      "Delay: Check in on the person after the incident to offer support and validation.",
      "Document: Record what is happening if safe, only sharing with the survivor's consent.",
    ],
    myths: [
      {
        myth: "Bystander intervention always requires physical confrontation or risking your safety.",
        reality: "Subtle interventions like 'Distract' and 'Delegate' are often the safest and most effective.",
        detailedContext:
          "Interrupting by simply asking 'Excuse me, where is the exit?' or alerting event staff breaks the aggressor's focus without escalating into violence.",
      },
    ],
    scenarios: [
      {
        id: "sc-4-1",
        title: "The Unwanted Cab Ride Pressure",
        situation:
          "At an office gathering, you notice an intoxicated colleague being steered toward a cab by another employee who is sober, while she is murmuring that she wants to wait for her sister.",
        dilemma: "Which 5Ds strategy can you deploy safely right now?",
        choices: [
          {
            action: "DISTRACT & DELEGATE: Walk over, say 'Hey, her sister just called me looking for her, let's wait together in the lobby' and alert the venue manager.",
            consequence:
              "De-escalates immediately, separates the vulnerable individual without violence, and introduces third-party accountability.",
            isRecommended: true,
            strategyUsed: "5Ds: Distract & Delegate",
          },
          {
            action: "Mind your own business because it might cause workplace drama.",
            consequence:
              "Passive bystander effect enables assault. Staying silent when someone is incapacitated leaves them unprotected.",
            isRecommended: false,
          },
        ],
      },
      {
        id: "sc-4-2",
        title: "Harassment on Public Transit",
        situation:
          "On a metro train, a person is leaning into a seated passenger, blocking her way and making persistent comments while she looks distressed and trapped.",
        dilemma: "How do you intervene without triggering a violent altercation?",
        choices: [
          {
            action: "DISTRACT: Stand near them, make eye contact with the passenger, and ask: 'Excuse me, is this the train to Rajiv Chowk? Can I sit next to you?'",
            consequence:
              "Breaks the perpetrator's isolation tactic, offers an exit avenue, and signals that others are watching.",
            isRecommended: true,
            strategyUsed: "5Ds: Distract",
          },
          {
            action: "DELAY: Wait until the station and ask the passenger if they are okay and need help reporting to metro security.",
            consequence:
              "Valuable secondary support that validates the passenger and provides institutional reporting assistance.",
            isRecommended: true,
            strategyUsed: "5Ds: Delay",
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "Which of the 5Ds involves checking in with the affected person after an uncomfortable incident?",
        options: [
          {
            text: "Direct",
            isCorrect: false,
            explanation: "Direct happens in real-time addressing the aggressor.",
          },
          {
            text: "Delay",
            isCorrect: true,
            explanation: "Delay involves following up after the moment: 'Are you okay? Can I walk with you? Do you need support?'",
          },
          {
            text: "Document",
            isCorrect: false,
            explanation: "Document involves recording evidence safely.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "Which of the 5Ds (Direct, Distract, Delegate, Delay, Document) aligns most comfortably with your personality and conflict style?",
  },
  {
    id: "understanding-impact",
    number: 5,
    title: "Understanding Trauma & Psychological Impact",
    shortDescription: "Trauma neurobiology, acute stress vs PTSD, hypervigilance, and avoiding secondary victimization.",
    estimatedMinutes: 7,
    overview:
      "Trauma affects the body and brain. Reactions vary drastically: from tears and panic to emotional numbness, laughter, or matter-of-fact detachment. Understanding these physiological mechanisms prevents harmful judgment and victim-blaming.",
    keyTakeaways: [
      "There is no 'correct' or 'predictable' way to react to trauma.",
      "The brain's amygdala and prefrontal cortex respond by prioritizing immediate survival, which can scramble memory sequencing.",
      "Secondary victimization occurs when friends, family, or institutions question, blame, or dismiss the survivor.",
      "Healing is non-linear and requires emotional safety and autonomy.",
    ],
    myths: [
      {
        myth: "If someone acts calm or laughs afterwards, they weren't really traumatized.",
        reality: "Numbness, dissociation, and nervous laughter are recognized shock responses.",
        detailedContext:
          "The autonomic nervous system uses dissociation to insulate the psyche from overwhelming terror. Emotional flatlining is a clinical indicator of shock.",
      },
    ],
    scenarios: [
      {
        id: "sc-5-1",
        title: "A Friend Confides in You",
        situation:
          "A friend tells you: 'Something happened last night at the party. I don't remember all the details clearly, and I feel numb.'",
        dilemma: "What is the most supportive and trauma-informed response?",
        choices: [
          {
            action: "'I believe you, and I am here with you. You don't have to explain every detail right now. We can take this one step at a time.'",
            consequence:
              "Validates their reality, lowers panic, and preserves their agency without interrogation.",
            isRecommended: true,
          },
          {
            action: "'Why were you drinking so much? Why didn't you leave earlier with me?'",
            consequence:
              "Secondary trauma / victim-blaming. Shifts fault to the survivor and causes emotional withdrawal and self-blame.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "Why might a survivor struggle to recall chronological details immediately after an assault?",
        options: [
          {
            text: "High stress hormones (cortisol, adrenaline) disrupt hippocampus memory consolidation.",
            isCorrect: true,
            explanation: "Neurobiological flood of adrenaline prevents the brain from filing memories in neat sequential order.",
          },
          {
            text: "They are making it up.",
            isCorrect: false,
            explanation: "Memory fragmentation is a hallmark physiological symptom of severe trauma, not deceit.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "How can you train yourself to replace judgmental reflex questions ('Why did you...') with supportive validation ('I am here for you...')?",
  },
  {
    id: "after-an-incident",
    number: 6,
    title: "After an Incident: Immediate Care & Practical Realities",
    shortDescription: "72-hour medical windows (PEP, emergency contraception), forensic care rights, and evidence preservation.",
    estimatedMinutes: 9,
    overview:
      "The hours following an incident involve sensitive decisions. Knowing about medical prophylaxis windows (such as HIV PEP within 72 hours), forensic options, and hospital duties empowers informed, timely choices.",
    keyTakeaways: [
      "HIV Post-Exposure Prophylaxis (PEP) is most effective when initiated within 72 hours of potential exposure.",
      "Emergency contraception is effective within 72 to 120 hours depending on the method.",
      "In India, government and private hospitals are legally mandated to provide free emergency medical treatment without requiring prior police FIR.",
      "Forensic evidence collection does NOT force you to pursue immediate criminal prosecution.",
    ],
    myths: [
      {
        myth: "A hospital will turn you away unless you have already registered a police FIR.",
        reality: "Section 357C CrPC / BNSS mandates immediate, free medical care to rape survivors without prior FIR.",
        detailedContext:
          "Hospitals are legally required to provide immediate medical treatment and forensic examination. The survivor cannot be made to wait for police registration before receiving urgent healthcare.",
      },
    ],
    scenarios: [
      {
        id: "sc-6-1",
        title: "The 48-Hour Decision Window",
        situation:
          "It has been 36 hours since an incident. The individual is overwhelmed and unsure if they ever want to go to court or deal with police, but is worried about infections.",
        dilemma: "What practical information helps clarify their choice?",
        choices: [
          {
            action: "Prioritize medical health right now: visit a hospital for PEP and emergency contraception within the 72-hour window. Emphasize that seeking medical care does not obligate them to file criminal charges.",
            consequence:
              "Protects long-term physical health, relieves medical anxiety, and keeps legal options open without forced reporting.",
            isRecommended: true,
          },
          {
            action: "Tell them they cannot see a doctor unless they are ready to sit in a police station all day.",
            consequence:
              "Factually incorrect and dangerous. Medical care is a non-negotiable right independent of criminal litigation.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "What is the critical medical window for starting HIV Post-Exposure Prophylaxis (PEP)?",
        options: [
          {
            text: "Within 72 hours (the earlier, the more effective)",
            isCorrect: true,
            explanation: "PEP must be started as soon as possible and strictly within 72 hours to prevent HIV replication.",
          },
          {
            text: "Within 2 weeks",
            isCorrect: false,
            explanation: "After 72 hours, PEP is no longer clinically effective.",
          },
          {
            text: "Only after test results come back in a month",
            isCorrect: false,
            explanation: "PEP is emergency prophylaxis and is started proactively before antibody tests develop.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "Why is separating urgent medical care from the decision to report to police crucial for survivor safety and well-being?",
  },
  {
    id: "india-legal-literacy",
    number: 7,
    title: "India-Specific Legal Literacy: BNS 2023, Zero-FIR & Rights",
    shortDescription: "Bharatiya Nyaya Sanhita (BNS 2023), One Stop Centres (OSC / Sakhi), Zero-FIR rights, and NALSA legal aid.",
    estimatedMinutes: 9,
    overview:
      "Navigating the Indian legal system requires awareness of modern statutory protections. Under the Bharatiya Nyaya Sanhita (BNS 2023) and Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), survivors have affirmative legal rights designed to prevent secondary harassment.",
    keyTakeaways: [
      "Zero-FIR: You can file an FIR at ANY police station regardless of where the incident occurred; it must be transferred to the jurisdictional station.",
      "Statement Recording: Under Section 183 BNSS (formerly 164 CrPC), statements must be recorded by a woman magistrate, with a female police officer present at the victim's residence or choice.",
      "One Stop Centres (OSC / Sakhi): Integrated centres across India offering medical, legal aid, police assistance, and psycho-social counseling under one roof.",
      "Free Legal Aid: Under Section 12 of the Legal Services Authorities Act, all women and children are entitled to free legal representation through NALSA/DLSA.",
    ],
    legalFramework: [
      {
        statute: "Bharatiya Nyaya Sanhita (BNS 2023)",
        section: "Sections 63–79",
        explanation:
          "Defines sexual offences with strict definitions of consent, heightened penalties, and explicit inclusion of deceitful means (such as false promises of marriage under Section 69).",
      },
      {
        statute: "Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)",
        section: "Section 173 (Zero-FIR)",
        explanation:
          "Codifies the right to lodge an FIR at any police station without territorial jurisdiction limitations.",
      },
      {
        statute: "Legal Services Authorities Act 1987",
        section: "Section 12",
        explanation:
          "Guarantees free legal counsel to every woman and child regardless of income level.",
      },
    ],
    myths: [
      {
        myth: "If the incident happened in another city or state, the local police station can refuse to register your complaint.",
        reality: "Police stations CANNOT refuse a complaint; they are required to register a Zero-FIR.",
        detailedContext:
          "Supreme Court mandates and Section 173 BNSS make refusal to register a Zero-FIR a punishable offence for police personnel.",
      },
    ],
    scenarios: [
      {
        id: "sc-7-1",
        title: "Understanding Free Legal Representation",
        situation:
          "A college student with no independent income wants to understand her rights regarding a stalker who is threatening to leak morphed photos, but fears she cannot afford a lawyer.",
        dilemma: "What legal resource is available under statutory guarantee?",
        choices: [
          {
            action: "Connect with the District Legal Services Authority (DLSA / NALSA) or a One Stop Centre for a designated free legal aid advocate.",
            consequence:
              "Section 12 of the Legal Services Authorities Act guarantees free legal services and counsel without charge.",
            isRecommended: true,
          },
          {
            action: "Assume legal protection is only for wealthy individuals and suffer in silence.",
            consequence:
              "Deprives the survivor of government-funded statutory aid and specialized cyber-crime reporting channels.",
            isRecommended: false,
          },
        ],
      },
    ],
    quizzes: [
      {
        question: "What is a 'Zero-FIR' under Indian criminal law?",
        options: [
          {
            text: "An FIR that results in zero penalties.",
            isCorrect: false,
            explanation: "Zero-FIR is a jurisdictional procedural mechanism, not a trial outcome.",
          },
          {
            text: "An FIR registered at any police station irrespective of territorial jurisdiction, assigned number '0' and transferred later.",
            isCorrect: true,
            explanation: "Zero-FIR ensures timely investigation and medical preservation without delays caused by police boundary disputes.",
          },
        ],
      },
    ],
    reflectionPrompt:
      "How does understanding statutory protections (like Zero-FIR and One Stop Centres) change a community's capacity to demand dignified treatment?",
  },
];
