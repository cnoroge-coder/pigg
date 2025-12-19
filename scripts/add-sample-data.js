const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSampleData() {
  console.log('🌱 Adding sample data to database...\n');

  try {
    // 1. Add Alerts
    console.log('📢 Adding alerts...');
    const alerts = [
      {
        type: 'vaccination',
        priority: 'high',
        title: 'Vaccination Due for Sow Group A',
        description: 'Annual vaccination for breeding sows is due this week',
        relatedEntityType: 'general',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'active'
      },
      {
        type: 'weaning',
        priority: 'medium',
        title: 'Litter Weaning Scheduled',
        description: 'Litter from Sow #101 is ready for weaning',
        relatedEntityType: 'litter',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'active'
      },
      {
        type: 'health',
        priority: 'critical',
        title: 'Health Check Required',
        description: 'Boar showing signs of reduced appetite',
        relatedEntityType: 'animal',
        dueDate: new Date(), // today
        status: 'active'
      },
      {
        type: 'feeding',
        priority: 'low',
        title: 'Feed Stock Low',
        description: 'Grower feed inventory below threshold',
        relatedEntityType: 'general',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        status: 'active'
      }
    ];

    for (const alert of alerts) {
      await prisma.alert.create({ data: alert });
    }
    console.log(`✅ Added ${alerts.length} alerts\n`);

    // 2. Add Events
    console.log('📅 Adding events...');
    
    // Get existing animals to attach events to
    const animals = await prisma.animal.findMany({ take: 5 });
    
    if (animals.length > 0) {
      const events = [
        {
          animalId: animals[0]?.id,
          type: 'Vaccination',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          description: 'Annual vaccination',
          notes: 'Use vaccine batch #2024-12',
          resolved: false
        },
        {
          animalId: animals[1]?.id,
          type: 'Health Check',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          description: 'Routine health inspection',
          resolved: false
        },
        {
          animalId: animals[2]?.id,
          type: 'Weight Check',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          description: 'Monthly weight monitoring',
          resolved: false
        },
        {
          animalId: animals[0]?.id,
          type: 'Treatment',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (missed)
          description: 'Deworming treatment',
          notes: 'Missed treatment - needs rescheduling',
          resolved: false
        },
        {
          animalId: animals[1]?.id,
          type: 'Breeding',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (missed)
          description: 'Breeding scheduled',
          resolved: false
        }
      ];

      for (const event of events) {
        await prisma.event.create({ data: event });
      }
      console.log(`✅ Added ${events.length} events\n`);
    }

    // 3. Add Pregnancies
    console.log('🤰 Adding pregnancies...');
    
    const sows = await prisma.animal.findMany({ 
      where: { type: 'sow' },
      take: 3
    });

    const boars = await prisma.animal.findMany({ 
      where: { type: 'boar' },
      take: 2
    });

    if (sows.length > 0 && boars.length > 0) {
      const pregnancies = [
        {
          sowId: sows[0].id,
          boarId: boars[0]?.id,
          dateServed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          expectedFarrowing: new Date(Date.now() + 54 * 24 * 60 * 60 * 1000), // 54 days from now (114 days total)
          status: 'pregnant',
          notes: 'First pregnancy, monitor closely'
        },
        {
          sowId: sows[1]?.id,
          boarId: boars[1]?.id,
          dateServed: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
          expectedFarrowing: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
          status: 'pregnant',
          notes: 'Experienced mother, previous litter of 12'
        },
        {
          sowId: sows[2]?.id,
          boarId: boars[0]?.id,
          dateServed: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000), // 114 days ago
          expectedFarrowing: new Date(Date.now()), // today (due to farrow)
          actualFarrowing: new Date(),
          status: 'farrowed',
          notes: 'Healthy delivery'
        }
      ];

      for (const pregnancy of pregnancies) {
        if (pregnancy.sowId && pregnancy.boarId) {
          await prisma.pregnancy.create({ data: pregnancy });
        }
      }
      console.log(`✅ Added ${pregnancies.length} pregnancies\n`);
    }

    // 4. Add Piglet-specific data
    console.log('🐷 Adding piglet data...');
    
    const piglets = await prisma.piglet.findMany({ take: 5 });
    
    if (piglets.length > 0) {
      // Add weight records
      for (const piglet of piglets) {
        const weightRecords = [
          {
            pigletId: piglet.id,
            weight: piglet.birthWeight || 1.5,
            date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            notes: 'Birth weight'
          },
          {
            pigletId: piglet.id,
            weight: (piglet.birthWeight || 1.5) + 2,
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            notes: '10-day check'
          },
          {
            pigletId: piglet.id,
            weight: (piglet.birthWeight || 1.5) + 4,
            date: new Date(),
            notes: 'Current weight'
          }
        ];

        for (const record of weightRecords) {
          await prisma.pigletWeightRecord.create({ data: record });
        }

        // Add feed records
        const feedRecords = [
          {
            pigletId: piglet.id,
            feedType: 'Starter Feed',
            quantity: 0.5,
            unit: 'kg',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            cost: 2.5
          },
          {
            pigletId: piglet.id,
            feedType: 'Grower Feed',
            quantity: 1.0,
            unit: 'kg',
            date: new Date(),
            cost: 3.0
          }
        ];

        for (const record of feedRecords) {
          await prisma.pigletFeedRecord.create({ data: record });
        }

        // Update piglet with maturity tracking
        await prisma.piglet.update({
          where: { id: piglet.id },
          data: {
            currentWeight: (piglet.birthWeight || 1.5) + 4,
            updatedAt: new Date()
          }
        });
      }
      console.log(`✅ Added weight and feed records for ${piglets.length} piglets\n`);
    }

    // 5. Add Weaning data
    console.log('🍼 Adding weaning records...');
    
    const litters = await prisma.litter.findMany({ 
      take: 2,
      where: { weaningDate: null }
    });

    if (litters.length > 0) {
      for (const litter of litters) {
        await prisma.litter.update({
          where: { id: litter.id },
          data: {
            weaningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            weaningWeight: 6.5,
            notes: 'Scheduled for weaning next week'
          }
        });
      }
      console.log(`✅ Updated ${litters.length} litters with weaning schedules\n`);
    }

    console.log('✨ Sample data added successfully!');
    console.log('\nSummary:');
    console.log(`- Alerts: ${alerts.length}`);
    console.log(`- Events: ${animals.length > 0 ? 5 : 0}`);
    console.log(`- Pregnancies: ${sows.length > 0 && boars.length > 0 ? 3 : 0}`);
    console.log(`- Piglet records: ${piglets.length > 0 ? piglets.length * 5 : 0}`);
    console.log(`- Weaning schedules: ${litters.length}`);

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addSampleData()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
