// Logic for Add Pig form
(function(){
  function qs(id){ return document.getElementById(id); }
  const form = qs('pigForm'); if(!form) return;
  const msg = qs('formMsg');
  const { AnimalsModule, Constants } = window.Modules;

  function fillSelect(id, values, placeholder){
    const sel = qs(id); if(!sel) return;
    sel.innerHTML = '';
    if(placeholder) sel.append(new Option(placeholder,'')); 
    values.forEach(v=> sel.append(new Option(v,v)));
  }

  fillSelect('breed', Constants.breeds, '-- Optional --');
  fillSelect('group', Constants.groups, '-- Optional --');
  fillSelect('obtainedMethod', Constants.obtainMethods, '-- Select --');

  // Parent tags
  function refreshParents(){
    const motherSel = qs('motherTag');
    const fatherSel = qs('fatherTag');
    motherSel.innerHTML = '<option value="">-- Optional --</option>';
    fatherSel.innerHTML = '<option value="">-- Optional --</option>';
    AnimalsModule.sows.forEach(s=> motherSel.append(new Option(s.tagNo, s.tagNo)));
    AnimalsModule.boars.forEach(b=> fatherSel.append(new Option(b.tagNo, b.tagNo)));
  }
  refreshParents();

  function setMessage(text,type){
    if(!msg) return;
    msg.textContent = text;
    msg.className = 'form-msg ' + (type||'');
  }

  function collect(){
    return {
      breed: qs('breed').value.trim(),
      tagNo: qs('tagNo').value.trim(),
      name: qs('name').value.trim(),
      litterNo: qs('litterNo').value.trim(),
      weight: qs('weight').value.trim(),
      gender: qs('gender').value.trim(),
      dob: qs('dob').value,
      entryDate: qs('entryDate').value,
      group: qs('group').value.trim(),
      obtainedMethod: qs('obtainedMethod').value.trim(),
      motherTag: qs('motherTag').value.trim(),
      fatherTag: qs('fatherTag').value.trim(),
      notes: qs('notes').value.trim()
      ,
      photo: (qs('photo') && qs('photo').files && qs('photo').files[0]) ? qs('photo').files[0] : null
    };
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = collect();
    // Basic validation
    if(!data.tagNo){ setMessage('Tag number is required','error'); return; }
    if(!data.gender){ setMessage('Gender is required','error'); return; }
    if(!data.obtainedMethod){ setMessage('Obtained method is required','error'); return; }
    if(data.weight && Number(data.weight) < 0){ setMessage('Weight cannot be negative','error'); return; }

    // If a photo is provided, upload it to Supabase Storage
    (async function(){
      const saveBtn = qs('saveBtn');
      if(saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }
      try{
        if(data.photo){
          if(!(window && window.sb && window.sb.storage)){
            console.warn('Supabase storage not available — skipping upload.');
            setMessage('Storage not available — image not uploaded','warning');
          } else {
            try{
              const bucket = 'pig';
              const name = data.photo.name || (data.tagNo || 'pig');
              const extMatch = name.match(/\.([a-zA-Z0-9]+)$/);
              const ext = extMatch? '.'+extMatch[1] : '';
              const filename = `${encodeURIComponent(data.tagNo || ('pig-'+Date.now()))}-${Date.now()}${ext}`;
              console.info('Uploading image to storage:', bucket, filename);

              const { data: uploadData, error: uploadError } = await window.sb.storage.from(bucket).upload(filename, data.photo, { upsert: false });
              console.info('uploadData:', uploadData, 'uploadError:', uploadError);
              if(uploadError){
                console.warn('Image upload failed', uploadError);
                setMessage('Image upload failed — pig saved without image','warning');
              } else if(uploadData){
                const storedPath = uploadData.path || uploadData.Key || uploadData.fullPath || filename;
                const pub = window.sb.storage.from(bucket).getPublicUrl(storedPath);
                console.info('getPublicUrl response:', pub);
                const publicUrl = pub && pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
                if(publicUrl){
                  data.imageUrl = publicUrl;
                  console.info('Image uploaded, public url:', publicUrl);
                } else {
                  console.warn('Bucket may not be public - no URL returned');
                  setMessage('Image uploaded but not accessible','warning');
                }
              }
            }catch(e){ console.warn('Photo upload error', e); setMessage('Photo upload failed','warning'); }
          }
        } else {
          console.info('No photo provided.');
        }

        // proceed to add pig even if upload failed or there was no photo
        const res = await AnimalsModule.addPig(data);
        if(!res.ok){ setMessage(res.error || 'Failed to add pig','error'); return; }

        setMessage('Pig saved successfully','success');
        form.reset();
        refreshParents(); // new parents available
        
        // Reload the page after 1 second to show the new pig
        setTimeout(() => window.location.href = './', 1000);
      }catch(e){
        console.warn('Error saving pig', e);
        setMessage('Failed to save pig: ' + e.message,'error');
      }finally{
        if(saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save'; }
      }
    })();
  });

  form.addEventListener('reset', ()=>{
    setTimeout(()=> setMessage('', ''), 50);
  });
})();
