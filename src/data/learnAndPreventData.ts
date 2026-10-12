export interface MythVsRealItem {
  id: string;
  statement: string;
  correctAnswer: "Myth" | "Real";
  feedbackCorrect: string;
  feedbackIncorrect: string;
  realityTitle: string;
  realityExplanation: string;
  whatToRemember: string;
  learnMoreTopicId?: string;
  topicLabel: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  consequences: string;
  analysis: string;
  isSupportive: boolean;
  takeaway: string;
}

export interface BranchingScenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface RevealCardItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tag: string;
  explanation: string;
  practicalTakeaway: string;
  readTime: string;
}

export interface MicroQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  takeaway: string;
}

export interface MicroQuizActivity {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: MicroQuizQuestion[];
}

export interface AudioLesson {
  id: string;
  title: string;
  category: string;
  durationEstimate: string;
  conciseSummary: string;
  fullTranscript: string;
}

export interface TopicLibraryItem {
  id: string;
  title: string;
  category:
    | "Consent & Boundaries"
    | "Healthy Relationships"
    | "Recognizing Warning Signs"
    | "Digital Safety"
    | "Supporting Others"
    | "Finding Trustworthy Help";
  description: string;
  estimatedMinutes: number;
  isVerifiedStatutory: boolean;
  authorityOrSource?: string;
  jurisdiction?: string;
  lastReviewed?: string;
  sourceUrl?: string;
  keyTakeaways: string[];
  recommendedActivity: "myth-real" | "scenario" | "reveal" | "quiz" | "listen";
}

// ============================================================
// 1. MYTH VS REAL FLIP-CARD QUIZ DATA (6 Original Statements)
// ============================================================
export const MYTH_VS_REAL_QUESTIONS: MythVsRealItem[] = [
  {
    id: "mvr-1",
    statement: "If someone really cares about you, they will never pressure you into doing something you are unsure about.",
    correctAnswer: "Myth",
    feedbackCorrect: "That's right! Genuine care should never require pressure.",
    feedbackIncorrect: "Not quite. Let's explore why.",
    realityTitle: "Healthy relationships respect personal boundaries.",
    realityExplanation:
      "Care includes active listening, respecting personal choices, and accepting boundaries without conditions. While partners can make mistakes, repeated pressure, guilt-tripping, or treating refusal as an insult is controlling behavior, not an expression of love.",
    whatToRemember: "You deserve to have your boundaries respected, always.",
    learnMoreTopicId: "boundaries-autonomy",
    topicLabel: "Healthy Relationships",
  },
  {
    id: "mvr-2",
    statement: "Consent given in an existing relationship or marriage is permanent and never needs to be reaffirmed.",
    correctAnswer: "Myth",
    feedbackCorrect: "Exactly right! Consent must always be ongoing, specific, and voluntary.",
    feedbackIncorrect: "Not quite. Consent is never a blanket contract.",
    realityTitle: "Consent is ongoing, specific, and reversible at any moment.",
    realityExplanation:
      "Every individual maintains complete bodily autonomy at all times regardless of relationship duration, marital status, or past intimacy. Agreeing yesterday does not mean agreeing today, and consent can be withdrawn at any second without justification.",
    whatToRemember: "Past intimacy never implies future consent. You always have the right to change your mind.",
    learnMoreTopicId: "active-consent",
    topicLabel: "Consent & Autonomy",
  },
  {
    id: "mvr-3",
    statement: "Freezing or going quiet during unwanted touch is an involuntary neurological survival reflex, not agreement.",
    correctAnswer: "Real",
    feedbackCorrect: "Correct! Tonic immobility is an involuntary nervous system response.",
    feedbackIncorrect: "Actually, science confirms that freezing is an involuntary survival mechanism.",
    realityTitle: "The nervous system protects through tonic immobility.",
    realityExplanation:
      "When encountering perceived danger or severe trauma, the autonomic nervous system frequently triggers 'freeze' (tonic immobility) rather than fight-or-flight to minimize bodily injury. A lack of physical struggle, scream, or verbal protest is never proof of consent.",
    whatToRemember: "Enthusiastic, affirmative, freely given communication is the only true indicator of consent.",
    learnMoreTopicId: "trauma-responses",
    topicLabel: "Understanding Trauma",
  },
  {
    id: "mvr-4",
    statement: "Supporting someone who discloses harm means immediately taking charge of what they should do next.",
    correctAnswer: "Myth",
    feedbackCorrect: "That's right! True support honors personal autonomy and self-determination.",
    feedbackIncorrect: "Not quite. Taking control can inadvertently disempower the person.",
    realityTitle: "Empowerment begins with honoring survivor choices.",
    realityExplanation:
      "Trauma often strips away a person's sense of agency. When allies take over and dictate what steps must be taken (such as reporting or confronting), it can recreate that lack of control. Supportive allyship means listening non-judgmentally and letting them decide their own path at their own pace.",
    whatToRemember: "Support means walking beside someone, never deciding for them.",
    learnMoreTopicId: "bystander-support",
    topicLabel: "Supporting Others",
  },
  {
    id: "mvr-5",
    statement: "Setting clear personal boundaries early helps relationships become stronger, safer, and more trustworthy.",
    correctAnswer: "Real",
    feedbackCorrect: "Spot on! Boundaries define safety, mutual respect, and authentic connection.",
    feedbackIncorrect: "Actually, healthy boundaries protect and strengthen relationships.",
    realityTitle: "Boundaries build trust; they do not break connection.",
    realityExplanation:
      "Boundaries are not walls designed to push people away; they are clear indicators showing how to interact safely. When both partners communicate and honor emotional, physical, and digital limits, mutual respect and deep security flourish.",
    whatToRemember: "Saying 'no' to what drains or harms you protects what is healthy.",
    learnMoreTopicId: "healthy-boundaries",
    topicLabel: "Healthy Boundaries",
  },
  {
    id: "mvr-6",
    statement: "Demanding passwords or location tracking in a relationship is a natural sign of deep devotion and transparency.",
    correctAnswer: "Myth",
    feedbackCorrect: "Correct! Digital surveillance is controlling behavior, not affection.",
    feedbackIncorrect: "Not quite. Constant monitoring is an early warning sign of coercion.",
    realityTitle: "Digital privacy and trust go hand in hand.",
    realityExplanation:
      "Healthy partners respect individuality and digital privacy. Demanding access to phones, messaging accounts, or 24/7 location sharing is a manifestation of surveillance and control, often disguised as affection or trust building.",
    whatToRemember: "You have an absolute right to digital privacy, even in close partnerships.",
    learnMoreTopicId: "digital-boundaries",
    topicLabel: "Digital Safety",
  },
];

