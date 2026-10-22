(() => {
  'use strict';
  const root = document.getElementById('parcel-history');
  if (!root) return;
  const EVENT_KEY = 'soil-genesis:regeneration-diary:v1';
  const PLAN_KEY = 'soil-genesis:plot-plantings:v1';
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
  const publishedPlantings=getJSON('parcel-history-published-plantings').map(item=>({...item,parcelId:normalizeId(item.parcelId||item.parcel_id),season:Number(item.season),plants:Array.isArray(item.plants)?item.plants:[]}));
  const publishedEvents=getJSON('parcel-history-published-events').map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'published',kind:'event'}));
  const getAll=()=>{
    const localEvents=readLocal(EVENT_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),source:'local',kind:'event',title:item.category||'Evento',seedName:item.seedName||item.seedSlug||'Evento generale',notes:item.notes||''}));
    const localPlantings=readLocal(PLAN_KEY).map(item=>({...item,parcelId:normalizeId(item.parcelId),season:Number(item.season),source:'local',kind:'planting',title:'Coltura di base',seedName:(item.plants||[]).map(p=>p.label).join(' + ')||item.crop||'Coltura non specificata',notes:item.notes||''}));
    const publicPlans=publishedPlantings.map(item=>({...item,source:'published',kind:'planting',title:'Coltura di base',seedName:item.plants.map(p=>p.label).join(' + ')||item.crop||'Coltura non specificata',notes:item.notes||''}));
    const merged = new Map();
    [...publishedEvents,...publicPlans,...localEvents,...localPlantings].forEach(item => {
      const key = item.kind === 'event' ? `event:${item.id || `${item.date}:${item.parcelId}:${item.title}`}` : `planting:${item.season}:${item.parcelId}`;
      const previous = merged.get(key);
      if (!previous) merged.set(key, item);
      else {
        const chosen = item.source === 'local' ? item : previous;
        merged.set(key, { ...chosen, source: previous.source !== item.source ? 'both' : chosen.source });
      }
    });
    return [...merged.values()].map(item=>({...item,parcelLabel:labelFor(item.parcelId,item.parcelLabel),year:Number(item.season||String(item.date||'').slice(0,4))}));
  };
  const render=()=>{
    const parcel=filter.value, min=Number(from.value)||0, max=Number(to.value)||9999, query=search.value.trim().toLocaleLowerCase('it');
    const rows=getAll().filter(item=>item.parcelId && (!parcel||item.parcelId===parcel) && item.year>=min && item.year<=max && [item.parcelLabel,item.title,item.category,item.seedName,item.crop,item.notes].join(' ').toLocaleLowerCase('it').includes(query))
      .sort((a,b)=>String(b.date||`${b.year}-01-01`).localeCompare(String(a.date||`${a.year}-01-01`)) || (a.kind==='event'?-1:1));
    summary.textContent=`${rows.length} registrazioni · ${rows.filter(x=>x.source==='local').length} bozze locali · ${rows.filter(x=>x.source==='published').length} pubblicate`;
    timeline.innerHTML=rows.map(item=>{const date=item.date?new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${item.date}T12:00:00`)):`Stagione ${item.year||'non specificata'}`;const type=item.kind==='planting'?'COLTURA DI BASE':(item.category||item.title||'EVENTO');const crop=item.seedName||item.crop||'Evento generale';const text=item.notes?`<p>${escapeHTML(item.notes)}</p>`:'';const title=item.url?`<a href="${escapeHTML(item.url)}">${escapeHTML(item.title||type)} ↗</a>`:escapeHTML(type);return `<article class="parcel-history-entry"><div class="parcel-history-date">${escapeHTML(date)}</div><div class="parcel-history-entry-body"><div class="regen-event-meta"><span class="regen-category-tag">${escapeHTML(type)}</span><span class="regen-event-parcel">${escapeHTML(item.parcelLabel)}</span><span class="parcel-history-source ${item.source==='local'?'is-local':''}">${item.source==='local'?'BOZZA LOCALE':item.source==='both'?'PUBBLICATO + LOCALE':'PUBBLICATO'}</span></div><h3>${title}</h3><p class="parcel-history-crop">${escapeHTML(crop)}</p>${text}</div></article>`;}).join('');
    empty.hidden=rows.length>0;
  };
  [filter,from,to,search].forEach(control=>control.addEventListener('input',render));
  document.getElementById('parcel-history-reset').addEventListener('click',()=>{filter.value='';from.value='';to.value='';search.value='';render();});
  window.addEventListener('storage',render);
  render();
})();
