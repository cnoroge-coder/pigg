// Populate backend API with sample pig data
const API_BASE_URL = 'https://pig-3k5m.onrender.com/api/v1';

const pigs = [
  // Boars
  { tagNo: 'B001', name: 'Thunder', type: 'boar', breed: 'Duroc', dob: '2023-03-15', weight: 250.5, notes: 'Prime breeding boar' },
  { tagNo: 'B002', name: 'Duke', type: 'boar', breed: 'Hampshire', dob: '2023-05-20', weight: 235.0, notes: 'Good temperament' },
  { tagNo: 'B003', name: 'Rocky', type: 'boar', breed: 'Yorkshire', dob: '2023-07-10', weight: 220.0, notes: 'Young breeding stock' },
  
  // Sows
  { tagNo: 'S001', name: 'Daisy', type: 'sow', breed: 'Large White', dob: '2022-06-10', weight: 180.0, notes: 'Experienced mother, 3 litters' },
  { tagNo: 'S002', name: 'Bella', type: 'sow', breed: 'Landrace', dob: '2022-08-15', weight: 175.5, notes: 'Currently pregnant' },
  { tagNo: 'S003', name: 'Lucy', type: 'sow', breed: 'Duroc', dob: '2023-01-20', weight: 165.0, notes: 'First time mother' },
  { tagNo: 'S004', name: 'Molly', type: 'sow', breed: 'Yorkshire', dob: '2023-03-05', weight: 170.0, notes: 'Excellent mothering instincts' }
];

async function populateData() {
  console.log('🐷 Starting to populate backend with pig data...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const pig of pigs) {
    try {
      const response = await fetch(`${API_BASE_URL}/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pig)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created ${pig.type} ${pig.tagNo} - ${pig.name}`);
        successCount++;
      } else {
        const error = await response.json();
        console.error(`❌ Failed to create ${pig.tagNo}:`, error.message || error);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating ${pig.tagNo}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Summary: ${successCount} created, ${errorCount} failed`);
  
  // Verify the data
  console.log('\n🔍 Verifying data...');
  const response = await fetch(`${API_BASE_URL}/animals`);
  const animals = await response.json();
  console.log(`Total animals in backend: ${animals.length}`);
  console.log(`Sows: ${animals.filter(a => a.type === 'sow').length}`);
  console.log(`Boars: ${animals.filter(a => a.type === 'boar').length}`);
}

populateData().catch(console.error);