// ============================================================
// 2. INTERACTIVE BRANCHING SCENARIOS (Data-driven Scenarios)
// ============================================================
export const BRANCHING_SCENARIOS: BranchingScenario[] = [
  {
    id: "scenario-1",
    title: "The Ambiguous Hesitation",
    category: "Consent & Communication",
    situation:
      "You and someone you have been seeing for a few weeks are spending time together. You lean in for physical intimacy. They look down, hesitate, and stay still without moving closer or speaking.",
    prompt: "How can you respond in a way that respects their comfort and bodily autonomy?",
    options: [
      {
        id: "opt-1a",
        text: "Assume their silence means they are comfortable and continue gently.",
        consequences:
          "One significant risk is mistaking hesitation or freezing for agreement. In moments of uncertainty, proceeding without checking in can lead to a serious boundary violation and distress.",
        analysis:
          "Silence, passivity, or hesitation are clear indicators of discomfort or freezing. Valid consent requires voluntary, clear participation.",
        isSupportive: false,
        takeaway: "Always treat ambiguity as a cue to pause immediately and check in verbally.",
      },
      {
        id: "opt-1b",
        text: "Pause immediately, create comfortable physical space, and ask gently: 'I noticed you hesitated—are you comfortable with this, or would you prefer to pause?'",
        consequences:
          "This helps because it explicitly honors autonomy and creates psychological safety. It allows the other person to express uncertainty or say 'no' without fearing conflict.",
        analysis:
          "Careful supporters recognize body language and prioritize their partner's comfort above their own desire. Pausing demonstrates safety and emotional maturity.",
        isSupportive: true,
        takeaway: "Checking in never ruins the moment; it ensures both people feel safe and respected.",
      },
      {
        id: "opt-1c",
        text: "Ask with irritation: 'Why are you acting so distant all of a sudden? Did I do something wrong?'",
        consequences:
          "One possible risk is making the person feel guilty or pressured to comply just to avoid an argument. Guilt-tripping shifts the emotional burden onto them.",
        analysis:
          "Reacting defensively when someone hesitates penalizes them for having boundaries, making honest communication harder in the future.",
        isSupportive: false,
        takeaway: "Keep your tone calm, patient, and completely free of resentment.",
      },
    ],
  },
  {
    id: "scenario-2",
    title: "The Private Group Chat",
    category: "Digital Safety & Allyship",
    situation:
      "In a private group chat with friends, someone posts an intimate screenshot and photo of an acquaintance, accompanying it with jokes and crude remarks.",
    prompt: "How can you intervene effectively without escalating harm?",
    options: [
      {
        id: "opt-2a",
        text: "Directly message the group: 'Sharing someone's private photos without their consent is not okay and violates basic privacy. Please delete it from this chat.'",
        consequences:
          "This helps because it establishes a clear social norm against non-consensual image sharing. It stops bystander apathy and reminds the group of accountability.",
        analysis:
          "Direct, calm intervention signals that digital harassment will not be normalized or tolerated by peers. It often encourages other silent group members to speak up.",
        isSupportive: true,
        takeaway: "Calling out non-consensual media sharing in real time helps halt its circulation.",
      },
      {
        id: "opt-2b",
        text: "Stay silent and quietly close the app so you do not get involved in social friction.",
        consequences:
          "While avoiding conflict feels safer, silence in group chats is often interpreted by perpetrators as tacit social approval, emboldening further harm.",
        analysis:
          "Passive bystanders unintentionally enable boundary violations. You can also reach out to another member to intervene together.",
        isSupportive: false,
        takeaway: "Even a private message to the sender or admin can disrupt harmful behavior.",
      },
      {
        id: "opt-2c",
        text: "Reach out privately to the person targeted to express support, ask if they are okay, and provide information on how to report non-consensual image sharing.",
        consequences:
          "This helps because victims of cyber harassment often feel isolated and overwhelmed. Offering support and guidance restores their agency.",
        analysis:
          "Caring allyship combines peer intervention with victim-centered support, ensuring the targeted individual knows they are not alone.",
        isSupportive: true,
        takeaway: "Centering the dignity of the person harmed is an essential act of solidarity.",
      },
    ],
  },
  {
    id: "scenario-3",
    title: "Supporting a Confiding Friend",
    category: "Trauma-Informed Allyship",
    situation:
      "A close friend contacts you in distress and confides that someone crossed their boundaries at a recent gathering despite them asking them to stop. They feel shaken, anxious, and conflicted.",
    prompt: "What is the most supportive initial reaction?",
    options: [
      {
        id: "opt-3a",
        text: "Listen attentively, reassure them ('I believe you, and this was not your fault'), and ask: 'How can I best support you right now?'",
        consequences:
          "This helps because immediate belief and validation combat trauma-induced self-blame. Asking how to help keeps the survivor in full control of next steps.",
        analysis:
          "Trauma-informed care prioritizes non-judgmental validation and survivor agency. Letting them decide what to do next restores their personal autonomy.",
        isSupportive: true,
        takeaway: "Believe first, listen without interrupting, and let them guide the pace.",
      },
      {
        id: "opt-3b",
        text: "Immediately take their phone to call the other person and confront them aggressively.",
        consequences:
          "One possible risk is taking away your friend's safety and confidentiality. Acting without their consent could provoke retaliation or force them into an unwanted public confrontation.",
        analysis:
          "Well-intentioned anger can override the survivor's own wishes, making them feel just as powerless as during the original incident.",
        isSupportive: false,
        takeaway: "Never take action on behalf of a survivor without their explicit, informed consent.",
      },
      {
        id: "opt-3c",
        text: "Ask detailed questions about what they were wearing, how much they drank, and why they did not leave earlier.",
        consequences:
          "One serious risk is inflicting secondary trauma through victim-blaming questions. Inquiries starting with 'Why didn't you...' make survivors feel scrutinized and responsible.",
        analysis:
          "Perpetrators alone are responsible for boundary violations. Scrutinizing the survivor's actions reinforces guilt and deepens isolation.",
        isSupportive: false,
        takeaway: "Focus solely on empathy and physical safety: 'You are safe with me right now.'",
      },
    ],
  },
];

