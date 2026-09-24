# SecuTrail — Judge & Evaluator Demonstration Guide

This guide walks through the exact 22-step evaluation flow showcasing every subsystem of SecuTrail.

---

## 🚀 Pre-Flight Setup
```bash
# 1. Install dependencies
npm install

# 2. Run the automated test suite (35 tests)
npm test

# 3. Launch local dev server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧭 Step-by-Step Demonstration Script

### Part 1: Landing Page & Philosophy
1. **Landing Page (`/`)**:
   - Observe the core product motto: *"Verified information. Private support. Your choice."*
   - Note the two distinct pathways: `[ Learn & Prevent ]` and `[ Find Support ]`.
   - Review the 8-layer architectural breakdown and the three pillars of care (Medical, Emotional, Legal).
   - Confirm zero login/sign-up forms are present.

### Part 2: Awareness Track (`/awareness`)
2. **Open Awareness Track**:
   - Click `[ Learn & Prevent ]`.
3. **Explore Curriculum**:
   - Observe the 7 interactive modules on the left sidebar.
   - Note the anonymous progress bar at the top right.
4. **Interactive Module Experience**:
   - Select **Module 1** (*Understanding Sexual Violence & Consent*).
   - Click *"Reveal Fact-Checked Reality"* on a Myth vs. Reality card to see the neurobiological explanation of tonic immobility (freezing).
   - Select a decision choice in the **Interactive Scenario Simulation** (*The Ambiguous Silence*) to view instant trauma-informed feedback.
   - Answer the knowledge check quiz.
   - Type a note in the **Private Reflection Box** — confirm it stays strictly in local browser memory.
   - Click *"Mark as Completed"* and see the progress counter advance.

### Part 3: Survivor Track & Immediate Safety (`/survivor`)
5. **Enter Survivor Support**:
   - Click `Survivor Track` in the header or `Find Support` on the home page.
6. **Observe Global Safety Layer**:
   - Notice the persistent sticky **Safety Bar** at the very top: *"Need to leave quickly? [ Quick Exit ] (Click Quick Exit or press ESC twice)"*.
7. **Immediate Danger Evaluation**:
   - Review the red safety prompt: *"Are you in physical danger right now?"*
   - Click `[ I Am In Immediate Danger ]` (`/survivor/safety`) to see one-tap calling triggers for **112**, **1091**, and **1098**, along with physical security steps.

### Part 4: Multi-Path Triage Engine (`/survivor/triage`)
8. **Open Triage Care**:
   - Navigate to `/survivor/triage`.
9. **Simultaneous Domain Selection**:
   - Select **Medical Care** AND **Emotional Support** AND **Legal Information** together. Notice SecuTrail does not restrict the user to a single rigid category.
10. **Progressive Location Consent**:
    - Check *"Yes, show me verified local resources in my state and district"*.
    - Choose **Delhi** -> **South Delhi** (or Maharashtra -> Mumbai).

### Part 5: Agency-First Decision Layer (`/survivor/options`)
11. **View Agency Options**:
    - Click `[ View Agency-First Options ]`.
    - Observe the trauma-informed banner: *"Here's what each option involves. You choose what feels appropriate for you."*
    - Expand **Option B (Medical Care First)**:
      - Review the **72-hour HIV PEP critical window**.
      - Review *"What May Happen During This Process"*.
      - Review *"Potential Benefits"* vs. *"Considerations To Keep In Mind"*.
      - Review statutory source citations (Section 357C CrPC / 397 BNSS free treatment rights).

### Part 6: Verified Resource Directory (`/survivor/resources`)
12. **Explore Directory**:
    - Navigate to `/survivor/resources`.
    - Observe verified entries: **One Stop Centre (Sakhi) — AIIMS New Delhi**, **Safdarjung Hospital Crisis Unit**, **Tele-MANAS (14416)**, **NALSA Legal Aid (15100)**.
    - Check the toggle *"Show Demo Testing Records"* to view simulated testing facilities clearly distinguished with the vivid amber **DEMO DATA** badge.
    - Click *"Report Info"* on any card to test the anonymous community issue reporting flow.

### Part 7: Verified AI Decision Assistant (`/survivor/assistant`)
13. **Open Assistant**:
    - Navigate to `/survivor/assistant`.
14. **Test Query**:
    - Click the suggested starter: *"What is PEP and what is the exact time window for HIV prevention?"*
    - Click `Ask Assistant`.
15. **Inspect Structured Output**:
    - **Safety Classification**: Category `MEDICAL_URGENCY`, Urgency `HIGH`.
    - **Relevant Support Categories**: `[ Medical & Prophylaxis ]`.
    - **Grounded Explanation**: Clear explanation of antiretrovirals, 72-hour window, and free treatment under Section 357C without prior FIR.
    - **Verified Facilities**: Local hospital emergency wards matching the query.
    - **Agency Decision Pathways**: Non-coercive next-step options.
    - **Official Citations**: Explicit links to MoHFW National Guidelines and statutory provisions.

### Part 8: Quick Exit Demonstration
16. **Trigger Quick Exit**:
    - While on `/survivor/assistant`, press the **`ESC` key twice** quickly (or click the yellow **Quick Exit** button on the top safety bar).
17. **Verify Instant Escape**:
    - Notice **zero confirmation prompts** appear (no "Are you sure?").
    - The browser is immediately redirected to the neutral site (`https://weather.com`).
    - Local storage keys (`secutrail_*`) and session storage are wiped clean.

### Part 9: Privacy Center (`/privacy`)
18. **Open Privacy Center**:
    - Open [http://localhost:3000/privacy](http://localhost:3000/privacy).
    - Review the transparent comparison: What We Store vs. What We Never Store.
    - Read the honest warning: What Quick Exit Cannot Erase (Browser history, Wi-Fi logs, Stalkerware, Call logs).
    - Click `[ Wipe All Local Data Now ]` to trigger a manual client-state purge.

### Part 10: Administrative Verification Dashboard (`/admin`)
19. **Open Admin Console**:
    - Open [http://localhost:3000/admin](http://localhost:3000/admin).
20. **Authenticate**:
    - Enter key: `secutrail-admin-demo-key-2026`.
21. **Inspect Audit Operations**:
    - **Verification Queue**: View facilities due for their 45/90 day re-verification.
    - Click `Audit & Verify` on any facility, record phone check findings, and certify status.
    - **Resource Directory**: Search and filter all facilities.
    - **Source Registry**: Inspect verified statutory authorities (BNS 2023, MoHFW, NALSA).
    - **Tamper-Evident Audit Log**: Inspect the chronological log of verification events.
