# SecuTrail — Component Map

```
src/components/
├── ui/                     # Design System Primitives
│   ├── button.tsx          # Accessible variants: primary, secondary, outline, ghost, destructive, safety
│   ├── card.tsx            # Base container with calm borders and elevations
│   ├── badge.tsx           # Category tags: Medical, Emotional, Legal, Emergency, Tier
│   ├── dialog.tsx          # Accessible modal dialog with focus lock & ESC trap
│   ├── input.tsx           # Clean input field with focus ring
│   ├── textarea.tsx        # Resizable/accessible textarea
│   ├── tabs.tsx            # Animated accessible tab switchers
│   ├── alert.tsx           # Reassurance & warning callout boxes
│   ├── tooltip.tsx         # Accessible hover/focus help labels
│   ├── progress-indicator.tsx # Step indicator for triage and lesson modules
│   ├── empty-state.tsx     # Calm empty illustration & copy
│   ├── error-state.tsx     # Non-threatening error boundary view
│   └── loading-state.tsx   # Subtle pulse skeleton loader
├── layout/                 # Page Layout Containers
│   ├── header.tsx          # Global navigation with Quick Exit integration
│   ├── footer.tsx          # Discreet footer with quick wipe & emergency notice
│   ├── safety-bar.tsx      # Omnipresent sticky top safety bar with ESC shortcut
│   └── mobile-nav.tsx      # Mobile friendly touch navigation
├── safety/                 # Global Safety Layer Components
│   ├── quick-exit-button.tsx # High-contrast red/slate Quick Exit action
│   ├── escape-listener.tsx # Global keyboard listener for ESC key
│   ├── history-purge.tsx   # One-click clear local & session data button
│   └── emergency-banner.tsx# Instant 24/7 hotline banner
├── awareness/              # Awareness Track Modules
│   ├── module-card.tsx     # Educational module preview card with progress ring
│   ├── lesson-viewer.tsx   # Interactive step-by-step lesson with next/prev
│   ├── myth-buster.tsx     # Flip/expand card contrasting myth vs reality
│   ├── scenario-sim.tsx    # Interactive scenario picker with feedback
│   ├── quiz-engine.tsx     # Micro-quiz with instant non-judgmental explanations
│   └── legal-accordion.tsx # Simplified legal sections (BNS, POCSO, Zero-FIR)
├── survivor/               # Survivor Track Flow
│   ├── safety-check-card.tsx # Primary "Are you safe right now?" prompt
│   ├── immediate-guidance.tsx# Emergency numbers and steps to reach safe space
│   ├── decision-option-card.tsx# Agency-first choice comparison (Pros/Cons/Timelines)
│   └── action-checklist.tsx  # Interactive private checklist for survivor's plan
├── triage/                 # Triage Engine Components
│   ├── triage-selector.tsx # Multi-category selector (Medical, Emotional, Legal)
│   ├── risk-assessment.tsx # Time-sensitivity highlighter (e.g., 72h PEP alert)
│   └── domain-badge.tsx    # Visual color-coded domain tag
├── assistant/              # Verified RAG Guided AI Interface
│   ├── chat-interface.tsx  # Safe messaging interface with streaming support
│   ├── citation-box.tsx    # Grounded citation pill linked to verified handbook
│   ├── safety-notice.tsx   # Prominent "Not legal or medical advice" notice
│   └── prompt-suggestions.tsx # Pre-vetted safe query starters
├── resources/              # Verified Resource Directory
│   ├── resource-card.tsx   # Organization info, verified badge, distance, phone
│   ├── verification-badge.tsx # Tier 1 (Govt), Tier 2 (NGO), Tier 3 (Community)
│   ├── resource-filters.tsx# Filter by category, 24/7 status, location
│   └── geo-selector.tsx    # City/State selector with fallback to manual input
└── admin/                  # Verification & Audit Dashboard
    ├── verification-table.tsx # Queue of resources needing periodic review
    ├── audit-log-viewer.tsx# Immutable audit trail of verification actions
    └── resource-editor.tsx # Modal to update operating status, phone, tier
```