// ============================================================
// 3. REVEAL & DISCOVER CARDS (6 Interactive Educational Cards)
// ============================================================
export const REVEAL_DISCOVER_CARDS: RevealCardItem[] = [
  {
    id: "rev-1",
    title: "Understanding Personal Boundaries",
    prompt: "What is the true purpose of setting a personal boundary?",
    category: "Consent & Boundaries",
    tag: "Core Concept",
    explanation:
      "Personal boundaries are not walls erected to push people away; they are clear indicators of what you need to feel physically, emotionally, and digitally safe. Boundaries define how you interact with the world and allow genuine trust to grow.",
    practicalTakeaway:
      "A healthy boundary communicates what YOU will do to protect your wellbeing, rather than attempting to control someone else's choices.",
    readTime: "2 min read",
  },
  {
    id: "rev-2",
    title: "Consent & Respectful Communication",
    prompt: "Why is enthusiastic consent different from mere acquiescence?",
    category: "Consent & Boundaries",
    tag: "Autonomy",
    explanation:
      "Affirmative consent focuses on mutual enthusiasm, active engagement, and freedom of choice. Giving in due to persistent badgering, exhaustion, fear of conflict, or social pressure is coerced compliance, not genuine consent.",
    practicalTakeaway:
      "If it is not a voluntary, clear, and reversible 'yes', treat it as a 'no'. Check in often and honor pauses.",
    readTime: "2 min read",
  },
  {
    id: "rev-3",
    title: "Recognizing Warning Signs (Red Flags)",
    prompt: "What is one of the earliest subtle indicators of coercive control?",
    category: "Recognizing Warning Signs",
    tag: "Awareness",
    explanation:
      "Early coercion rarely starts with physical force; it frequently disguises itself as extreme devotion. Look for subtle pressure to cut off friends, guilt-tripping when you say 'no', or demands to share private passwords under the guise of trust.",
    practicalTakeaway:
      "Pay attention to how someone reacts to your refusal. Respectful people accept 'no' with calm understanding.",
    readTime: "3 min read",
  },
  {
    id: "rev-4",
    title: "Responding to Coercive Pressure",
    prompt: "What can you say when someone repeatedly ignores a polite refusal?",
    category: "Healthy Relationships",
    tag: "Action Script",
    explanation:
      "When polite decline is ignored, shift from polite softening to clear, unambiguous boundary statements. You do not need to provide extensive justification or negotiate your comfort.",
    practicalTakeaway:
      "Use clear declarative scripts: 'I said no, and that is my final decision. Please respect that and stop asking.'",
    readTime: "2 min read",
  },
  {
    id: "rev-5",
    title: "Supporting Without Taking Control",
    prompt: "How can you support someone in crisis without disempowering them?",
    category: "Supporting Others",
    tag: "Trauma Care",
    explanation:
      "Trauma robs people of control. True support offers structured choices rather than commands. Instead of saying 'You have to do this', ask: 'Would you like some water? Would you prefer quiet time or do you want to explore support options together?'",
    practicalTakeaway:
      "Always ask: 'What feels like the safest next step for you right now?' and respect their timeline.",
    readTime: "3 min read",
  },
  {
    id: "rev-6",
    title: "Identifying Trustworthy Resources",
    prompt: "How can you tell if a crisis resource or helpline is legitimate and safe?",
    category: "Finding Trustworthy Help",
    tag: "Verification",
    explanation:
      "Statutory services (such as National Emergency 112, Women Helpline 1091, Tele-MANAS 14416) operate under strict legal mandates with zero retaliation and confidentiality guarantees. They do not force you to report or disclose personal identity just to receive guidance.",
    practicalTakeaway:
      "Verified platforms respect your anonymity and will transparently explain their protocols before you share anything.",
    readTime: "2 min read",
  },
];

