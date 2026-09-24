# SecuTrail — Security Architecture & Threat Model

## 1. Security Principles
In crisis safety platforms, application security directly impacts physical user safety. SecuTrail adheres to four fundamental security tenets:
1. **Zero-PII Footprint**: The application does not solicit, require, or persist sensitive user identity data.
2. **Ephemeral In-Memory State**: Active session tokens exist solely in RAM with a 30-minute sliding inactivity expiration.
3. **Deterministic Safety Protection**: Critical physical emergencies, self-harm, and child protection triggers bypass probabilistic model processing.
4. **Guarded Administrative Surface**: Administrative verification endpoints require cryptographic key authentication.

---

## 2. Input & Output Guardrails

### Input Layer
- **PII Sanitization**: Regular expression pattern matching intercepts emails, 10-digit Indian phone numbers, and 12-digit Aadhaar patterns, replacing them with `[REDACTED_...]` before retrieval or processing.
- **Crisis Pre-Screening**: Immediate physical danger and self-harm keywords trigger priority guidance messages and 112 / 1091 / 14416 hotlines.

### Output Layer
- **Anti-Coercion Filter**: Intercepts coercive statements such as *"You must file an FIR"* or *"You have to report"* and replaces them with agency-affirming language (*"Here are the options available to you..."*).
- **Anti-Victim Blaming**: Detects and sanitizes moralistic or interrogative language (*"Why were you out..."*).
- **Anti-Hallucination**: Verifies emergency telephone numbers against a canonical set of statutory helplines.

---

## 3. Administrative Access Control
- All `/api/admin/*` routes enforce `verifyAdminAccess()`:
  - Header inspection: `x-admin-key` or `Authorization: Bearer <key>`
  - Cookie inspection: `secutrail_admin_key`
  - Fallback evaluation query parameter: `?adminKey=<key>`
- Unauthorized requests receive HTTP 401 Unauthorized with no leakage of internal database schema or logs.

---

## 4. Secure Transport & Headers
In production deployments:
- Strict HTTPS enforcement with HSTS (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (Prevent clickjacking attacks)
- `Referrer-Policy: no-referrer`
- `Content-Security-Policy`: Disallows untrusted scripts and external tracking beacons.
