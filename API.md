# SecuTrail — API Reference & Map

All API endpoints follow REST conventions and return structured JSON responses.

---

## 1. Ephemeral Session Management

### `POST /api/session`
Creates a new anonymous, ephemeral session.
- **Request Body**: `{ triage?: { domains: string[] } }`
- **Response**: `{ success: true, sessionId: string, expiresAt: number }`

### `GET /api/session?sessionId=...`
Retrieves session metadata if active and unexpired.
- **Response**: `{ success: true, session: { id, expiresAt, triage } }`

### `POST /api/session/exit`
Immediately invalidates the session upon Quick Exit. Fire-and-forget; never blocks user navigation.
- **Request Body**: `{ sessionId: string }`
- **Response**: `{ success: true, message: "Session invalidated safely" }`

### `DELETE /api/session?sessionId=...`
Explicitly deletes session from memory.

---

## 2. Safety & Triage

### `POST /api/classify`
Executes deterministic risk analysis before conversational generation.
- **Request Body**: `{ text: string }`
- **Response**:
  ```json
  {
    "success": true,
    "classification": {
      "category": "IMMEDIATE_DANGER" | "MEDICAL_URGENCY" | "EMOTIONAL_DISTRESS" | "LEGAL_INFO" | "MINOR_INVOLVEMENT" | "GENERAL_AWARENESS",
      "urgency": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "requiresEmergencyRouting": boolean,
      "requiresHumanReview": boolean,
      "detectedFlags": string[],
      "recommendedPaths": ["MEDICAL", "EMOTIONAL", "LEGAL"],
      "guidanceMessage": string,
      "rationale": string
    },
    "piiRedacted": boolean
  }
  ```

### `POST /api/triage`
Processes multi-path triage care selections and returns tailored agency options and verified resources.
- **Request Body**:
  ```json
  {
    "domains": ["MEDICAL", "EMOTIONAL"],
    "timeframe": "UNDER_72_HOURS",
    "state": "Delhi",
    "district": "South Delhi",
    "sessionId": "sess_..."
  }
  ```
- **Response**: `{ success: true, triage, options, recommendedResources }`

---

## 3. Verified Decision Assistant

### `POST /api/assistant`
Executes the full 9-stage verified RAG pipeline.
- **Request Body**:
  ```json
  {
    "query": "What is the PEP timeframe for HIV prevention?",
    "domains": ["MEDICAL"],
    "state": "Delhi",
    "district": "South Delhi"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "structuredExplanation": string,
    "relevantDomains": ["MEDICAL"],
    "safetyClassification": { ... },
    "verifiedResources": [ ... ],
    "citations": [ ... ],
    "agencyOptions": [ ... ],
    "guardrailFlags": []
  }
  ```

---

## 4. Verified Resource Graph

### `GET /api/resources`
Filters and lists verified crisis resources.
- **Query Parameters**:
  - `domain`: `MEDICAL`, `EMOTIONAL`, `LEGAL`
  - `state`: Indian state name
  - `district`: District name
  - `is24x7`: `true` | `false`
  - `includeDemo`: `true` | `false`
  - `status`: `VERIFIED`
- **Response**: `{ success: true, count: number, resources: VerifiedResource[] }`

### `GET /api/resources/[id]`
Retrieves full verification and contact details for a single resource.

### `GET /api/resources/search?q=...`
Performs keyword text search across names, cities, and services.

### `POST /api/feedback`
Records an anonymous user report regarding non-working phone lines or address changes.
- **Request Body**: `{ resourceId: string, feedbackType: string, comments?: string }`
- **Response**: `{ success: true, message: string, feedbackId: string }`

---

## 5. Administrative Verification APIs
*(Requires `x-admin-key: secutrail-admin-demo-key-2026` or query `adminKey`)*

### `GET /api/admin/resources`
Lists all resources with internal audit details.

### `POST /api/admin/resources`
Creates and registers a new verified resource.

### `PATCH /api/admin/resources/[id]`
Updates resource parameters, availability, or contact information.

### `POST /api/admin/resources/[id]/verify`
Certifies a verification audit (findings, check type, new status, next review date).

### `GET /api/admin/resources/verification`
Returns verification health summary, expired resources, and upcoming reviews.

### `GET /api/admin/feedback`
Retrieves reported resource issues queue for audit triage.
