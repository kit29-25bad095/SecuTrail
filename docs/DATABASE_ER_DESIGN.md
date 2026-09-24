# SecuTrail — Database Entity-Relationship Design

## 1. Overview
The SecuTrail database schema is designed for PostgreSQL with `pgvector` extension support.
It satisfies two critical criteria:
1. **Zero-PII Survivor Records**: Survivor interactions, chats, triage selections, and notes are never stored in the persistent database. They exist solely in ephemeral, client-side/in-memory session state.
2. **Verified Knowledge & Verified Resource Graph**: Richly structured, auditable schema for resources, categories, verifications, and knowledge chunks.

---

## 2. Schema Specification (Prisma Model)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ResourceType {
  HOSPITAL
  CRISIS_CENTER
  POLICE_STATION
  LEGAL_AID
  SHELTER
  HELPLINE
  COMMUNITY_SUPPORT
}

enum VerificationTier {
  TIER_1_OFFICIAL_GOVERNMENT  // Official Govt department, Police, NALSA, Govt Hospital
  TIER_2_VETTED_NGO           // Registered, audited NGO with physical verification
  TIER_3_COMMUNITY_VERIFIED   // Community/Peer-verified with dual references
}

enum VerificationStatus {
  VERIFIED
  PENDING_REVIEW
  NEEDS_UPDATE
  EXPIRED
  REJECTED
}

enum TriageDomain {
  MEDICAL
  EMOTIONAL
  LEGAL
  GENERAL
}

model Resource {
  id              String             @id @default(cuid())
  name            String
  type            ResourceType
  domains         TriageDomain[]
  description     String
  address         String?
  city            String
  state           String
  country         String             @default("India")
  latitude        Float?
  longitude       Float?
  primaryPhone    String
  secondaryPhone  String?
  email           String?
  website         String?
  is24x7          Boolean            @default(false)
  operatingHours  String?
  servicesOffered String[]
  languages       String[]           @default(["English", "Hindi"])
  verificationTier VerificationTier  @default(TIER_2_VETTED_NGO)
  status          VerificationStatus @default(VERIFIED)
  lastVerifiedAt  DateTime           @default(now())
  verifiedBy      String             // Admin/Auditor identifier
  verificationProof String?          // Document or reference link
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  verifications   ResourceVerification[]
  auditLogs       ResourceAuditLog[]

  @@index([city, state])
  @@index([type])
  @@index([status])
}

model ResourceVerification {
  id              String             @id @default(cuid())
  resourceId      String
  resource        Resource           @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  verifierName    String
  verifierRole    String
  checkType       String             // "PHONE_CHECK", "SITE_VISIT", "OFFICIAL_REGISTER"
  findings        String
  newStatus       VerificationStatus
  verifiedAt      DateTime           @default(now())
  nextReviewDate  DateTime
}

model ResourceAuditLog {
  id              String             @id @default(cuid())
  resourceId      String
  resource        Resource           @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  action          String             // "CREATED", "STATUS_CHANGED", "PHONE_UPDATED", etc.
  actor           String
  details         String
  timestamp       DateTime           @default(now())
}

model KnowledgeChunk {
  id              String             @id @default(cuid())
  domain          TriageDomain
  topic           String             // e.g. "PEP_72_HOURS", "ZERO_FIR", "5DS_BYSTANDER"
  title           String
  content         String
  sourceTitle     String             // e.g. "WHO Post-Assault Protocol", "BNS 2023 Handbook"
  sourceUrl       String?
  publishedYear   Int?
  jurisdiction    String             @default("National / India")
  isVerified      Boolean            @default(true)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([domain])
  @@index([topic])
}

model SystemMetric {
  id              String             @id @default(cuid())
  metricType      String             // "QUICK_EXIT_TRIGGERED", "AWARENESS_MODULE_VIEWED"
  counter         Int                @default(1)
  recordedDate    DateTime           @default(now())
  // Strict Privacy: Zero IP, Zero User ID, Zero input payload
}
```
