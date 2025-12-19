-- Complete Piglet Tracking System Schema
-- This extends the existing pig farm system with comprehensive piglet management

-- ============ PIGLETS TABLE ============
-- Individual piglet tracking from birth to sale
CREATE TABLE IF NOT EXISTS "Piglet" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tagNo" TEXT UNIQUE NOT NULL,
  "litterId" TEXT NOT NULL,
  "sex" TEXT NOT NULL CHECK ("sex" IN ('male', 'female')),
  "birthWeight" DOUBLE PRECISION,
  "currentWeight" DOUBLE PRECISION,
  "weaningWeight" DOUBLE PRECISION,
  "weaningDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'nursing' CHECK ("status" IN ('nursing', 'weaned', 'fattening', 'ready_for_sale', 'sold', 'deceased')),
  "healthStatus" TEXT DEFAULT 'healthy' CHECK ("healthStatus" IN ('healthy', 'sick', 'recovering', 'deceased')),
  "notes" TEXT,
  "saleDate" TIMESTAMP(3),
  "salePrice" DOUBLE PRECISION,
  "buyer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("litterId") REFERENCES "Litter"("id") ON DELETE CASCADE
);

-- ============ PIGLET WEIGHT HISTORY ============
CREATE TABLE IF NOT EXISTS "PigletWeightRecord" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "pigletId" TEXT NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("pigletId") REFERENCES "Piglet"("id") ON DELETE CASCADE
);

-- ============ PIGLET FEED RECORDS ============
CREATE TABLE IF NOT EXISTS "PigletFeedRecord" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "pigletId" TEXT NOT NULL,
  "feedType" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL DEFAULT 'kg',
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cost" DOUBLE PRECISION,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("pigletId") REFERENCES "Piglet"("id") ON DELETE CASCADE
);

-- ============ ALERTS TABLE ============
CREATE TABLE IF NOT EXISTS "Alert" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "type" TEXT NOT NULL CHECK ("type" IN ('health', 'feeding', 'vaccination', 'weaning', 'breeding', 'weight', 'general')),
  "priority" TEXT NOT NULL DEFAULT 'medium' CHECK ("priority" IN ('low', 'medium', 'high', 'critical')),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "relatedEntityType" TEXT CHECK ("relatedEntityType" IN ('animal', 'litter', 'piglet', 'pregnancy', 'general')),
  "relatedEntityId" TEXT,
  "dueDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'resolved', 'dismissed')),
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Piglet_litterId_idx" ON "Piglet"("litterId");
CREATE INDEX IF NOT EXISTS "Piglet_status_idx" ON "Piglet"("status");
CREATE INDEX IF NOT EXISTS "Piglet_sex_idx" ON "Piglet"("sex");
CREATE INDEX IF NOT EXISTS "Piglet_tagNo_idx" ON "Piglet"("tagNo");

CREATE INDEX IF NOT EXISTS "PigletWeightRecord_pigletId_idx" ON "PigletWeightRecord"("pigletId");
CREATE INDEX IF NOT EXISTS "PigletWeightRecord_date_idx" ON "PigletWeightRecord"("date");

CREATE INDEX IF NOT EXISTS "PigletFeedRecord_pigletId_idx" ON "PigletFeedRecord"("pigletId");
CREATE INDEX IF NOT EXISTS "PigletFeedRecord_date_idx" ON "PigletFeedRecord"("date");

CREATE INDEX IF NOT EXISTS "Alert_status_idx" ON "Alert"("status");
CREATE INDEX IF NOT EXISTS "Alert_priority_idx" ON "Alert"("priority");
CREATE INDEX IF NOT EXISTS "Alert_dueDate_idx" ON "Alert"("dueDate");
CREATE INDEX IF NOT EXISTS "Alert_relatedEntity_idx" ON "Alert"("relatedEntityType", "relatedEntityId");

-- Enable Row Level Security
ALTER TABLE "Piglet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PigletWeightRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PigletFeedRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Alert" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on Piglet" ON "Piglet";
DROP POLICY IF EXISTS "Allow public insert on Piglet" ON "Piglet";
DROP POLICY IF EXISTS "Allow public update on Piglet" ON "Piglet";
DROP POLICY IF EXISTS "Allow public delete on Piglet" ON "Piglet";

DROP POLICY IF EXISTS "Allow public read on PigletWeightRecord" ON "PigletWeightRecord";
DROP POLICY IF EXISTS "Allow public insert on PigletWeightRecord" ON "PigletWeightRecord";

DROP POLICY IF EXISTS "Allow public read on PigletFeedRecord" ON "PigletFeedRecord";
DROP POLICY IF EXISTS "Allow public insert on PigletFeedRecord" ON "PigletFeedRecord";

DROP POLICY IF EXISTS "Allow public read on Alert" ON "Alert";
DROP POLICY IF EXISTS "Allow public insert on Alert" ON "Alert";
DROP POLICY IF EXISTS "Allow public update on Alert" ON "Alert";

-- Create public access policies
CREATE POLICY "Allow public read on Piglet"
  ON "Piglet" FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on Piglet"
  ON "Piglet" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on Piglet"
  ON "Piglet" FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete on Piglet"
  ON "Piglet" FOR DELETE
  USING (true);

CREATE POLICY "Allow public read on PigletWeightRecord"
  ON "PigletWeightRecord" FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on PigletWeightRecord"
  ON "PigletWeightRecord" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read on PigletFeedRecord"
  ON "PigletFeedRecord" FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on PigletFeedRecord"
  ON "PigletFeedRecord" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read on Alert"
  ON "Alert" FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on Alert"
  ON "Alert" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on Alert"
  ON "Alert" FOR UPDATE
  USING (true);

-- Helpful views
CREATE OR REPLACE VIEW piglet_summary AS
SELECT 
  p.*,
  l."farrowDate",
  l."numberBorn",
  pr."sowId",
  pr."boarId",
  a."name" as "sowName",
  a."tagNo" as "sowTag"
FROM "Piglet" p
JOIN "Litter" l ON p."litterId" = l."id"
JOIN "Pregnancy" pr ON l."pregnancyId" = pr."id"
LEFT JOIN "Animal" a ON pr."sowId" = a."id"
ORDER BY p."createdAt" DESC;

CREATE OR REPLACE VIEW active_alerts AS
SELECT 
  *
FROM "Alert"
WHERE "status" = 'active'
ORDER BY 
  CASE "priority"
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  "dueDate" ASC NULLS LAST,
  "createdAt" DESC;