// ============================================================
// 4. MICRO-QUIZZES (Focused 3-5 Question Activities)
// ============================================================
export const MICRO_QUIZZES: MicroQuizActivity[] = [
  {
    id: "quiz-consent",
    title: "Consent & Bodily Autonomy Check",
    category: "Consent & Boundaries",
    description: "Test your understanding of enthusiastic consent, legal standards, and voluntary participation.",
    questions: [
      {
        id: "q-1-1",
        question: "Which of the following best describes legally and ethically valid consent?",
        options: [
          "Silence when no objection is raised.",
          "Consent given at the beginning of an encounter that applies to all activities.",
          "A freely given, reversible, informed, and enthusiastic agreement for specific acts.",
          "Agreement given under persistent emotional begging.",
        ],
        correctIndex: 2,
        explanation:
          "Valid consent must be given freely without coercion, is specific to each act, and can be paused or revoked at any second.",
        takeaway: "Consent is an active, ongoing dialogue, not a one-time transaction.",
      },
      {
        id: "q-1-2",
        question: "If a person initially agrees to intimacy but later becomes uncomfortable and goes quiet, what is required?",
        options: [
          "Continue gently since consent was already granted.",
          "Immediately pause, step back, and ask if they wish to stop.",
          "Ask them why they are changing their mind after agreeing.",
          "Wait for them to shout or physically push away.",
        ],
        correctIndex: 1,
        explanation:
          "Consent is reversible at any moment. Non-verbal withdrawal of engagement requires immediate cessation of activity.",
        takeaway: "The moment enthusiasm disappears, consent is no longer present.",
      },
      {
        id: "q-1-3",
        question: "Can someone who is significantly intoxicated give valid legal consent?",
        options: [
          "Yes, if they verbally agreed before having drinks.",
          "Yes, as long as both parties were drinking equally.",
          "No, substantial intoxication impairs cognitive capacity to give valid consent.",
          "Only if they are in an established relationship.",
        ],
        correctIndex: 2,
        explanation:
          "Severe intoxication impairs judgment and cognitive ability. Under statutory law, non-consensual acts during impairment lack legal consent.",
        takeaway: "Sobriety and clarity of mind are essential prerequisites for valid consent.",
      },
    ],
  },
  {
    id: "quiz-bystander",
    title: "Active Bystander Intervention (5Ds)",
    category: "Supporting Others",
    description: "Learn safe, effective intervention techniques using the internationally recognized 5Ds model.",
    questions: [
      {
        id: "q-2-1",
        question: "What does the 'Distract' strategy in the 5Ds bystander model involve?",
        options: [
          "Physically confronting the person engaging in harassment.",
          "Creating a subtle diversion, such as asking for directions or spilling a drink, to de-escalate the tension.",
          "Recording the entire incident on video for social media.",
          "Ignoring the situation so the parties can resolve it privately.",
        ],
        correctIndex: 1,
        explanation:
          "The 'Distract' method de-escalates tension by interrupting the interaction without directly confronting the instigator.",
        takeaway: "A simple question like 'Do you know where the exit is?' can safely break an uncomfortable encounter.",
      },
      {
        id: "q-2-2",
        question: "When using the 'Delegate' strategy, what is the bystander doing?",
        options: [
          "Telling the targeted person to fight back.",
          "Asking someone in authority (like staff, security, transit police, or peers) to assist.",
          "Waiting until the incident ends before speaking to anyone.",
          "Giving up because it feels unsafe to handle alone.",
        ],
        correctIndex: 1,
        explanation:
          "Delegation means identifying someone with greater authority, presence, or training to intervene safely.",
        takeaway: "You don't have to act alone; asking for help is a powerful intervention.",
      },
      {
        id: "q-2-3",
        question: "What is the purpose of the 'Delay' strategy after a stressful event has concluded?",
        options: [
          "Waiting a week before reporting the issue to police.",
          "Checking in with the person who was targeted to ask if they are okay and offer assistance.",
          "Postponing any intervention indefinitely.",
          "Delaying leaving the area so you can confront the instigator later.",
        ],
        correctIndex: 1,
        explanation:
          "Delaying means stepping in after the immediate interaction has passed to validate the person, offer a safe presence, and help with next steps.",
        takeaway: "Post-incident solidarity ('Are you okay? That wasn't fair') provides immense comfort.",
      },
    ],
  },
  {
    id: "quiz-digital",
    title: "Digital Safety & Tech Boundary Checks",
    category: "Digital Safety",
    description: "Understand digital rights, non-consensual image sharing, and cyber stalking protections.",
    questions: [
      {
        id: "q-3-1",
        question: "Under Indian statutory law (IT Act & BNS 2023), is sharing someone's private intimate photos without their permission an offense?",
        options: [
          "Only if the photos were stolen via computer hacking.",
          "No, if the recipient received them voluntarily in a private chat.",
          "Yes, non-consensual transmission of intimate images is a punishable legal offense.",
          "Only if the person is a minor.",
        ],
        correctIndex: 2,
        explanation:
          "Section 66E of the IT Act and provisions of the Bharatiya Nyaya Sanhita strictly penalize the non-consensual transmission or publication of private images.",
        takeaway: "Digital privacy is protected by law; non-consensual sharing is a serious violation.",
      },
      {
        id: "q-3-2",
        question: "If someone repeatedly calls from hidden numbers, sends unwanted messages on multiple platforms, and tracks location after being told to stop, this is classified as:",
        options: [
          "Persistent romantic courting.",
          "Cyber stalking and harassment under law.",
          "Harmless online persistence.",
          "A civil disagreement.",
        ],
        correctIndex: 1,
        explanation:
          "Repeated unwanted digital contact and surveillance after refusal constitutes cyber stalking under Section 78 of BNS 2023.",
        takeaway: "Persistent unwanted contact is harassment, not romantic devotion.",
      },
    ],
  },
];

