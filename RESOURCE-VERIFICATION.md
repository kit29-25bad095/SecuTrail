# SecuTrail — Resource Verification Engine (RVE) & Lifecycle

## 1. Overview
The Resource Verification Engine guarantees that every crisis helpline, One Stop Centre, hospital casualty ward, and legal aid clinic in SecuTrail has been verified according to strict statutory and physical audit standards.

---

## 2. Nine-Stage Resource Lifecycle

```
[1. Discovery]
       ↓
[2. Official Verification] (Gazette / Statutory Registration Check)
       ↓
[3. Human Review] (Verification Specialist Audit)
       ↓
[4. Automated Availability Check] (Telephony Ping & Web Check)
       ↓
[5. Scheduled Re-verification] (90-day for Govt, 45-day for NGOs)
       ↓
[6. User Feedback / Reporting] (Anonymous "Number not working" flags)
       ↓
[7. Human Triage] (Flagged resources placed in PENDING_REVIEW or NEEDS_UPDATE)
       ↓
[8. Lifecycle Action] (UPDATE, KEEP, or DEACTIVATE / EXPIRE)
       ↓
[9. Continuous Monitoring & Audit] (Tamper-evident audit trail for every status change)
```

---

## 3. Authority Tiers

1. **TIER 1 — Official Government & Statutory Bodies**
   - *Entities*: One Stop Centres (Sakhi), District Legal Services Authorities (DLSA/NALSA), ERSS (112), Women Helplines (1091), Govt Hospitals (AIIMS, Safdarjung, KEM).
   - *Verification Criteria*: Official Gazette notifications, `.gov.in` / `.nic.in` domains, verified helpline rosters.
   - *Re-verification Interval*: 90 days.

2. **TIER 2 — Vetted Non-Governmental Organizations (NGOs)**
   - *Entities*: Registered women's rights organisations, medical relief trusts, legal defense collectives.
   - *Verification Criteria*: Statutory non-profit registration, verified physical address, dual direct phone confirmation.
   - *Re-verification Interval*: 45 days.

3. **TIER 3 — Community-Verified & Peer Networks**
   - *Entities*: Local peer circles, student safe spaces.
   - *Verification Criteria*: Minimum two independent peer references.
   - *Re-verification Interval*: 30 days.

---

## 4. Demo Data Distinction

To allow evaluators to test verification workflows without risk of fabricating real-world emergency rosters:
- All demonstration records carry `isDemo: true`.
- Resource names explicitly start with `DEMO:`.
- Resource cards visibly display the bright amber badge: **DEMO DATA — For system evaluation and prototype testing only**.
- Production verified resources display the green: **✓ Verified • Govt Verified / Vetted NGO**.
