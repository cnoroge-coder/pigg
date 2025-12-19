# Database Schema Updates

## Changes Made

1. **Event Model Updates**
   - Added `resolved` field (Boolean, default: false)
   - Added `resolvedAt` field (DateTime, optional)
   - Added index on `resolved` field

2. **Piglet Model Updates**
   - Added `maturityWeeks` field (Int, optional) - Target weeks to maturity
   - Added `maturitySetDate` field (DateTime, optional) - Date when maturity target was set

## How to Apply Migration

### Step 1: Generate Migration
```bash
cd server
npx prisma migrate dev --name add_resolved_and_maturity_fields
```

### Step 2: Push to Database
```bash
npx prisma db push
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Add Sample Data
```bash
node ../scripts/add-sample-data.js
```

## Alternative: If Migration Fails

If you encounter issues with migration, you can manually update the database:

```sql
-- Add resolved fields to Event table
ALTER TABLE "Event" ADD COLUMN "resolved" BOOLEAN DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "resolvedAt" TIMESTAMP;
CREATE INDEX "Event_resolved_idx" ON "Event"("resolved");

-- Add maturity fields to Piglet table
ALTER TABLE "Piglet" ADD COLUMN "maturityWeeks" INTEGER;
ALTER TABLE "Piglet" ADD COLUMN "maturitySetDate" TIMESTAMP;
```

Then run:
```bash
npx prisma db pull
npx prisma generate
```

## Testing

After applying migration:
1. Check dashboard alerts work correctly
2. Test event resolution functionality
3. Test piglet maturity tracking
4. Verify missed events appear correctly
5. Test scrollable alerts section