// ============================================================
// 5. AUDIO LESSONS (Listen Instead of Read)
// ============================================================
export const AUDIO_LESSONS: AudioLesson[] = [
  {
    id: "audio-consent",
    title: "The Architecture of Active Consent",
    category: "Consent & Boundaries",
    durationEstimate: "2 min listen",
    conciseSummary:
      "A calm guide explaining the FRIES framework: Freely given, Reversible, Informed, Enthusiastic, and Specific consent in everyday relationships.",
    fullTranscript:
      "Welcome to this SecuTrail educational audio session on active consent. Consent is not merely the absence of a 'no'; it is the affirmative presence of a voluntary 'yes'. In healthy relationships, communication is an ongoing, respectful dialogue. Consent must be Freely given—without pressure, guilt, or fear of conflict. It is Reversible—anyone has the absolute right to change their mind at any second, even after intimacy has started. It is Informed—both partners understand what is happening without deception. It is Enthusiastic—focused on mutual comfort and desire. And it is Specific—agreeing to one action does not grant permission for anything else. If someone hesitates, freezes, or goes silent, the most caring response is to pause immediately and check in. Remember: your autonomy is sacred, and you always deserve to be heard.",
  },
  {
    id: "audio-boundaries",
    title: "Navigating Relationship Pressure & Coercion",
    category: "Healthy Relationships",
    durationEstimate: "2 min listen",
    conciseSummary:
      "How to recognize subtle guilt-tripping, boundary testing, and how to assert declarative boundaries with confidence.",
    fullTranscript:
      "In this reflection, we examine how to recognize and respond to pressure. Coercion rarely begins with hostility; it often starts with subtle emotional leverage. Phrases like 'If you truly loved me, you would do this', or pouting and withdrawing affection after you say no, are forms of manipulation designed to wear down your boundaries. Healthy relationships thrive on mutual respect and emotional safety. When someone genuinely values you, they receive your boundaries with understanding, not offense. You never need to apologize, negotiate, or provide an elaborate justification for your personal comfort. A simple, firm script can help: 'I understand what you want, but my answer is no, and I need you to respect that.' Setting limits does not damage healthy connections; it protects them.",
  },
  {
    id: "audio-support",
    title: "How to Support a Friend with Compassion",
    category: "Supporting Others",
    durationEstimate: "3 min listen",
    conciseSummary:
      "Core principles of trauma-informed allyship: believing without interrogation, avoiding victim-blaming, and preserving survivor control.",
    fullTranscript:
      "When a friend confides that their boundaries were crossed, your initial reaction can shape their recovery journey. First: believe them. Say clearly: 'I believe you, and this was not your fault.' Survivors often carry profound self-blame, wondering if their clothing, demeanor, or choices invited harm. Reassure them that the responsibility rests entirely with the person who crossed the line. Second: protect their autonomy. Do not rush to take over, confront the other party, or pressure them to make police reports before they are ready. Trauma strips people of control; our role as allies is to restore that control. Ask gentle, open-ended questions like: 'How can I support you right now?' or 'Would you like to look up confidential helplines together, or would you prefer a cup of tea and quiet company?' Walking beside someone at their own pace is the greatest gift of friendship.",
  },
];

