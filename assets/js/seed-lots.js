(() => {
  'use strict';
  const root = document.getElementById('seed-lots-app');
  if (!root) return;
  const KEY = 'soil-genesis:seed-lots:v1';
  const $ = id => document.getElementById(id);
  const lotForm = $('seed-lot-form');
  const testForm = $('germination-form');
  const seedSelect = $('lot-seed');
  const testLotSelect = $('test-lot');
  const list = $('lots-list');
  const search = $('lots-search');
  const lotFeedback = $('lot-feedback');
  const testFeedback = $('test-feedback');
  const backupFeedback = $('lots-backup-feedback');
  const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  $('lot-date').value = localDate(); $('test-date').value = localDate();
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read = () => {
    try { const parsed = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(parsed) ? parsed.filter(x => x && typeof x.id === 'string' && Array.isArray(x.tests)) : []; }
    catch (_) { return []; }
  };
  let lots = read();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(lots)); return true; } catch (_) { backupFeedback.textContent = 'Impossibile salvare: spazio locale non disponibile. Esporta subito un backup.'; return false; } };
  const uid = () => (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
  const makeLotId = () => { const prefix = `SGLOT-${localDate().replaceAll('-','')}-`; const used = new Set(lots.map(x => x.id)); let n = 1; while (used.has(`${prefix}${String(n).padStart(3,'0')}`)) n++; return `${prefix}${String(n).padStart(3,'0')}`; };
  const selectedSeed = () => { const option = seedSelect.selectedOptions[0]; return option && option.value ? {slug:option.value, name:option.textContent.split(' — ')[0], scientificName:option.dataset.scientific || '', accessionId:option.dataset.id || option.value} : null; };
  const germination = test => test.sown > 0 ? Math.round((test.germinated / test.sown) * 1000) / 10 : null;
  const refreshTestLots = () => {
    const previous = testLotSelect.value;
    testLotSelect.innerHTML = '<option value="">Seleziona un lotto</option>' + lots.map(lot => `<option value="${escapeHTML(lot.id)}">${escapeHTML(lot.id)} — ${escapeHTML(lot.seed.name)}</option>`).join('');
    if (lots.some(lot => lot.id === previous)) testLotSelect.value = previous;
  };
  const render = () => {
    const query = (search.value || '').trim().toLocaleLowerCase('it');
    const filtered = lots.filter(lot => [lot.id,lot.seed.name,lot.seed.scientificName,lot.origin,lot.storage,lot.notes,lot.status].join(' ').toLocaleLowerCase('it').includes(query));
    $('lots-total').textContent = String(lots.length);
    $('lots-tested').textContent = String(lots.filter(lot => lot.tests.length).length);
    $('lots-tests-total').textContent = String(lots.reduce((sum, lot) => sum + lot.tests.length, 0));
    list.innerHTML = filtered.length ? filtered.slice().sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(lot => {
      const tests = lot.tests.slice().sort((a,b) => b.date.localeCompare(a.date)).map(test => `<div class="seed-lot-test"><p><strong>${escapeHTML(test.date)}</strong> · ${escapeHTML(test.method)} · ${escapeHTML(test.germinated)}/${escapeHTML(test.sown)} germinati · <strong>${germination(test)}%</strong></p><p>Durata: ${test.days === '' ? 'non registrata' : `${escapeHTML(test.days)} giorni`} · Temperatura: ${test.temperature === '' ? 'non registrata' : `${escapeHTML(test.temperature)} °C`}</p>${test.notes ? `<p>${escapeHTML(test.notes)}</p>` : ''}</div>`).join('');
      return `<article class="seed-lot-card" data-lot-id="${escapeHTML(lot.id)}"><header><div><h3>${escapeHTML(lot.seed.name)}</h3><p class="seed-lot-scientific"><em>${escapeHTML(lot.seed.scientificName || 'Nome scientifico non registrato')}</em></p></div><span class="seed-lot-id">${escapeHTML(lot.id)}</span></header><div class="seed-lot-meta"><div><strong>Acquisito / raccolto</strong><span>${escapeHTML(lot.date)}</span></div><div><strong>Origine</strong><span>${escapeHTML(lot.origin)}</span></div><div><strong>Quantità iniziale</strong><span>${lot.quantity === '' ? 'Non registrata' : `${escapeHTML(lot.quantity)} ${escapeHTML(lot.unit)}`}</span></div><div><strong>Conservazione</strong><span>${escapeHTML(lot.storage || 'Non registrata')}</span></div><div><strong>Stato</strong><span>${escapeHTML(({disponibile:'Disponibile','in-prova':'In prova','da-verificare':'Da verificare',esaurito:'Esaurito',perso:'Perso / non reperibile'})[lot.status] || lot.status)}</span></div></div>${lot.notes ? `<p>${escapeHTML(lot.notes)}</p>` : ''}<div class="seed-lot-tests"><h4>Prove di germinazione (${lot.tests.length})</h4>${tests || '<p class="seed-lots-help">Nessuna prova registrata.</p>'}</div><footer><button type="button" data-add-test="${escapeHTML(lot.id)}">Aggiungi prova</button><button type="button" data-export-lot="${escapeHTML(lot.id)}">Esporta lotto JSON</button><button type="button" data-delete-lot="${escapeHTML(lot.id)}">Elimina lotto</button></footer></article>`;
    }).join('') : '<p class="seed-lots-empty">Nessun lotto locale registrato.</p>';
    $('lots-empty-filter').hidden = !lots.length || filtered.length > 0;
    refreshTestLots();
  };
  const download = (filename, content, type) => { const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); };
  const yamlString = value => JSON.stringify(String(value ?? ''));
  const yaml = () => {
    const lines = ['# Generato da Soil Genesis; revisionare prima del commit.', 'schema_version: 1', `exported_at: ${yamlString(new Date().toISOString())}`, 'lots:'];
    if (!lots.length) lines.push('  []');
    lots.forEach(lot => {
      lines.push(`  - id: ${yamlString(lot.id)}`, `    seed_slug: ${yamlString(lot.seed.slug)}`, `    seed_name: ${yamlString(lot.seed.name)}`, `    scientific_name: ${yamlString(lot.seed.scientificName)}`, `    accession_id: ${yamlString(lot.seed.accessionId)}`, `    acquisition_date: ${yamlString(lot.date)}`, `    origin: ${yamlString(lot.origin)}`, `    quantity: ${lot.quantity === '' ? 'null' : Number(lot.quantity)}`, `    quantity_unit: ${yamlString(lot.unit)}`, `    storage: ${yamlString(lot.storage)}`, `    status: ${yamlString(lot.status)}`, `    notes: ${yamlString(lot.notes)}`, '    germination_tests:');
      if (!lot.tests.length) lines.push('      []');
      lot.tests.forEach(test => lines.push(`      - date: ${yamlString(test.date)}`, `        seeds_tested: ${Number(test.sown)}`, `        seeds_germinated: ${Number(test.germinated)}`, `        germination_percent: ${germination(test)}`, `        observation_days: ${test.days === '' ? 'null' : Number(test.days)}`, `        temperature_c: ${test.temperature === '' ? 'null' : Number(test.temperature)}`, `        method: ${yamlString(test.method)}`, `        notes: ${yamlString(test.notes)}`));
    });
    return `${lines.join('\n')}\n`;
  };
  lotForm.addEventListener('submit', event => {
    event.preventDefault(); const seed = selectedSeed();
    if (!seed) { lotFeedback.textContent = 'Seleziona un dossier.'; return; }
    const lot = {id:makeLotId(), recordId:uid(), createdAt:new Date().toISOString(), seed, date:$('lot-date').value, origin:$('lot-origin').value, quantity:$('lot-quantity').value, unit:$('lot-unit').value, storage:$('lot-storage').value.trim(), status:$('lot-status').value, notes:$('lot-notes').value.trim(), tests:[]};
    lots.push(lot); save(); render(); lotFeedback.textContent = `Lotto ${lot.id} registrato in locale.`; lotForm.reset(); $('lot-date').value=localDate(); $('lot-unit').value='semi'; $('lot-status').value='disponibile';
  });
  testForm.addEventListener('submit', event => {
    event.preventDefault(); const lot = lots.find(item => item.id === testLotSelect.value); const sown = Number($('test-sown').value); const germinated = Number($('test-germinated').value);
    if (!lot) { testFeedback.textContent = 'Seleziona un lotto valido.'; return; }
    if (!Number.isInteger(sown) || sown < 1 || !Number.isInteger(germinated) || germinated < 0 || germinated > sown) { testFeedback.textContent = 'Il numero germinato deve essere un intero fra zero e i semi testati.'; return; }
    lot.tests.push({id:uid(),date:$('test-date').value,sown,germinated,days:$('test-days').value,temperature:$('test-temperature').value,method:$('test-method').value,notes:$('test-notes').value.trim()});
    if (lot.status === 'disponibile') lot.status='in-prova'; save(); render(); testFeedback.textContent = `Prova aggiunta a ${lot.id}: ${germination(lot.tests[lot.tests.length-1])}% del campione.`; testForm.reset(); $('test-date').value=localDate(); $('test-method').value='carta umida';
  });
  search.addEventListener('input', render);
  list.addEventListener('click', event => {
    const add = event.target.closest('[data-add-test]'); const del = event.target.closest('[data-delete-lot]'); const exp = event.target.closest('[data-export-lot]');
    if (add) { testLotSelect.value=add.dataset.addTest; $('test-lot').focus(); $('test-form-title').scrollIntoView({behavior:'smooth',block:'start'}); }
    if (del) { const lot=lots.find(item=>item.id===del.dataset.deleteLot); if (lot && window.confirm(`Eliminare ${lot.id} e tutte le sue prove dal browser? Esporta prima un backup se vuoi conservarlo.`)) { lots=lots.filter(item=>item.id!==lot.id); save(); render(); lotFeedback.textContent=`Lotto ${lot.id} eliminato dalla copia locale.`; } }
    if (exp) { const lot=lots.find(item=>item.id===exp.dataset.exportLot); if(lot) download(`${lot.id}.json`,JSON.stringify({schema_version:1,exported_at:new Date().toISOString(),lot},null,2),'application/json'); }
  });
  $('lots-export-json').addEventListener('click', () => download(`soil-genesis-lotti-${localDate()}.json`,JSON.stringify({schema_version:1,exported_at:new Date().toISOString(),lots},null,2),'application/json'));
  $('lots-export-package').addEventListener('click', () => { download('seed-lots.yml',yaml(),'text/yaml;charset=utf-8'); const md=['---','layout: default','title: Registro lotti seme','type: seed-lots','date: '+localDate(),'---','','# Registro lotti seme','',`Esportazione locale del ${localDate()}. Verificare e revisionare prima del commit.`,'',`- Lotti: ${lots.length}`,`- Prove di germinazione: ${lots.reduce((sum,lot)=>sum+lot.tests.length,0)}`,'','I risultati delle prove descrivono i campioni testati e non certificano l’intero lotto.']; download(`registro-lotti-${localDate()}.md`,md.join('\n')+'\n','text/markdown;charset=utf-8'); backupFeedback.textContent='Creati seed-lots.yml e registro-lotti-AAAA-MM-GG.md. Controllali prima di versionarli.'; });
  $('lots-import-trigger').addEventListener('click', () => $('lots-import-file').click());
  $('lots-import-file').addEventListener('change', async event => {
    const file=event.target.files && event.target.files[0]; if(!file) return;
    try { const parsed=JSON.parse(await file.text()); const incoming=Array.isArray(parsed) ? parsed : (Array.isArray(parsed.lots) ? parsed.lots : (parsed.lot ? [parsed.lot] : [])); if(!incoming.length) throw new Error('Nessun lotto trovato nel JSON.');
      const valid=incoming.filter(lot=>lot && typeof lot.id==='string' && lot.seed && typeof lot.seed.slug==='string' && Array.isArray(lot.tests)); if(valid.length!==incoming.length) throw new Error('Il file contiene record non compatibili: nessun dato importato.');
      const byId=new Map(lots.map(lot=>[lot.id,lot])); valid.forEach(lot=>byId.set(lot.id,lot)); lots=Array.from(byId.values()); save(); render(); backupFeedback.textContent=`Importati/aggiornati ${valid.length} lotti. Gli identificativi uguali sono stati sostituiti dai record del file.`;
    } catch(error) { backupFeedback.textContent=`Importazione non riuscita: ${error.message}`; } finally { event.target.value=''; }
  });
  render();
})();
