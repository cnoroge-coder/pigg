// Load animals from backend API
(async function() {
  const API_BASE_URL = 'https://pig-3k5m.onrender.com/api/v1';
  
  try {
    console.log('🔄 Loading animals from backend API...');
    const response = await fetch(`${API_BASE_URL}/animals`);
    
    if (!response.ok) {
      console.error('❌ Failed to load animals:', response.status, response.statusText);
      return;
    }
    
    const rawAnimals = await response.json();
    console.log('📦 Raw API response:', rawAnimals);
    
    // Map backend field names to frontend format
    const animals = rawAnimals.map(a => ({
      id: a.id,
      tagNo: a.tagNo || a.tag_no,
      name: a.name,
      type: a.type,
      breed: a.breed,
      dateOfBirth: a.dateOfBirth || a.dob,
      weight: a.weight,
      status: a.status,
      healthStatus: a.healthStatus || a.health_status,
      notes: a.notes,
      imageUrl: a.imageUrl || a.image_url
    }));
    
    console.log('✅ Mapped animals:', animals.length);
    
    // Categorize animals by type
    const sows = animals.filter(a => a.type === 'sow');
    const boars = animals.filter(a => a.type === 'boar');
    const piglets = animals.filter(a => a.type === 'piglet');
    
    console.log(`📊 Counts - Sows: ${sows.length}, Boars: ${boars.length}, Piglets: ${piglets.length}`);
    
    // Initialize or update the Modules object
    if (!window.Modules) window.Modules = {};
    if (!window.Modules.AnimalsModule) window.Modules.AnimalsModule = {};
    
    window.Modules.AnimalsModule.sows = sows;
    window.Modules.AnimalsModule.boars = boars;
    window.Modules.AnimalsModule.piglets = piglets; // Keep as array
    window.Modules.AnimalsModule.all = animals;
    
    console.log('✅ Animals loaded and ready!');
    
    // Load litters
    console.log('🔄 Loading litters from backend API...');
    try {
      const littersResponse = await fetch(`${API_BASE_URL}/litters`);
      if (littersResponse.ok) {
        const litters = await littersResponse.json();
        console.log('📦 Litters loaded:', litters.length);
        window.Modules.AnimalsModule.litters = litters;
      } else {
        console.warn('⚠️ Failed to load litters:', littersResponse.status);
        window.Modules.AnimalsModule.litters = [];
      }
    } catch (error) {
      console.error('❌ Error loading litters:', error);
      window.Modules.AnimalsModule.litters = [];
    }
    
    // Trigger a custom event so pages know data is ready
    window.dispatchEvent(new CustomEvent('animalsLoaded', { detail: { animals, sows, boars, piglets } }));
    
  } catch (error) {
    console.error('❌ Error loading animals from API:', error);
  }
})();
