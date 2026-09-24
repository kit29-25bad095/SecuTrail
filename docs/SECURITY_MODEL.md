# SecuTrail — Security Model

## 1. Threat Model
SecuTrail operates in high-adversity environments where users may face:
1. **Physical Device Inspection**: An abusive partner, family member, or hostile individual demanding to see the user's phone/computer.
2. **Network/Wi-Fi Snooping**: Local network sniffing or router DNS log analysis.
3. **Prompt Injection / Jailbreak Attacks**: Malicious attempts to trick the AI into generating harmful, victim-blaming, or inaccurate legal/medical instructions.
4. **Data Leakage / Subpoena Exposure**: Unauthorized attempts to access survivor records.

---

## 2. Defensive Controls

### 2.1 Content Security & Header Protection
- Strict `Content-Security-Policy`:
  - `default-src 'self'`
  - Disallow third-party tracking scripts, ad networks, or social widgets.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer` (Prevents leaking query parameters or referrer headers to external sites).

### 2.2 Dual-Layer AI Guardrails
- **Deterministic Input Guardrails**:
  - Regular expressions scan for suicide/self-harm keywords and active physical danger.
  - Short-circuit immediately to emergency dialer responses.
- **Output Validation & Sanitization**:
  - Responses are scanned to ensure no medical diagnosis is rendered.
  - Verifies that any hotline or emergency number mentioned matches the verified database.
  - Automatically appends non-directive disclaimers.

### 2.3 Tamper-Evident Audit Logging
- Resource edits and status modifications by administrators are recorded with timestamp, actor name, verification check type, and findings.
- Survivor interactions generate zero audit logs to preserve absolute anonymity.
