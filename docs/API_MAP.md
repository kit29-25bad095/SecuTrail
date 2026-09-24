# SecuTrail — API Map

All endpoints conform to privacy-first principles: no personal identifiers, no IP tracking, strict input validation via Zod, and security headers.

---

### 1. `/api/triage` [POST]
**Purpose**: Run the deterministic Safety & Risk Classifier and route survivor needs.
- **Request Body**:
  ```json
  {
    "input": "I am in a safe room right now, but I need to know about medical checks.",
    "isEmergencyConfirmed": false,
    "selectedDomains": ["MEDICAL", "LEGAL"]
  }
  ```
- **Response**:
  ```json
  {
    "safetyStatus": "STABLE", // "EMERGENCY_TRIGGERED" | "CRISIS_TRIGGERED" | "STABLE"
    "riskLevel": "MEDIUM",
    "emergencyHotlines": [],
    "identifiedDomains": ["MEDICAL", "LEGAL"],
    "timeCriticalAlerts": [
      {
        "type": "PEP_WINDOW",
        "title": "72-Hour PEP Window",
        "description": "Post-Exposure Prophylaxis for HIV prevention is most effective within 72 hours."
      }
    ],
    "suggestedOptions": [
      {
        "domain": "MEDICAL",
        "title": "Confidential Medical Consultation",
        "considerations": "Evidence preservation should precede bathing/washing if legal steps are desired."
      }
    ]
  }
  ```

---

### 2. `/api/chat` [POST]
**Purpose**: Verified RAG AI Assistant with strict source citations and deterministic safety guardrails.
- **Request Body**:
  ```json
  {
    "messages": [
      {"role": "user", "content": "What is a Zero FIR in India?"}
    ],
    "sessionToken": "ephemeral-token-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "message": {
      "role": "assistant",
      "content": "A Zero FIR allows a victim to lodge an FIR at any police station regardless of jurisdiction...",
      "citations": [
        {
          "title": "Ministry of Home Affairs Advisory / CrPC / BNSS 2023",
          "section": "Zero FIR Provisions",
          "confidence": "VERIFIED"
        }
      ],
      "disclaimer": "This information is educational and does not constitute formal legal counsel."
    }
  }
  ```

---

### 3. `/api/resources` [GET]
**Purpose**: Query verified resource graph by location, domain, and type.
- **Query Params**:
  - `city` (string, optional)
  - `state` (string, optional)
  - `domains` (comma-separated: MEDICAL, EMOTIONAL, LEGAL)
  - `type` (optional: HOSPITAL, CRISIS_CENTER, HELPLINE, LEGAL_AID)
  - `is24x7` (optional boolean)
- **Response**:
  ```json
  {
    "resources": [
      {
        "id": "res_1",
        "name": "One Stop Centre (Sakhi) - Coimbatore",
        "type": "CRISIS_CENTER",
        "domains": ["MEDICAL", "EMOTIONAL", "LEGAL"],
        "primaryPhone": "0422-XXXXXXX",
        "is24x7": true,
        "verificationTier": "TIER_1_OFFICIAL_GOVERNMENT",
        "status": "VERIFIED",
        "lastVerifiedAt": "2026-09-15T00:00:00.000Z"
      }
    ],
    "total": 1
  }
  ```

---

### 4. `/api/verify` [POST]
**Purpose**: Admin verification workflow to audit and update resources.
- **Request Body**:
  ```json
  {
    "resourceId": "res_1",
    "newStatus": "VERIFIED",
    "verifierName": "Auditor Maya P",
    "checkType": "PHONE_CHECK",
    "findings": "Verified helpline responsiveness, operating 24/7."
  }
  ```

---

### 5. `/api/session` [POST, DELETE]
**Purpose**: Heartbeat for ephemeral sessions and explicit server-side state drop.
- **POST**: Issues a transient non-persistent session token for client-side encryption.
- **DELETE**: Zeroes any ephemeral memory references.
