# SecuTrail — Database Design & Schema Specification

## 1. Zero-PII Survivor Architecture
A cornerstone principle of SecuTrail is that **no survivor personal identifiable information (PII)** or sensitive query logs are ever written to the persistent database.
Survivor interactions occur within ephemeral, client-side, or in-memory RAM sessions that expire after 30 minutes of inactivity and are scrubbed instantly upon Quick Exit.

---

## 2. Prisma Relational Models (15 Models)

The database schema (`prisma/schema.prisma`) models the verified knowledge base, geographic hierarchy, verified resource graph, and administrative audit trails.

### Model Map

| Model | Purpose | Key Fields |
|---|---|---|
| **UserSession** | Ephemeral session tracking | `id`, `token`, `expiresAt`, `isInvalidated`, `lastActiveAt` |
| **Organization** | Provider bodies (Govt, NGOs) | `id`, `name`, `authorityLevel`, `isVerified`, `website` |
| **Region** | Macro geographical regions | `id`, `name`, `code` |
| **State** | Indian States & Union Territories | `id`, `name`, `code`, `regionId` |
| **District** | Administrative districts | `id`, `name`, `stateId` |
| **Resource** | Verified crisis facilities & helplines | `id`, `name`, `serviceType`, `contact`, `operatingHours`, `is24x7`, `verificationStatus`, `authorityLevel`, `isDemo` |
| **Service** | Specific services per facility | `id`, `resourceId`, `category`, `name`, `isFree` |
| **ResourceVerification** | Audit records of facility verification | `id`, `resourceId`, `verifiedBy`, `verifierRole`, `checkType`, `findings`, `newStatus`, `nextReviewDate` |
| **Source** | Statutory & medical authorities | `id`, `title`, `url`, `authority`, `jurisdiction`, `contentVersion`, `verificationStatus` |
| **KnowledgeDocument** | Verified legal/health documents | `id`, `title`, `category`, `sourceId`, `jurisdiction`, `version` |
| **KnowledgeChunk** | Granular text passages for RAG | `id`, `documentId`, `topic`, `content`, `metadataJson`, `embedding` |
| **TriageSession** | Ephemeral triage record | `id`, `sessionId`, `selectedCategories`, `emergencyDetected`, `stateCode` |
| **SafetyClassification** | Recorded classification tags | `id`, `sessionId`, `category`, `urgency`, `requiresEmergencyRouting` |
| **UserFeedback** | Anonymous facility reports | `id`, `resourceId`, `feedbackType`, `comments`, `status` |
| **AuditEvent** | Immutable audit trail | `id`, `resourceId`, `action`, `actorId`, `actorRole`, `details`, `timestamp` |

---

## 3. PostgreSQL & pgvector Configuration

In `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/secutrail?schema=public"
```

To run migrations and client generation:
```bash
npx prisma generate
npx prisma db push
```

### Zero-Configuration Local Fallback
When PostgreSQL credentials are not supplied or `RESOURCE_PROVIDER="demo"`, SecuTrail uses its high-performance in-memory datastore pre-seeded with India's verified crisis registry, ensuring judges can test all features without database setup friction.
