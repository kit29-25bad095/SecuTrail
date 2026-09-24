# SecuTrail — Developer Guide & Setup

## 1. Project Overview & Tech Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables & Shadcn/UI conventions
- **Icons**: Lucide React
- **ORM / Database**: Prisma ORM with PostgreSQL + embedded zero-config fallback
- **Testing**: Native automated test suite (35 tests covering all 8 pillars)

---

## 2. Directory Structure

```
secutrail/
├── src/
│   ├── app/                         # App Router pages and layouts
│   │   ├── admin/                   # Administrative verification dashboard
│   │   ├── api/                     # REST API endpoints
│   │   │   ├── admin/               # Protected administrative APIs
│   │   │   ├── assistant/           # Verified RAG endpoint
│   │   │   ├── classify/            # Safety risk classifier endpoint
│   │   │   ├── feedback/            # Resource reporting endpoint
│   │   │   ├── resources/           # Public resource endpoints
│   │   │   ├── session/             # Ephemeral session & Quick Exit APIs
│   │   │   └── triage/              # Triage processing endpoint
│   │   ├── awareness/               # Awareness Track interactive modules
│   │   ├── privacy/                 # Privacy Center & Threat Model
│   │   ├── resources/               # Public verified resource directory
│   │   ├── survivor/                # Survivor Track (Safety, Triage, Options, Assistant)
│   │   ├── layout.tsx               # Root layout with Navigation & Footer
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── awareness/               # Awareness module player & interactive cards
│   │   ├── layout/                  # Navigation, MobileDrawer, Footer
│   │   ├── resources/               # ResourceCard, VerificationBadge
│   │   ├── safety/                  # QuickExit, SafetyBar
│   │   ├── survivor/                # OptionCard
│   │   └── ui/                      # Button, Card, Badge, Alert, Dialog, Input, etc.
│   ├── data/
│   │   └── awarenessData.ts         # 7 educational modules, quizzes & simulations
│   ├── hooks/
│   │   └── useQuickExit.ts          # Double-ESC keyboard listener
│   ├── lib/
│   │   ├── db/                      # Feedback store & persistence helpers
│   │   ├── privacy/                 # Client storage keys & selective purge
│   │   ├── security/                # Admin auth verification
│   │   └── utils.ts                 # Formatting & class merging utilities
│   ├── services/
│   │   ├── agency/                  # Agency-first balanced option generator
│   │   ├── ai/                      # LLMProvider (Mock & Production)
│   │   ├── rag/                     # Verified RAG pipeline & knowledge chunks
│   │   ├── resources/               # ResourceProvider (Demo & Production)
│   │   ├── safety/                  # SafetyClassifier & SafetyGuardrails
│   │   └── sessions/                # Ephemeral SessionManager (RAM cache)
│   └── types/
│       └── index.ts                 # Domain TypeScript interfaces
├── prisma/
│   └── schema.prisma                # 15 relational PostgreSQL models
├── tests/
│   └── secutrail.test.ts            # Automated unit and integration test suite
├── docs/                            # Phase 0 architectural & design specifications
├── .env.example                     # Environment template
└── package.json
```

---

## 3. Environment Variables (`.env`)

```env
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SecuTrail"

# Quick Exit Destination (Neutral fallback site)
NEXT_PUBLIC_QUICK_EXIT_URL="https://weather.com"

# Demo Mode (Allows judges to view demo facilities clearly labeled)
NEXT_PUBLIC_ENABLE_DEMO_MODE="true"

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/secutrail?schema=public"

# Admin Authentication Key
ADMIN_API_KEY="secutrail-admin-demo-key-2026"

# AI / LLM Configuration
LLM_PROVIDER="mock"
RESOURCE_PROVIDER="demo"
```

---

## 4. Development Commands

```bash
# Run automated test suite
npm test

# Build production bundle
npm run build

# Start production server
npm start

# Start local development server with hot-reload
npm run dev

# Run linter
npm run lint
```
