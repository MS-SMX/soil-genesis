(() => {
  'use strict';
  const root = document.getElementById('parcel-history');
  if (!root) return;
  const EVENT_KEY = 'soil-genesis:regeneration-diary:v1';
  const PLAN_KEY = 'soil-genesis:plot-plantings:v1';
  const CONDITION_KEY = 'soil-genesis:parcel-condition-observations:v1';
  const getJSON = id => { try { return JSON.parse(document.getElementById(id)?.textContent || '[]'); } catch (_) { return []; } };
  const readLocal = key => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const groups = [
    {label:'Esagono 1 · settori concentrici',items:Array.from({length:7},(_,r)=>Array.from({length:6},(_,s)=>({id:`hex1-${String.fromCharCode(65+r)}${s+1}`,label:`Esagono 1 · ${String.fromCharCode(65+r)}${s+1}`}))).flat()},
    {label:'Esagono 1 · porte rampicanti',items:Array.from({length:6},(_,i)=>({id:`hex1-gate-${i+1}`,label:`Esagono 1 · Porta rampicante ${i+1}`}))},
    {label:'Esagono 2 · settori concentrici',items:Array.from({length:7},(_,r)=>Array.from({length:6},(_,s)=>({id:`hex2-${String.fromCharCode(65+r)}${s+1}`,label:`Esagono 2 · ${String.fromCharCode(65+r)}${s+1}`}))).flat()},
    {label:'Esagono 2 · porte rampicanti',items:Array.from({length:6},(_,i)=>({id:`hex2-gate-${i+1}`,label:`Esagono 2 · Porta rampicante ${i+1}`}))},
    {label:'Mezzo esagono 1 · file intere',items:Array.from({length:4},(_,r)=>({id:`half1-row${r+1}`,label:`Mezzo esagono 1 · Fila ${r+1}`}))},
    {label:'Mezzo esagono 2 · mezze file',items:Array.from({length:5},(_,r)=>['A','B'].map(side=>({id:`half2-row${r+1}-${side.toLowerCase()}`,label:`Mezzo esagono 2 · Fila ${r+1} · metà ${side}`}))).flat()},
    {label:'Quadrato centrale',items:[{id:'central-left',label:'Quadrato centrale · Settore sinistro'},{id:'central-right',label:'Quadrato centrale · Settore destro'},{id:'central-vine-tunnel',label:'Quadrato centrale · Tunnel delle Liane'}]},
    {label:'Filare classico',items:[{id:'classic-row',label:'Filare classico'}]}
  ];
  const allParcels = groups.flatMap(group=>group.items);
  const normalizeId = id => { const match=String(id||'').match(/^half1-row([1-4])-[ab]$/); return match?`half1-row${match[1]}`:String(id||''); };
  const labels = new Map(allParcels.map(item=>[item.id,item.label]));
  const labelFor = (id, fallback='') => labels.get(normalizeId(id)) || fallback || 'Parcella non specificata';
  const filter = document.getElementById('parcel-history-filter');
  groups.forEach(group=>{ const optgroup=document.createElement('optgroup'); optgroup.label=group.label; group.items.forEach(parcel=>{const option=document.createElement('option');option.value=parcel.id;option.textContent=parcel.label;optgroup.appendChild(option);});filter.appendChild(optgroup); });
  const from=document.getElementById('parcel-history-from'), to=document.getElementById('parcel-history-to'), search=document.getElementById('parcel-history-search');
  const timeline=document.getElementById('parcel-history-timeline'), summary=document.getElementById('parcel-history-summary'), empty=document.getElementById('parcel-history-empty');
  const rotationContext=document.getElementById('parcel-rotation-context-results');
  const publishedPlantings=getJSON('parcel-history-published-plantings').map(item=>({...item,parcelId:normalizeId(item.parcelId||item.parcel_id),season:Number(item.season),plants:Array.isArray(item.plants)?item.plants:[]}));
  const publishedEvents=getJSON('parcel-history-published-events').map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'published',kind:'event'}));
  const publishedConditions=getJSON('parcel-history-published-conditions').map(item=>({...item,parcelId:normalizeId(item.parcelId||item.parcel_id),date:String(item.date||''),source:'published',kind:'condition'})).filter(item=>item.id&&item.date);
  const conditionLabels = {
    drainage: {good:'Drenaggio adeguato / senza ristagni osservati',poor:'Drenaggio scarso / ristagni osservati',variable:'Drenaggio variabile o da verificare'},
    irrigation: {ground:'Irrigazione al suolo / localizzata',overhead:'Irrigazione soprachioma / a pioggia',mixed:'Irrigazione mista'},
    residues: {removed:'Residui rimossi / gestiti','healthy-retained':'Residui sani lasciati in superficie','suspect-retained':'Residui sospetti o infetti presenti',composted:'Residui destinati al compost'},
    health: {'none-observed':'Nessun sintomo osservato (non equivale ad assenza)',symptoms:'Sintomi osservati, causa ignota',suspected:'Problema sospetto, da verificare',confirmed:'Problema confermato da fonte competente'}
  };
  const conditionFieldLabels = {drainage:'Drenaggio',irrigation:'Irrigazione',residues:'Residui colturali',health:'Stato fitosanitario'};
  const conditionDescription = item => Object.entries(item.conditions||{}).filter(([key,value])=>conditionLabels[key]?.[value]).map(([key,value])=>`${conditionFieldLabels[key]}: ${conditionLabels[key][value]}`).join(' · ');
  const getAll=()=>{
    const localConditions=readLocal(CONDITION_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'local',kind:'condition'})).filter(item=>item.id&&item.date);
    const conditionMap=new Map();
    [...publishedConditions,...localConditions].forEach(item=>{
      const previous=conditionMap.get(String(item.id));
      if(!previous) conditionMap.set(String(item.id),item);
      else conditionMap.set(String(item.id),{...(item.source==='local'?item:previous),source:'both'});
    });
    const conditionRows=[...conditionMap.values()].map(item=>({...item,title:'Osservazione delle condizioni',category:'CONDIZIONI OSSERVATE',seedName:conditionDescription(item)||'Nessun campo valorizzato',notes:item.notes||'',year:Number(String(item.date).slice(0,4))}));
    const localEvents=readLocal(EVENT_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'local',kind:'event',title:item.category||'Evento',seedName:item.seedName||item.seedSlug||'Evento generale',notes:item.notes||''}));
    const localPlantings=readLocal(PLAN_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),season:Number(item.season),source:'local',kind:'planting',title:'Coltura di base',seedName:(item.plants||[]).map(p=>p.label).join(' + ')||item.crop||'Coltura non specificata',notes:item.notes||''}));
    const publicPlans=publishedPlantings.map(item=>({...item,source:'published',kind:'planting',title:'Coltura di base',seedName:item.plants.map(p=>p.label).join(' + ')||item.crop||'Coltura non specificata',notes:item.notes||''}));
    const merged = new Map();
    [...publishedEvents,...publicPlans,...localEvents,...localPlantings,...conditionRows].forEach(item => {
      const key = item.kind === 'event' ? `event:${item.id || `${item.date}:${item.parcelId}:${item.title}`}` : item.kind === 'condition' ? `condition:${item.id}` : `planting:${item.season}:${item.parcelId}`;
      const previous = merged.get(key);
      if (!previous) merged.set(key, item);
      else {
        const chosen = item.source === 'local' ? item : previous;
        merged.set(key, { ...chosen, source: previous.source !== item.source ? 'both' : chosen.source });
      }
    });
    const baseRows=[...merged.values()].map(item=>({...item,parcelLabel:labelFor(item.parcelId,item.parcelLabel),year:Number(item.season||String(item.date||'').slice(0,4))}));
    // Produce descriptive season-to-season transitions only when both seasons are explicitly recorded.
    const plantingsByParcel=new Map();
    baseRows.filter(item=>item.kind==='planting'&&item.parcelId&&Number.isFinite(item.season)).forEach(item=>{
      if(!plantingsByParcel.has(item.parcelId)) plantingsByParcel.set(item.parcelId,[]);
      plantingsByParcel.get(item.parcelId).push(item);
    });
    const transitions=[];
    plantingsByParcel.forEach((items,parcelId)=>{
      const seasons=new Map();
      items.forEach(item=>{ const key=String(item.season); if(!seasons.has(key)) seasons.set(key,item); });
      const ordered=[...seasons.values()].sort((a,b)=>a.season-b.season);
      for(let i=1;i<ordered.length;i++){
        const previous=ordered[i-1], current=ordered[i];
        const previousCrop=previous.seedName||previous.crop||'Coltura non specificata';
        const currentCrop=current.seedName||current.crop||'Coltura non specificata';
        if(previousCrop===currentCrop) continue;
        transitions.push({id:`transition:${parcelId}:${previous.season}:${current.season}`,kind:'transition',source:previous.source==='local'||current.source==='local'?'local':'published',parcelId,parcelLabel:current.parcelLabel,season:current.season,year:Number(current.season),date:'',title:'Passaggio colturale registrato',category:'TRANSIZIONE TRA STAGIONI',seedName:`${previous.season}: ${previousCrop} → ${current.season}: ${currentCrop}`,notes:'Confronto descrittivo tra due piani colturali registrati. Non è una valutazione automatica della qualità della rotazione; famiglie botaniche, patogeni, durata delle colture e condizioni locali richiedono un’analisi separata.'});
      }
    });
    return [...baseRows,...transitions];
  };
  const normalizeFamily = value => String(value || '').trim().toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const renderRotationContext = (parcel, min, max) => {
    if (!rotationContext) return;
    const localPlantings = readLocal(PLAN_KEY).map(item => ({...item, parcelId:normalizeId(item.parcelId), season:Number(item.season), source:'local', plants:Array.isArray(item.plants)?item.plants:[]}));
    const planMap = new Map();
    [...publishedPlantings.map(item=>({...item,source:'published'})), ...localPlantings].filter(item=>item.parcelId && Number.isInteger(item.season) && item.season>=min && item.season<=max && (!parcel||item.parcelId===parcel)).forEach(item=>{
      const key=`${item.parcelId}:${item.season}`;
      const previous=planMap.get(key);
      if (!previous) planMap.set(key,item);
      else {
        const plants=new Map();
        [...(previous.plants||[]),...(item.plants||[])].forEach(plant=>{
          const plantKey=`${plant.type||''}:${plant.slug||plant.seed_slug||plant.perennial_slug||plant.label||''}`;
          plants.set(plantKey,{...(plants.get(plantKey)||{}),...plant});
        });
        planMap.set(key,{...previous,...item,plants:[...plants.values()],source:'both'});
      }
    });
    const plans=[...planMap.values()].sort((a,b)=>a.parcelId.localeCompare(b.parcelId)||a.season-b.season);
    const byParcel=new Map();
    plans.forEach(item=>{if(!byParcel.has(item.parcelId))byParcel.set(item.parcelId,[]);byParcel.get(item.parcelId).push(item);});
    const conditions=[...publishedConditions,...readLocal(CONDITION_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'local'}))].filter(item=>item.id&&item.date&&(!parcel||normalizeId(item.parcelId)===parcel)&&Number(item.date.slice(0,4))>=min&&Number(item.date.slice(0,4))<=max);
    if (!byParcel.size) {
      rotationContext.innerHTML='<p class="regen-backup-help">Non ci sono piani colturali con stagione registrata nell’intervallo selezionato. Registra una coltura e la sua famiglia botanica per attivare il confronto.</p>';
      return;
    }
    const cards=[];
    byParcel.forEach((items,parcelId)=>{
      const current=items[items.length-1];
      const plantFamilyRows=(item)=> (item.plants||[]).filter(plant=>!['perennial','perenne','perennial plant'].includes(String(plant.type||plant.life||'').toLocaleLowerCase('it')) && !plant.perennial_slug && !plant.perennialSlug).map(plant=>({family:String(plant.family||plant.family_name||'').trim(),label:String(plant.label||plant.slug||plant.seed_slug||'pianta non specificata'),life:String(plant.life||'').toLocaleLowerCase('it')})).filter(plant=>!['perennial','perenne','perennial plant'].includes(plant.life));
      const currentRows=plantFamilyRows(current), currentFamilies=[...new Set(currentRows.map(row=>row.family).filter(Boolean))];
      const prior=items.filter(item=>item.season<current.season&&item.season>=current.season-3);
      const repeats=[];
      currentFamilies.forEach(family=>{
        const hits=prior.filter(item=>plantFamilyRows(item).some(row=>normalizeFamily(row.family)===normalizeFamily(family)));
        if(hits.length) repeats.push({family,seasons:[...new Set(hits.map(item=>item.season))].sort((a,b)=>a-b)});
      });
      const parcelConditions=conditions.filter(item=>normalizeId(item.parcelId)===parcelId).sort((a,b)=>b.date.localeCompare(a.date));
      const healthNotes=parcelConditions.filter(item=>['suspected','confirmed','symptoms'].includes(item.conditions?.health));
      const crop=(current.plants||[]).map(plant=>plant.label||plant.slug||plant.seed_slug).filter(Boolean).join(' + ')||current.crop||'Coltura non specificata';
      const familyText=currentFamilies.length?escapeHTML(currentFamilies.join(', ')):'Famiglie botaniche non disponibili';
      const rotationText=repeats.length?`Famiglie ripetute nello storico recente: ${repeats.map(item=>`${escapeHTML(item.family)} (${item.seasons.join(', ')})`).join('; ')}.`:currentFamilies.length?`Nessuna famiglia registrata in comune con i piani precedenti degli ultimi tre anni.`:'Confronto non disponibile: verifica le famiglie botaniche nelle schede delle piante.';
      const conditionText=healthNotes.length?`<p class="parcel-history-caveat"><strong>Osservazioni fitosanitarie nello stesso intervallo:</strong> ${healthNotes.slice(0,3).map(item=>`${escapeHTML(item.date)} · ${escapeHTML(conditionDescription(item)||item.notes||'osservazione registrata')}`).join('; ')}. Sono osservazioni registrate, non una diagnosi automatica.</p>`:parcelConditions.length?`<p class="parcel-history-caveat">${parcelConditions.length} osservazioni delle condizioni registrate nell’intervallo; nessuna con stato sintomatico/sospetto/confermato valorizzato.</p>`:'<p class="parcel-history-caveat">Nessuna osservazione datata delle condizioni trovata nell’intervallo selezionato. Questo non significa che non siano avvenuti problemi.</p>';
      cards.push(`<article class="parcel-rotation-context-card"><div class="regen-event-meta"><span class="regen-category-tag">STAGIONE ${current.season}</span><span class="regen-event-parcel">${escapeHTML(labelFor(parcelId,current.parcelLabel))}</span><span class="parcel-history-source ${current.source==='local'?'is-local':''}">${current.source==='local'?'BOZZA LOCALE':current.source==='both'?'PUBBLICATO + LOCALE':'PUBBLICATO'}</span></div><h3>${escapeHTML(crop)}</h3><p><strong>Famiglie registrate:</strong> ${familyText}</p><p>${rotationText}</p>${conditionText}<p class="parcel-history-caveat">Confronto indicativo su piani registrati; non certifica la qualità della rotazione e non stabilisce causalità.</p></article>`);
    });
    rotationContext.innerHTML=cards.join('');
  };
  const render=()=>{
    const parcel=filter.value, min=Number(from.value)||0, max=Number(to.value)||9999, query=search.value.trim().toLocaleLowerCase('it');
    renderRotationContext(parcel,min,max);
    const rows=getAll().filter(item=>item.parcelId && (!parcel||item.parcelId===parcel) && item.year>=min && item.year<=max && [item.parcelLabel,item.title,item.category,item.seedName,item.crop,item.notes].join(' ').toLocaleLowerCase('it').includes(query))
      .sort((a,b)=>String(b.date||`${b.year}-01-01`).localeCompare(String(a.date||`${a.year}-01-01`)) || (a.kind==='event'?-1:1));
    summary.textContent=`${rows.length} voci · ${rows.filter(x=>x.kind==='planting').length} piani stagionali · ${rows.filter(x=>x.kind==='condition').length} osservazioni · ${rows.filter(x=>x.kind==='event').length} eventi · ${rows.filter(x=>x.source==='local').length} bozze locali`; 
    timeline.innerHTML=rows.map(item=>{const date=item.date?new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${item.date}T12:00:00`)):`Stagione ${item.year||'non specificata'}`;const type=item.kind==='planting'?'COLTURA DI BASE':item.kind==='condition'?'CONDIZIONI OSSERVATE':item.kind==='transition'?'TRANSIZIONE COLTURALE':(item.category||item.title||'EVENTO');const crop=item.seedName||item.crop||'Evento generale';const text=item.notes?`<p>${escapeHTML(item.notes)}</p>`:'';const conditionNote=item.kind==='condition'?'<p class="parcel-history-caveat">Osservazione registrata, non diagnosi né prova di causalità.</p>':'';const transitionNote=item.kind==='transition'?'<p class="parcel-history-caveat">Confronto descrittivo; non certifica una rotazione agronomicamente adeguata.</p>':'';const title=item.url?`<a href="${escapeHTML(item.url)}">${escapeHTML(item.title||type)} ↗</a>`:escapeHTML(type);return `<article class="parcel-history-entry"><div class="parcel-history-date">${escapeHTML(date)}</div><div class="parcel-history-entry-body"><div class="regen-event-meta"><span class="regen-category-tag">${escapeHTML(type)}</span><span class="regen-event-parcel">${escapeHTML(item.parcelLabel)}</span><span class="parcel-history-source ${item.source==='local'?'is-local':''}">${item.source==='local'?'BOZZA LOCALE':item.source==='both'?'PUBBLICATO + LOCALE':'PUBBLICATO'}</span></div><h3>${title}</h3><p class="parcel-history-crop">${escapeHTML(crop)}</p>${text}${conditionNote}${transitionNote}</div></article>`;}).join('');
    empty.hidden=rows.length>0;
  };
  [filter,from,to,search].forEach(control=>control.addEventListener('input',render));
  document.getElementById('parcel-history-reset').addEventListener('click',()=>{filter.value='';from.value='';to.value='';search.value='';render();});
  window.addEventListener('storage',render);
  render();
})();
