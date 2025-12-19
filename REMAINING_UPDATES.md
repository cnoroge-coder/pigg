# Remaining Updates Needed

## Completed ✅
1. Piglet page now shows Details + Events side by side by default
2. Added "Piglets" link to navigation
3. Changed tabs to: Weight History, Feed Records, Status
4. Added Stage field (need to add to database/Prisma)

## To Complete 📋

### 1. Piglet Page JavaScript Updates
- ✅ Fix weight gain calculation (current - previous weight)
- ✅ Remove Total Feed Records from metrics
- ✅ Remove cost and quantity from feed display  
- ⚠️ Need to add renderEvents() and renderStatusPane() functions
- ⚠️ Need to add getStageBadge() function
- ⚠️ Update setupTabs() for new tab structure

### 2. Dashboard Updates (High Priority)
- Show only 3 upcoming events
- Show alerts that are either:
  * Missed (past due date)
  * OR at least 1 week away
- Remove "healthy" status display
- Add clickable alerts that navigate to pig page

### 3. Events Page (Main Page)
- Add ability to select multiple pigs for an event
- Dropdown or multi-select for pig selection
- Options: "All pigs", "All sows", "All boars", "Specific pigs"
- Show upcoming events in chronological order
- Add "Recent Events" button/view

### 4. Database Schema Updates Needed
- Add `stage` field to Piglet table:
  ```sql
  ALTER TABLE "Piglet" ADD COLUMN "stage" TEXT DEFAULT 'nursing';
  ```
  Stages: nursing, weaned, grower, finisher, ready_for_sale, sold

### 5. Navigation Updates
- ✅ Add Piglets to all page headers

## Quick Fixes Needed Now

1. Complete piglet.html JavaScript functions
2. Add stage column to database
3. Update dashboard to show alerts properly

## Files to Update
- site/piglet.html (partial - need JS functions)
- site/index.html (dashboard alerts/events)  
- site/events.html (multi-pig selection)
- docs/PIGLET_SYSTEM_SCHEMA.sql (add stage column)
