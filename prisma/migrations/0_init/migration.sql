-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('HOSPITAL', 'CRISIS_CENTER', 'POLICE_STATION', 'LEGAL_AID', 'SHELTER', 'HELPLINE', 'COMMUNITY_SUPPORT');

-- CreateEnum
CREATE TYPE "VerificationTier" AS ENUM ('TIER_1_OFFICIAL_GOVERNMENT', 'TIER_2_VETTED_NGO', 'TIER_3_COMMUNITY_VERIFIED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING_REVIEW', 'NEEDS_UPDATE', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TriageDomain" AS ENUM ('MEDICAL', 'EMOTIONAL', 'LEGAL', 'GENERAL');

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "domains" "TriageDomain"[],
    "description" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "is24x7" BOOLEAN NOT NULL DEFAULT false,
    "operatingHours" TEXT,
    "servicesOffered" TEXT[],
    "languages" TEXT[] DEFAULT ARRAY['English', 'Hindi']::TEXT[],
    "verificationTier" "VerificationTier" NOT NULL DEFAULT 'TIER_2_VETTED_NGO',
    "status" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBy" TEXT NOT NULL,
    "verificationProof" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVerification" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "verifierName" TEXT NOT NULL,
    "verifierRole" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "newStatus" "VerificationStatus" NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAuditLog" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "domain" "TriageDomain" NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "publishedYear" INTEGER,
    "jurisdiction" TEXT NOT NULL DEFAULT 'National / India',
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemMetric" (
    "id" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    "recordedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resource_city_state_idx" ON "Resource"("city", "state");

-- CreateIndex
CREATE INDEX "Resource_type_idx" ON "Resource"("type");

-- CreateIndex
CREATE INDEX "Resource_status_idx" ON "Resource"("status");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_domain_idx" ON "KnowledgeChunk"("domain");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_topic_idx" ON "KnowledgeChunk"("topic");

-- AddForeignKey
ALTER TABLE "ResourceVerification" ADD CONSTRAINT "ResourceVerification_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAuditLog" ADD CONSTRAINT "ResourceAuditLog_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
