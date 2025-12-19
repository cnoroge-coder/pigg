// Load animals from backend API
(async function() {
  const API_BASE_URL = 'https://pig-3k5m.onrender.com/api/v1';
  
  try {
    console.log('Loading animals from backend API...');
    const response = await fetch(`${API_BASE_URL}/animals`);
    
    if (!response.ok) {
      console.error('Failed to load animals:', response.status);
      return;
    }
    
    const animals = await response.json();
    console.log('Loaded animals from API:', animals.length);
    
    // Categorize animals by type
    const sows = animals.filter(a => a.type === 'sow');
    const boars = animals.filter(a => a.type === 'boar');
    const piglets = animals.filter(a => a.type === 'piglet');
    
    // Update the Modules object if it exists
    if (window.Modules && window.Modules.AnimalsModule) {
      window.Modules.AnimalsModule.sows = sows;
      window.Modules.AnimalsModule.boars = boars;
      window.Modules.AnimalsModule.piglets = piglets;
      window.Modules.AnimalsModule.all = animals;
      console.log(`✅ Loaded: ${sows.length} sows, ${boars.length} boars, ${piglets.length} piglets`);
    }
    
    // Trigger a custom event so pages know data is ready
    window.dispatchEvent(new CustomEvent('animalsLoaded', { detail: { animals, sows, boars, piglets } }));
    
  } catch (error) {
    console.error('Error loading animals from API:', error);
  }
})();
