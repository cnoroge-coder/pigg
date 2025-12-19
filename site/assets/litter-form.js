// Logic for Add Litter form
(function(){
  function qs(id){ return document.getElementById(id); }
  const form = qs('litterForm'); if(!form) return;
  const msg = qs('formMsg');
  const { AnimalsModule } = window.Modules;

  function setMessage(text,type){
    if(!msg) return;
    msg.textContent = text;
    msg.className = 'form-msg ' + (type||'');
  }

  // Wait for animals to load, then populate mother and father dropdowns
  function populateDropdowns() {
    const motherSelect = qs('motherName');
    const fatherSelect = qs('fatherName');
    
    if(!motherSelect || !fatherSelect) {
      console.error('Mother or Father select not found');
      return;
    }
    
    const { AnimalsModule } = window.Modules;
    if(!AnimalsModule) {
      console.error('AnimalsModule not available');
      return;
    }
    
    console.log('Populating dropdowns...');
    console.log('Available sows:', AnimalsModule.sows ? AnimalsModule.sows.length : 0);
    console.log('Available boars:', AnimalsModule.boars ? AnimalsModule.boars.length : 0);
    
    // Populate mothers (sows)
    motherSelect.innerHTML = '<option value="">-- Optional --</option>';
    if(AnimalsModule.sows && AnimalsModule.sows.length > 0) {
      AnimalsModule.sows.forEach(s=> {
        const displayName = s.name || s.tagNo || 'Unnamed';
        console.log('Adding sow:', displayName);
        motherSelect.append(new Option(displayName, displayName));
      });
    } else {
      console.warn('No sows available');
    }
    
    // Populate fathers (boars)
    fatherSelect.innerHTML = '<option value="">-- Optional --</option>';
    if(AnimalsModule.boars && AnimalsModule.boars.length > 0) {
      AnimalsModule.boars.forEach(b=> {
        const displayName = b.name || b.tagNo || 'Unnamed';
        console.log('Adding boar:', displayName);
        fatherSelect.append(new Option(displayName, displayName));
      });
    } else {
      console.warn('No boars available');
    }
    
    console.log('Dropdowns populated!');
  }

  // Wait for animals loaded event
  document.addEventListener('animalsLoaded', () => {
    console.log('animalsLoaded event received');
    populateDropdowns();
  });
  
  // Try to populate immediately if already loaded
  setTimeout(() => {
    if(window.Modules && window.Modules.AnimalsModule && window.Modules.AnimalsModule.all && window.Modules.AnimalsModule.all.length > 0) {
      console.log('Animals already loaded, populating immediately');
      populateDropdowns();
    } else {
      console.log('Waiting for animals to load...');
    }
  }, 500);

  function collect(){
    return {
      motherName: qs('motherName').value.trim(),
      fatherName: qs('fatherName').value.trim() || null,
      farrowDate: qs('farrowDate').value,
      numberBorn: qs('numberBorn').value.trim(),
      alive: qs('alive').value.trim(),
      dead: qs('dead').value.trim() || '0',
      weaningDate: qs('weaningDate').value || null,
      weaningWeight: qs('weaningWeight').value.trim() || null,
      notes: qs('notes').value.trim()
    };
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = collect();
    
    // Basic validation
    if(!data.farrowDate){ setMessage('Farrow date is required','error'); return; }
    if(!data.numberBorn){ setMessage('Number born is required','error'); return; }
    if(!data.alive){ setMessage('Number alive is required','error'); return; }
    
    const numberBorn = Number(data.numberBorn);
    const alive = Number(data.alive);
    const dead = Number(data.dead);
    
    if(alive + dead !== numberBorn) {
      setMessage('Alive + Dead must equal Number Born','error');
      return;
    }

    // Find the sow and boar by name to get their tags (if provided)
    let mother = null;
    let father = null;
    
    if(data.motherName) {
      mother = AnimalsModule.sows.find(s => (s.name || s.tagNo) === data.motherName);
      if(!mother) {
        setMessage('Mother not found','error');
        return;
      }
    }
    
    if(data.fatherName) {
      father = AnimalsModule.boars.find(b => (b.name || b.tagNo) === data.fatherName);
      if(!father) {
        setMessage('Father not found','error');
        return;
      }
    }

    const saveBtn = qs('saveBtn');
    if(saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }
    
    try{
      // First, create or find pregnancy record
      const pregnancyData = {
        sowId: mother ? mother.id : null,
        boarId: father ? father.id : null,
        dateServed: new Date(new Date(data.farrowDate).getTime() - (114 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 114 days before farrow
        expectedFarrowing: data.farrowDate,
        status: 'farrowed'
      };
      
      // Validate that we have at least a sow
      if (!pregnancyData.sowId) {
        setMessage('Mother is required to create a litter', 'error');
        if(saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Litter'; }
        return;
      }
      
      // Create pregnancy first
      const pregResponse = await fetch(`${window.API_BASE_URL || 'https://pig-3k5m.onrender.com/api/v1'}/pregnancies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pregnancyData)
      });
      
      if(!pregResponse.ok) {
        const error = await pregResponse.text();
        throw new Error('Failed to create pregnancy: ' + error);
      }
      
      const pregnancy = await pregResponse.json();
      
      // Now create litter
      const litterData = {
        pregnancyId: pregnancy.id,
        farrowDate: data.farrowDate,
        numberBorn: numberBorn,
        alive: alive,
        dead: dead,
        weaningDate: data.weaningDate,
        weaningWeight: data.weaningWeight ? Number(data.weaningWeight) : null,
        notes: data.notes
      };
      
      const litterResponse = await fetch(`${window.API_BASE_URL || 'https://pig-3k5m.onrender.com/api/v1'}/litters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(litterData)
      });
      
      if(!litterResponse.ok) {
        const error = await litterResponse.text();
        throw new Error('Failed to create litter: ' + error);
      }
      
      setMessage('Litter saved successfully','success');
      form.reset();
      
      // Redirect after 1 second
      setTimeout(() => window.location.href = './litters.html', 1000);
      
    }catch(e){
      console.warn('Error saving litter', e);
      setMessage('Failed to save litter: ' + e.message,'error');
    }finally{
      if(saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Litter'; }
    }
  });

  form.addEventListener('reset', ()=>{
    setTimeout(()=> setMessage('', ''), 50);
  });
})();
