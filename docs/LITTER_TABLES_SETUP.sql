-- SQL to ensure Pregnancy and Litter tables exist in Supabase
-- Run this in Supabase SQL Editor if tables are missing

-- Pregnancy Table
CREATE TABLE IF NOT EXISTS "Pregnancy" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sowTag" TEXT NOT NULL,
  "boarTag" TEXT,
  "breedingDate" TIMESTAMP(3) NOT NULL,
  "expectedDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'Expecting',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Litter Table
CREATE TABLE IF NOT EXISTS "Litter" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "pregnancyId" TEXT UNIQUE NOT NULL,
  "farrowDate" TIMESTAMP(3) NOT NULL,
  "numberBorn" INTEGER NOT NULL,
  "alive" INTEGER NOT NULL,
  "dead" INTEGER NOT NULL,
  "weaningDate" TIMESTAMP(3),
  "weaningWeight" DOUBLE PRECISION,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "Pregnancy_sowTag_idx" ON "Pregnancy"("sowTag");
CREATE INDEX IF NOT EXISTS "Pregnancy_status_idx" ON "Pregnancy"("status");
CREATE INDEX IF NOT EXISTS "Litter_farrowDate_idx" ON "Litter"("farrowDate");
CREATE INDEX IF NOT EXISTS "Litter_pregnancyId_idx" ON "Litter"("pregnancyId");

-- Enable Row Level Security (optional - adjust policies as needed)
ALTER TABLE "Pregnancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Litter" ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your security needs)
CREATE POLICY IF NOT EXISTS "Allow public read on Pregnancy"
  ON "Pregnancy" FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on Pregnancy"
  ON "Pregnancy" FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public update on Pregnancy"
  ON "Pregnancy" FOR UPDATE
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read on Litter"
  ON "Litter" FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on Litter"
  ON "Litter" FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public update on Litter"
  ON "Litter" FOR UPDATE
  USING (true);

-- Optional: Add some helpful views
CREATE OR REPLACE VIEW litter_summary AS
SELECT 
  l.*,
  p."sowTag",
  p."boarTag",
  p."breedingDate",
  (l."numberBorn" - l."dead") as "survivingPiglets"
FROM "Litter" l
JOIN "Pregnancy" p ON l."pregnancyId" = p."id"
ORDER BY l."farrowDate" DESC;
