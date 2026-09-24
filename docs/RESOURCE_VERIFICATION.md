# SecuTrail — Resource Verification Architecture & Lifecycle

## 1. Executive Overview
The **Resource Verification Engine (RVE)** is a core pillar of SecuTrail's safety promise. Unlike standard search engines or crowdsourced maps, SecuTrail guarantees that every crisis helpline, shelter, hospital, and legal aid center has been rigorously vetted, verified for operating hours, and classified according to its official authority level.

---

## 2. Nine-Stage Resource Lifecycle

The resource management workflow follows a strict nine-stage state machine:

```
[1. Discovery]
       ↓
[2. Official Verification] (Document / Govt Gazette / Registration Check)
       ↓
[3. Human Review] (Admin / Verification Specialist Review)
       ↓
[4. Automated Availability Check] (Periodic Ping, Web Status, API checks)
       ↓
[5. Scheduled Re-verification] (90-day cadence for Govt, 45-day for NGOs)
       ↓
[6. User Feedback / Reporting] (Anonymous "Number not working", "Changed address")
       ↓
[7. Human Triage] (Flagged resources placed in PENDING_REVIEW or NEEDS_UPDATE)
       ↓
[8. Lifecycle Action] (UPDATE, KEEP, or DEACTIVATE / EXPIRE)
       ↓
[9. Continuous Monitoring & Audit] (Tamper-evident audit trail for every status change)
```

---

## 3. Verification Authority Tiers

1. **TIER 1 — Official Government & Statutory Bodies**
   - *Scope*: One Stop Centres (OSC / Sakhi), District Legal Services Authorities (DLSA/NALSA), Police Stations, Government District Hospitals.
   - *Verification Criteria*: Official Gazette notifications, official `.gov.in` / `.nic.in` domains, verified helpline rosters.
   - *Re-verification Interval*: 90 days.

2. **TIER 2 — Vetted Non-Governmental Organizations (NGOs)**
   - *Scope*: Registered non-profits, established women's rights organizations, medical relief shelters.
   - *Verification Criteria*: FCRA / 12A / 80G registration, verified physical address, dual direct phone confirmation by verification specialists.
   - *Re-verification Interval*: 45 days.

3. **TIER 3 — Community-Verified & Peer Networks**
   - *Scope*: Local support groups, feminist collectives, university safe spaces.
   - *Verification Criteria*: Minimum two independent peer references, verified lead contacts.
   - *Re-verification Interval*: 30 days.

---

## 4. Verification Metadata Schema

Each resource record maintains immutable verification history:
- `verificationTier`: Authority classification (Tier 1, 2, or 3)
- `verificationStatus`: `VERIFIED`, `PENDING_REVIEW`, `NEEDS_UPDATE`, `EXPIRED`, `REJECTED`
- `lastVerifiedAt`: ISO 8601 timestamp of most recent completed audit
- `nextReviewDate`: Due date for next mandatory check
- `verifiedBy`: Identifier of administrator or auditor who certified the record
- `source`: Reference source (e.g., MWCD directory, NALSA portal, verified phone roster)
- `authorityLevel`: National, State, or District jurisdiction

---

## 5. Expiration & Triage Rules
- If `now() > nextReviewDate`, status transitions automatically to `EXPIRED` or `NEEDS_UPDATE`.
- Expired resources are **excluded** from live crisis recommendations by default or tagged with an explicit warning badge.
- If a user flags a phone number as non-responsive or inaccurate, a high-priority `AuditEvent` is created and the resource is flagged for triage.

---

## 6. Admin Verification Workflows
- **Review Queue**: Sorted by urgent flags, upcoming expiry, and new submissions.
- **Verification Audit**: Admin logs the check type (`PHONE_CHECK`, `SITE_VISIT`, `OFFICIAL_REGISTER`), notes, and sets the next re-verification date.
- **Audit Logging**: Every edit, deactivation, or status change writes an immutable `AuditEvent`.
