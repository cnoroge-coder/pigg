# Setup Instructions for Litter Management

## Step 1: Run SQL in Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/fccxkgfytweojfflvfnx/sql/new

Copy and paste this SQL:

```sql
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

-- Indexes
CREATE INDEX IF NOT EXISTS "Pregnancy_sowTag_idx" ON "Pregnancy"("sowTag");
CREATE INDEX IF NOT EXISTS "Pregnancy_status_idx" ON "Pregnancy"("status");
CREATE INDEX IF NOT EXISTS "Litter_farrowDate_idx" ON "Litter"("farrowDate");
CREATE INDEX IF NOT EXISTS "Litter_pregnancyId_idx" ON "Litter"("pregnancyId");

-- Enable RLS
ALTER TABLE "Pregnancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Litter" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Allow public read on Pregnancy"
  ON "Pregnancy" FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on Pregnancy"
  ON "Pregnancy" FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public update on Pregnancy"
  ON "Pregnancy" FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read on Litter"
  ON "Litter" FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on Litter"
  ON "Litter" FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public update on Litter"
  ON "Litter" FOR UPDATE USING (true);

-- Helper View
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
```

Click **Run** to execute.

## Step 2: Deploy Backend

The backend code has been committed. Render should automatically deploy the new endpoints:
- `POST /api/v1/pregnancies` - Create pregnancy
- `GET /api/v1/pregnancies` - List all pregnancies
- `POST /api/v1/litters` - Create litter
- `GET /api/v1/litters` - List all litters

Wait for Render deployment to complete (~5 minutes).

## Step 3: Test

Once Vercel and Render deploy:

1. **Test Pig Detail**: Click on any pig card → should now show pig details
2. **Test Add Litter**: 
   - Go to Litters page
   - Click "+ Add Litter" button
   - Fill in the form
   - Submit

## What Was Fixed

### Pig Detail Page
- ✅ Now waits for `animalsLoaded` event before loading pig data
- ✅ Will properly display data for newly added pigs

### Litter Management
- ✅ Add Litter button on litters.html
- ✅ Complete add-litter.html form with validation
- ✅ Auto-calculates breeding date (114 days before farrow date)
- ✅ Validates that Alive + Dead = Number Born
- ✅ Backend endpoints for CRUD operations on pregnancies and litters
- ✅ Database tables with proper indexes and RLS policies
