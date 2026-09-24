# SecuTrail — Production Design System & UX Specification

**Version:** 1.0.0  
**Framework:** Next.js 14 / TypeScript / Tailwind CSS  
**Audience:** Front-End Engineers, Accessibility Auditors, Product Designers

---

## 1. Trauma-Informed Design Principles

SecuTrail is built around the psychological realities of trauma survivors and safety-seeking users. Every UI decision reflects six foundational principles:

| Principle | Meaning & UI Implementation |
| :--- | :--- |
| **Calm** | Soft, warm slate surfaces (`#f7f8fa` to `#eef0f4`) and sage greens (`#4d8157`) instead of clinical sterile white or harsh alarms. Avoids high-intensity reds except for genuine physical danger. |
| **Private** | No user tracking, zero account creation, no analytics pixels. Ephemeral in-memory sessions with explicit privacy reassurance badges. |
| **Trustworthy** | Strict grounding in official Indian statutory law (BNS 2023, MoHFW, NALSA). Every resource card displays verification badges and audit dates. |
| **Non-Judgmental** | Agency-first language throughout. Never presumes blame or questions a survivor's choices or delays in seeking care. |
| **Accessible** | Full WCAG 2.1 AA compliance, high-contrast text, clear `:focus-visible` rings, screen reader announcements, and a skip-to-content navigation shortcut. |
| **Minimal Cognitive Load** | Clean visual hierarchies, progressive disclosure, clear step badges (`01` through `05`), and absence of decorative animations that cause sensory overwhelm. |

---

## 2. Design Tokens & Primitives

### 2.1 Color Tokens
All colors are defined as HSL custom properties in `src/app/globals.css` and mapped to Tailwind utilities in `tailwind.config.ts`.

| Token | Light Value (HSL) | Semantic Usage |
| :--- | :--- | :--- |
| `--background` | `215 25% 97%` | Warm off-white page background |
| `--foreground` | `220 25% 12%` | Deep charcoal for maximum readability |
| `--card` | `0 0% 100%` | Pure white card surfaces for content lift |
| `--primary` | `218 35% 22%` | Authoritative deep slate |
| `--secondary` | `213 25% 93%` | Soft slate background for secondary elements |
| `--muted-foreground` | `215 15% 48%` | Subdued metadata and secondary text |
| `--accent` | `148 22% 91%` | Calming sage green tint |
| `--destructive` | `0 72% 51%` | Emergency / critical alerts only |
| `--border` | `213 20% 88%` | Subtle boundary lines |

#### Specialized Domain Palettes
- **Sage Palette (Healing & Calm):** `sage-50` (`#f3f7f4`) to `sage-950` (`#111d14`). Used for verified badges and calm action buttons.
- **Emergency Palette:** Red-toned background (`#fef2f2`) and text (`#991b1b`) reserved strictly for immediate physical danger screening (112, 1091).
- **Caution Palette:** Amber-toned background (`#fffbeb`) and text (`#92400e`) used for the persistent Quick Exit bar and time-sensitive clinical alerts (e.g., 72-hour PEP window).
- **Verified Palette:** Green-toned background (`#f0fdf4`) and text (`#166534`) indicating statutorily audited resources.

### 2.2 Typography Scale
Uses Geist Sans for UI text and Geist Mono for helpline numbers and session keys.
- **2xs:** `0.6875rem` (11px) / `line-height: 1rem` — Badges, metadata
- **xs:** `0.75rem` (12px) / `line-height: 1rem` — Secondary details, help text
- **sm:** `0.875rem` (14px) / `line-height: 1.25rem` — Body copy, form inputs
- **base:** `1rem` (16px) / `line-height: 1.5rem` — Primary paragraphs
- **lg:** `1.125rem` (18px) / `line-height: 1.75rem` — Card titles
- **xl:** `1.25rem` (20px) / `line-height: 1.75rem` — Section headers
- **2xl:** `1.5rem` (24px) / `line-height: 2rem` — Major subheadings
- **3xl:** `1.875rem` (30px) / `line-height: 2.25rem` — Track titles
- **4xl to 7xl:** `2.25rem` to `4.5rem` — Hero headline ("SECUTRAIL")

### 2.3 Border Radius Scale
- `rounded-xs`: `0.25rem` (4px)
- `rounded-sm`: `0.375rem` (6px)
- `rounded-md`: `0.5rem` (8px) — Default inputs and buttons
- `rounded-lg`: `0.75rem` (12px)
- `rounded-xl`: `1rem` (16px) — Standard cards and modals
- `rounded-2xl`: `1.25rem` (20px) — Option cards and hero panels
- `rounded-3xl`: `1.5rem` (24px) — Major track cards