// ============================================================
// 6. TOPIC LIBRARY (Comprehensive Categorized Directory)
// ============================================================
export const TOPIC_LIBRARY: TopicLibraryItem[] = [
  {
    id: "topic-1",
    title: "Consent & Bodily Autonomy",
    category: "Consent & Boundaries",
    description:
      "Understanding the FRIES consent standard, distinguishing between coerced compliance and true agreement, and recognizing bodily rights under Section 63 of BNS 2023.",
    estimatedMinutes: 5,
    isVerifiedStatutory: true,
    authorityOrSource: "Bharatiya Nyaya Sanhita (BNS) 2023 & MoHFW Clinical Protocols",
    jurisdiction: "National (India)",
    lastReviewed: "2024-07-01",
    sourceUrl: "https://www.indiacode.nic.in",
    keyTakeaways: [
      "Consent must be voluntary, ongoing, reversible, and enthusiastic.",
      "Silence or freezing is an involuntary reflex, not agreement.",
      "Prior intimacy or relationship status never implies blanket consent.",
    ],
    recommendedActivity: "myth-real",
  },
  {
    id: "topic-2",
    title: "Healthy vs Coercive Relationships",
    category: "Healthy Relationships",
    description:
      "Identifying the difference between supportive mutual connection and gradual coercive control, emotional guilt-tripping, and boundary violations.",
    estimatedMinutes: 6,
    isVerifiedStatutory: false,
    keyTakeaways: [
      "Healthy partners accept 'no' without irritation or emotional punishment.",
      "Boundaries strengthen trust rather than creating emotional distance.",
      "You are never responsible for managing someone else's volatile emotions.",
    ],
    recommendedActivity: "scenario",
  },
  {
    id: "topic-3",
    title: "Recognizing Early Warning Signs",
    category: "Recognizing Warning Signs",
    description:
      "Understanding red flags in dating and friendships: isolation tactics, boundary testing, possessiveness disguised as care, and digital surveillance.",
    estimatedMinutes: 4,
    isVerifiedStatutory: false,
    keyTakeaways: [
      "Early warning signs often look like intense, overwhelming attention.",
      "Notice how someone acts when you make plans without them.",
      "Trust your physical intuition and bodily discomfort.",
    ],
    recommendedActivity: "reveal",
  },
  {
    id: "topic-4",
    title: "Digital Safety & Cyber Stalking Laws",
    category: "Digital Safety",
    description:
      "Protecting online identity, responding to non-consensual image distribution, and statutory legal rights under the Information Technology Act and BNS.",
    estimatedMinutes: 5,
    isVerifiedStatutory: true,
    authorityOrSource: "IT Act 2000 (Section 66E, 67A) & BNS Section 78",
    jurisdiction: "National (India)",
    lastReviewed: "2024-07-01",
    sourceUrl: "https://www.meity.gov.in",
    keyTakeaways: [
      "Non-consensual image sharing is a punishable criminal offense.",
      "Do not delete abusive messages; preserve screenshots and metadata safely.",
      "National Cyber Crime Reporting Portal (cybercrime.gov.in) provides online reporting.",
    ],
    recommendedActivity: "quiz",
  },
  {
    id: "topic-5",
    title: "Active Bystander Intervention (5Ds)",
    category: "Supporting Others",
    description:
      "Practical, non-violent intervention methods to de-escalate harassment and support others safely in public, college, or workplace settings.",
    estimatedMinutes: 6,
    isVerifiedStatutory: false,
    keyTakeaways: [
      "The 5Ds: Direct, Distract, Delegate, Delay, Document.",
      "Distraction (asking a neutral question) is the safest initial de-escalator.",
      "Always prioritize your own physical safety before stepping in directly.",
    ],
    recommendedActivity: "quiz",
  },
  {
    id: "topic-6",
    title: "Verified Helplines & Statutory Reporting",
    category: "Finding Trustworthy Help",
    description:
      "Statutory emergency numbers (112, 1091, 14416), One Stop Centres (Sakhi OSC), Zero FIR filing procedures, and trauma-informed legal aid.",
    estimatedMinutes: 5,
    isVerifiedStatutory: true,
    authorityOrSource: "Ministry of Women & Child Development (MWCD) / NALSA",
    jurisdiction: "National (India)",
    lastReviewed: "2024-08-15",
    sourceUrl: "https://wcd.nic.in",
    keyTakeaways: [
      "National Emergency (112) and Women Helpline (1091) operate 24/7 nationwide.",
      "Zero FIR allows any police station to record a complaint regardless of jurisdiction.",
      "One Stop Centres provide medical, legal, and counseling aid under one roof.",
    ],
    recommendedActivity: "listen",
  },
];
