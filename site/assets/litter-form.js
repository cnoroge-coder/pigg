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

  // Wait for animals to load, then populate sow and boar dropdowns
  function populateDropdowns() {
    const sowSelect = qs('sowTag');
    const boarSelect = qs('boarTag');
    
    if(!sowSelect || !boarSelect) return;
    
    // Populate sows
    sowSelect.innerHTML = '<option value="">-- Select Sow --</option>';
    AnimalsModule.sows.forEach(s=> {
      sowSelect.append(new Option(`${s.tagNo} - ${s.name || 'Unnamed'}`, s.tagNo));
    });
    
    // Populate boars
    boarSelect.innerHTML = '<option value="">-- Optional --</option>';
    AnimalsModule.boars.forEach(b=> {
      boarSelect.append(new Option(`${b.tagNo} - ${b.name || 'Unnamed'}`, b.tagNo));
    });
  }

  // Wait for animals loaded event
  document.addEventListener('animalsLoaded', populateDropdowns);
  // Or if already loaded
  if(AnimalsModule.sows && AnimalsModule.sows.length > 0) {
    populateDropdowns();
  }

  function collect(){
    return {
      sowTag: qs('sowTag').value.trim(),
      boarTag: qs('boarTag').value.trim(),
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
    if(!data.sowTag){ setMessage('Sow tag number is required','error'); return; }
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

    const saveBtn = qs('saveBtn');
    if(saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }
    
    try{
      // First, create or find pregnancy record
      const pregnancyData = {
        sowTag: data.sowTag,
        boarTag: data.boarTag || null,
        breedingDate: new Date(new Date(data.farrowDate).getTime() - (114 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 114 days before farrow
        expectedDate: data.farrowDate,
        status: 'Farrowed'
      };
      
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