### 2.4 Shadow Scale
- `shadow-xs`: Subtle elevation for chips and badges
- `shadow-sm`: Standard card surface elevation
- `shadow-md`: Interactive hover states
- `shadow-lg`: Modals and dropdown drawers

---

## 3. Component Architecture & Library

All components reside in `src/components/` and are built for composability, keyboard navigation, and screen reader accessibility.

```
src/components/
├── ui/              # Base primitive components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Dialog.tsx
│   ├── Alert.tsx
│   ├── Badge.tsx
│   ├── Separator.tsx
│   ├── Tabs.tsx
│   ├── Tooltip.tsx
│   ├── ProgressIndicator.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
├── layout/          # Layout wrappers
│   ├── Navigation.tsx
│   └── Footer.tsx
├── safety/          # Escape & safety notices
│   ├── QuickExit.tsx
│   ├── SafetyBar.tsx
│   └── SafetyNotice.tsx
├── privacy/         # Privacy indicators & notices
│   ├── PrivacyIndicator.tsx
│   └── PrivacyNotice.tsx
├── common/          # Shared layout elements
│   ├── SectionHeader.tsx
│   ├── StepBadge.tsx
│   ├── HelplineButton.tsx
│   └── DemoDataBadge.tsx
├── resources/       # Verified resource display
│   ├── ResourceCard.tsx
│   └── VerificationBadge.tsx
├── survivor/        # Decision-making & agency
│   └── OptionCard.tsx
├── triage/          # Care category selectors
│   ├── DomainCard.tsx
│   └── TimeframeSelector.tsx
└── assistant/       # Grounded AI response display
    ├── AIResponseContainer.tsx
    └── CitationCard.tsx
```

---

## 4. Key Component Documentation

### 4.1 QuickExit (`src/components/safety/QuickExit.tsx`)
- **Role:** Instant emergency redirect to a benign website (`https://weather.com`).
- **Trigger:** Single click on button or global double-ESC keypress within 1000ms.
- **Behavior:** Invokes `window.location.replace()`, clears SecuTrail localStorage/sessionStorage, and fires a non-blocking session termination beacon to `/api/session/exit`.
- **Accessibility:** `aria-label="Quick Exit: Immediately leave this page and clear session data"`, `aria-keyshortcuts="Escape Escape"`. Fallback HTML anchor for non-JS browsers.

### 4.2 SafetyBar (`src/components/safety/SafetyBar.tsx`)
- **Role:** Persistent amber bar rendered across the application.
- **Features:** "Need to leave quickly? Quick Exit" with keyboard shortcut reminder (`ESC × 2`).
- **Hook:** Connects to `useQuickExit()` to listen globally for escape key combinations.

### 4.3 HelplineButton (`src/components/common/HelplineButton.tsx`)
- **Role:** Tappable telephone card for Indian statutory emergency lines.
- **Strict Rule:** Never uses fictional numbers. Audited numbers only:
  - `112` — National Emergency (Police / Fire / Ambulance)
  - `1091` — Women Helpline (24/7)
  - `181` — Women in Distress
  - `14416` — Tele-MANAS (Mental Health)
  - `1098` — Childline (POCSO / Minors)
  - `15100` — NALSA Free Legal Aid

### 4.4 OptionCard (`src/components/survivor/OptionCard.tsx`)
- **Role:** Agency-first pathway cards that outline what to expect, who provides care, critical timelines, benefits, and tradeoffs.
- **Tone:** Empathetic, balanced, transparent. Never pressures a survivor to take legal or police action.

### 4.5 AIResponseContainer (`src/components/assistant/AIResponseContainer.tsx`)
- **Role:** Container for structured RAG answers.
- **Header:** Verified Analysis badge + count of verified grounding sources used.
- **Footer:** Grounded response assurance ("answers strictly cite verified statutory and clinical sources").

### 4.6 VerificationBadge (`src/components/resources/VerificationBadge.tsx`)
- **Role:** Renders the verification state of a facility or hotline.
- **Dynamic Check:** Automatically flags resources whose `nextReview` date has passed as "Expired Review" in amber/red.

---

## 5. Accessibility & Responsive Standards

1. **Keyboard Navigation:** Every interactive element can be reached and activated via `Tab`, `Enter`, and `Space`.
2. **Skip to Content:** The very first focusable element on any page is `<a href="#main-content" className="skip-link">Skip to main content</a>`.
3. **Reduced Motion:** Fully respects `prefers-reduced-motion: reduce` by zeroing transition durations and animations.
4. **Mobile First:** All interactive cards feature touch targets of at least 44px height (`min-h-[44px]`).
5. **No Dark Patterns:** No countdown timers, no popups urging reporting, no forced account signups.
