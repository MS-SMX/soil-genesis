(() => {
  'use strict';

  const root = document.getElementById('regen-diary');
  if (!root) return;

  const STORAGE_KEY = 'soil-genesis:regeneration-diary:v1';
  const PLAN_STORAGE_KEY = 'soil-genesis:plot-plantings:v1';
  const form = document.getElementById('regen-form');
  const dateInput = document.getElementById('regen-date');
  const categoryInput = document.getElementById('regen-category');
  const seedInput = document.getElementById('regen-seed');
  const parcelInput = document.getElementById('regen-parcel');
  const parcelFilter = document.getElementById('regen-filter-parcel');
  const planForm = document.getElementById('regen-plan-form');
  const planSeasonInput = document.getElementById('regen-plan-season');
  const planParcelInput = document.getElementById('regen-plan-parcel');
  const planPlantSearch = document.getElementById('regen-plan-plant-search');
  const planPlantOptions = document.getElementById('regen-plan-plant-options');
  const selectedPlanPlants = () => Array.from(document.querySelectorAll('.regen-plan-plant:checked')).map(input => ({ type: input.dataset.plantType, slug: input.dataset.plantSlug, label: input.dataset.plantLabel, family: input.dataset.plantFamily || '' }));
  const planNotesInput = document.getElementById('regen-plan-notes');
  const planFeedback = document.getElementById('regen-plan-feedback');
  const planViewSeason = document.getElementById('regen-plan-view-season');
  const planSearch = document.getElementById('regen-plan-search');
  const planList = document.getElementById('regen-plan-list');
  const rotationList = document.getElementById('regen-rotation-list');
  const notesInput = document.getElementById('regen-notes');
  const searchInput = document.getElementById('regen-search');
  const categoryFilter = document.getElementById('regen-filter-category');
  const seedFilter = document.getElementById('regen-filter-seed');
  const eventsContainer = document.getElementById('regen-events');
  const emptyState = document.getElementById('regen-empty');
  const count = document.getElementById('regen-count');
  const feedback = document.getElementById('regen-form-feedback');
  const resetButton = document.getElementById('regen-reset-filters');
  const exportButton = document.getElementById('regen-export');
  const publishExportButton = document.getElementById('regen-publish-export');
  const importTrigger = document.getElementById('regen-import-trigger');
  const importFile = document.getElementById('regen-import-file');
  const backupFeedback = document.getElementById('regen-backup-feedback');

  const todayLocal = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const currentYear = Number(todayLocal().slice(0, 4));
  const parcelGroups = [
    { label: 'Esagono 1 · settori concentrici', prefix: 'hex1', items: Array.from({length:7}, (_, ring) => Array.from({length:6}, (_, sector) => ({id:`hex1-${String.fromCharCode(65+ring)}${sector+1}`, label:`Esagono 1 · ${String.fromCharCode(65+ring)}${sector+1}`}))).flat() },
    { label: 'Esagono 1 · porte rampicanti', prefix: 'hex1-gate', items: Array.from({length:6}, (_, i) => ({id:`hex1-gate-${i+1}`,label:`Esagono 1 · Porta rampicante ${i+1}`})) },
    { label: 'Esagono 2 · settori concentrici', prefix: 'hex2', items: Array.from({length:7}, (_, ring) => Array.from({length:6}, (_, sector) => ({id:`hex2-${String.fromCharCode(65+ring)}${sector+1}`, label:`Esagono 2 · ${String.fromCharCode(65+ring)}${sector+1}`}))).flat() },
    { label: 'Esagono 2 · porte rampicanti', prefix: 'hex2-gate', items: Array.from({length:6}, (_, i) => ({id:`hex2-gate-${i+1}`,label:`Esagono 2 · Porta rampicante ${i+1}`})) },
    { label: 'Mezzo esagono 1 · file intere', items: Array.from({length:4}, (_, row) => ({id:`half1-row${row+1}`, label:`Mezzo esagono 1 · Fila ${row+1}`})) },
    { label: 'Mezzo esagono 2', items: Array.from({length:5}, (_, row) => ['A','B'].map(side => ({id:`half2-row${row+1}-${side.toLowerCase()}`, label:`Mezzo esagono 2 · Fila ${row+1} · metà ${side}`}))).flat() },
    { label: 'Quadrato centrale', items: [{id:'central-left',label:'Quadrato centrale · Settore sinistro'},{id:'central-right',label:'Quadrato centrale · Settore destro'},{id:'central-vine-tunnel',label:'Quadrato centrale · Tunnel delle Liane'}] },
    { label: 'Filare classico', items: [{id:'classic-row',label:'Filare classico'}] }
  ];
  const parcels = parcelGroups.flatMap(group => group.items);
  const normalizeParcelId = id => { const match = String(id || '').match(/^half1-row([1-4])-[ab]$/); return match ? `half1-row${match[1]}` : String(id || ''); };
  const parcelLabel = id => parcels.find(parcel => parcel.id === normalizeParcelId(id))?.label || '';
  const migrateLegacyParcelData = () => {
    events = events.map(item => { const parcelId = normalizeParcelId(item.parcelId); return parcelId === item.parcelId ? item : { ...item, parcelId, parcelLabel: parcelLabel(parcelId) }; });
    const migrated = new Map();
    plantings.forEach(item => { const parcelId = normalizeParcelId(item.parcelId); const record = { ...item, parcelId }; const key = `${record.season}:${parcelId}`; if (!migrated.has(key)) migrated.set(key, record); else { const target = migrated.get(key); target.plants = Array.from(new Map([...(target.plants || []), ...(record.plants || [])].map(plant => [`${plant.type}:${plant.slug}`, plant])).values()); target.crop = Array.from(new Set([target.crop, record.crop].filter(Boolean))).join(' + '); target.notes = Array.from(new Set([target.notes, record.notes].filter(Boolean))).join('\n'); } });
    plantings = Array.from(migrated.values());
  };
  const populateParcelSelect = (select, includeEmpty, emptyLabel) => {
    select.innerHTML = '';
    if (includeEmpty) {
      const empty = document.createElement('option'); empty.value = ''; empty.textContent = emptyLabel; select.appendChild(empty);
    }
    parcelGroups.forEach(group => {
      const optgroup = document.createElement('optgroup'); optgroup.label = group.label;
      group.items.forEach(parcel => { const option = document.createElement('option'); option.value = parcel.id; option.textContent = parcel.label; optgroup.appendChild(option); });
      select.appendChild(optgroup);
    });
  };
  populateParcelSelect(parcelInput, true, 'Nessuna parcella specifica');
  populateParcelSelect(parcelFilter, true, 'Tutte le parcelle');
  populateParcelSelect(planParcelInput, true, 'Seleziona una parcella');
  planSeasonInput.value = String(currentYear);
  planViewSeason.value = String(currentYear);
  dateInput.value = todayLocal();

  const readEvents = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
    } catch (error) {
      return [];
    }
  };

  const readPlantings = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.parcelId && item.crop && Number.isFinite(Number(item.season))) : [];
    } catch (error) { return []; }
  };

  let events = readEvents();
  let plantings = readPlantings();
  const readPublishedPlantings = () => {
    const source = document.getElementById('regen-published-plantings');
    if (!source) return [];
    try { const parsed = JSON.parse(source.textContent || '[]'); return Array.isArray(parsed) ? parsed : []; }
    catch (_) { return []; }
  };
  const publishedPlantings = readPublishedPlantings();
  migrateLegacyParcelData();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); } catch (_) {}
  const familyByRef = new Map(Array.from(document.querySelectorAll('.regen-plan-plant')).map(input => [`${input.dataset.plantType}:${input.dataset.plantSlug}`, input.dataset.plantFamily || '']));
  const plantFamily = plant => String(plant?.family || familyByRef.get(`${plant?.type}:${plant?.slug}`) || '').trim();
  const familiesForPlanting = item => {
    const refs = Array.isArray(item.plants) ? item.plants : [];
    const families = refs.map(plantFamily).filter(Boolean);
    if (!families.length && item.family) families.push(String(item.family));
    return Array.from(new Set(families.map(value => value.trim()).filter(Boolean)));
  };

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (error) {
      feedback.textContent = 'Salvataggio non riuscito: memoria locale non disponibile.';
      return false;
    }
  };

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const formatDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value || 'Data non specificata';
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(new Date(year, month - 1, day));
  };

  const seedLabel = slug => {
    if (!slug) return 'Evento generale';
    const normalized = /^(seed:|perennial:)/.test(slug) ? slug : `seed:${slug}`;
    const option = Array.from(seedInput.options).find(item => item.value === normalized);
    return option ? option.textContent.trim() : slug.replace(/^(seed:|perennial:)/, '');
  };

  const normalizePlantRef = value => value ? (/^(seed:|perennial:)/.test(value) ? value : `seed:${value}`) : '';

  const sortEvents = list => list.slice().sort((a, b) => {
    const dateOrder = String(b.date || '').localeCompare(String(a.date || ''));
    return dateOrder || Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });

  const render = () => {
    const query = searchInput.value.trim().toLocaleLowerCase('it');
    const category = categoryFilter.value;
    const seed = seedFilter.value;
    const parcel = parcelFilter.value;
    const filtered = sortEvents(events).filter(event => {
      const searchable = [event.notes, event.category, seedLabel(event.seedSlug), parcelLabel(event.parcelId)].join(' ').toLocaleLowerCase('it');
      return (!query || searchable.includes(query)) &&
        (!category || event.category === category) &&
        (!seed || normalizePlantRef(event.seedSlug) === seed) &&
        (!parcel || event.parcelId === parcel);
    });

    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'evento' : 'eventi'} visualizzati · ${events.length} totali`;
    emptyState.hidden = filtered.length > 0;
    eventsContainer.innerHTML = filtered.map(event => `
      <article class="regen-event" data-event-id="${escapeHTML(event.id)}">
        <div class="regen-event-date"><time datetime="${escapeHTML(event.date)}">${escapeHTML(formatDate(event.date))}</time></div>
        <div class="regen-event-body">
          <div class="regen-event-meta"><span class="regen-category-tag">${escapeHTML(event.category)}</span>${event.parcelId ? `<span class="regen-event-parcel">${escapeHTML(parcelLabel(event.parcelId))}</span>` : ''}<span class="regen-event-seed">${escapeHTML(seedLabel(event.seedSlug))}</span></div>
          <p>${escapeHTML(event.notes).replace(/\n/g, '<br>')}</p>
        </div>
        <button type="button" class="regen-delete-button" data-delete-id="${escapeHTML(event.id)}" aria-label="Elimina evento del ${escapeHTML(formatDate(event.date))}" title="Elimina evento">×</button>
      </article>
    `).join('');
    document.querySelectorAll('.regen-published-event').forEach(record => {
      const recordSearch = (record.dataset.search || record.textContent || '').toLocaleLowerCase('it');
      const visible = (!query || recordSearch.includes(query)) &&
        (!category || record.dataset.category === category) &&
        (!seed || normalizePlantRef(record.dataset.seed) === seed) &&
        (!parcel || record.dataset.parcel === parcel);
      record.hidden = !visible;
    });
    document.querySelectorAll('.regen-published-plan-list .regen-plan-item').forEach(record => {
      const recordSearch = (record.textContent || '').toLocaleLowerCase('it');
      record.hidden = (!query || recordSearch.includes(query)) && (!parcel || record.dataset.parcel === parcel) ? false : true;
      if (planViewSeason && planViewSeason.value) record.hidden = record.hidden || Number(record.dataset.season) !== Number(planViewSeason.value);
    });
    if (typeof renderPlantings === 'function') renderPlantings();
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const notes = notesInput.value.trim();
    if (!dateInput.value || !categoryInput.value || !notes) {
      feedback.textContent = 'Compila data, categoria e osservazioni.';
      return;
    }

    const item = {
      id: (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      date: dateInput.value,
      category: categoryInput.value,
      seedSlug: seedInput.value,
      parcelId: parcelInput.value,
      parcelLabel: parcelLabel(parcelInput.value),
      notes,
      createdAt: Date.now()
    };

    events.push(item);
    if (!persist()) {
      events = events.filter(existing => existing.id !== item.id);
      return;
    }

    form.reset();
    dateInput.value = todayLocal();
    categoryInput.value = 'Semina';
    feedback.textContent = 'Evento registrato in questo browser.';
    searchInput.value = '';
    categoryFilter.value = '';
    seedFilter.value = '';
    parcelFilter.value = '';
    render();
  });

  eventsContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-id]');
    if (!button) return;
    const target = events.find(item => item.id === button.dataset.deleteId);
    if (!target || !window.confirm(`Eliminare l'evento del ${formatDate(target.date)}?`)) return;
    const previous = events;
    events = events.filter(item => item.id !== target.id);
    if (!persist()) events = previous;
    render();
  });

  [searchInput, categoryFilter, seedFilter, parcelFilter].forEach(control => {
    control.addEventListener(control === searchInput ? 'input' : 'change', render);
  });

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    seedFilter.value = '';
    parcelFilter.value = '';
    render();
  });

  const downloadJSON = (payload, filename) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const safeSlug = value => String(value || 'evento').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'evento';
  const yamlString = value => JSON.stringify(String(value ?? ''));
  const markdownForEvent = item => {
    const seed = item.seedSlug ? seedLabel(item.seedSlug) : '';
    const title = `${item.category}: ${seed || 'evento generale'} (${item.date})`;
    const isPerennial = String(item.seedSlug || '').startsWith('perennial:');
    const slug = String(item.seedSlug || '').replace(/^(seed:|perennial:)/, '');
    return `---\nlayout: field-log\ntitle: ${yamlString(title)}\ntype: field\ndate: ${item.date}\nevent_id: ${yamlString(item.id)}\ncategory: ${yamlString(item.category)}\nseed_slug: ${yamlString(isPerennial ? '' : slug)}\nperennial_slug: ${yamlString(isPerennial ? slug : '')}\nseed_name: ${yamlString(seed)}\nparcel_id: ${yamlString(item.parcelId || '')}\nparcel_label: ${yamlString(item.parcelLabel || parcelLabel(item.parcelId))}\n---\n\n${String(item.notes || '').replace(/\r\n/g, '\n').trim()}\n`;
  };
  const crc32 = bytes => {
    let crc = -1;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    return (crc ^ -1) >>> 0;
  };
  const makeZip = files => {
    const encoder = new TextEncoder();
    const localParts = [], centralParts = [];
    let offset = 0;
    const u16 = n => [n & 255, (n >>> 8) & 255];
    const u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
    files.forEach(file => {
      const name = encoder.encode(file.name);
      const data = encoder.encode(file.content);
      const crc = crc32(data);
      const localHeader = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0)
      ]);
      localParts.push(localHeader, name, data);
      const centralHeader = new Uint8Array([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0),
        ...u16(0), ...u16(0), ...u32(0), ...u32(offset)
      ]);
      centralParts.push(centralHeader, name);
      offset += localHeader.length + name.length + data.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const centralOffset = offset;
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
      ...u32(centralSize), ...u32(centralOffset), ...u16(0)
    ]);
    return new Blob([...localParts, ...centralParts, end], {type: 'application/zip'});
  };

  publishExportButton.addEventListener('click', () => {
    if (!events.length && !plantings.length) {
      backupFeedback.textContent = 'Nessun evento o piano parcelle locale da preparare per la pubblicazione.';
      return;
    }
    const files = sortEvents(events).map(item => {
      const shortId = safeSlug(item.id).slice(-28);
      const filename = `field-${item.date}-${shortId || 'evento'}.md`;
      return { name: `_logs/${filename}`, content: markdownForEvent(item) };
    });
    const planYaml = `season: ${currentYear}
plantings:
${plantings.slice().sort((a,b) => Number(a.season)-Number(b.season) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it')).map(item => `  - parcel_id: ${yamlString(item.parcelId)}\n    parcel_label: ${yamlString(parcelLabel(item.parcelId))}\n    season: ${Number(item.season)}\n    crop: ${yamlString(item.crop)}\n    plants:${(Array.isArray(item.plants) && item.plants.length) ? `\n${item.plants.map(plant => `      - type: ${yamlString(plant.type)}\n        slug: ${yamlString(plant.slug)}\n        label: ${yamlString(plant.label)}`).join('\n')}` : ' []'}\n    notes: ${yamlString(item.notes || '')}`).join('\n')}\n`;
    files.push({name:'_data/plot-plantings.yml', content: planYaml});
    const blob = makeZip(files);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soil-genesis-field-logs-${todayLocal()}.zip`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    backupFeedback.textContent = `Pacchetto pronto: ${events.length} eventi e ${plantings.length} colture di base. Estrai _logs/ e _data/ nella radice del repository, poi esegui commit e push. Le bozze locali non vengono cancellate.`;
  });

  exportButton.addEventListener('click', () => {
    const stamp = todayLocal();
    downloadJSON({
      format: 'soil-genesis-regeneration-diary',
      version: 1,
      exportedAt: new Date().toISOString(),
      events: sortEvents(events),
      plantings: plantings.slice().sort((a, b) => Number(a.season) - Number(b.season) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'))
    }, `soil-genesis-diario-${stamp}.json`);
    backupFeedback.textContent = `Backup esportato: ${events.length} eventi e ${plantings.length} colture di base. Conserva il file in un luogo sicuro.`;
  });

  importTrigger.addEventListener('click', () => {
    importFile.value = '';
    importFile.click();
  });

  const isValidImportedEvent = item => item && typeof item === 'object' &&
    typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.category === 'string' && item.category.trim().length > 0 &&
    typeof item.notes === 'string' && item.notes.trim().length > 0 &&
    (item.seedSlug == null || typeof item.seedSlug === 'string') &&
    (item.parcelId == null || typeof item.parcelId === 'string');
  const isValidImportedPlanting = item => item && typeof item === 'object' &&
    typeof item.parcelId === 'string' && parcelLabel(item.parcelId) &&
    typeof item.crop === 'string' && item.crop.trim().length > 0 &&
    Number.isInteger(Number(item.season)) && Number(item.season) >= 2000 && Number(item.season) <= 2100 &&
    (item.notes == null || typeof item.notes === 'string') &&
    (item.plants == null || (Array.isArray(item.plants) && item.plants.every(plant => plant && typeof plant === 'object' && typeof plant.label === 'string')));

  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const isEnvelope = parsed && !Array.isArray(parsed) && parsed.format === 'soil-genesis-regeneration-diary' && parsed.version === 1;
      const importedEvents = Array.isArray(parsed) ? parsed : isEnvelope && Array.isArray(parsed.events) ? parsed.events : [];
      const importedPlantings = isEnvelope && Array.isArray(parsed.plantings) ? parsed.plantings : [];
      if (!Array.isArray(parsed) && !isEnvelope) throw new Error('Formato di backup non riconosciuto.');
      if (!importedEvents.every(isValidImportedEvent) || !importedPlantings.every(isValidImportedPlanting)) {
        throw new Error('Formato non riconosciuto o eventi/colture incompleti.');
      }

      const existingIds = new Set(events.map(item => String(item.id || '')).filter(Boolean));
      const incomingEvents = importedEvents.map((item, index) => ({
        id: String(item.id || `import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`),
        date: item.date,
        category: item.category.trim(),
        seedSlug: typeof item.seedSlug === 'string' ? item.seedSlug : '',
        parcelId: typeof item.parcelId === 'string' ? item.parcelId : '',
        parcelLabel: typeof item.parcelLabel === 'string' ? item.parcelLabel : parcelLabel(item.parcelId),
        notes: item.notes.trim(),
        createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now() + index
      }));
      const uniqueEvents = incomingEvents.filter(item => {
        if (existingIds.has(item.id)) return false;
        existingIds.add(item.id);
        return true;
      });

      const existingPlantingKeys = new Set(plantings.map(item => `${item.season}:${item.parcelId}`));
      const incomingPlantings = importedPlantings.map(item => ({
        parcelId: item.parcelId,
        crop: item.crop.trim(),
        plants: Array.isArray(item.plants) ? item.plants : [],
        season: Number(item.season),
        notes: typeof item.notes === 'string' ? item.notes.trim() : '',
        updatedAt: Number.isFinite(Number(item.updatedAt)) ? Number(item.updatedAt) : Date.now()
      }));
      const uniquePlantings = incomingPlantings.filter(item => {
        const key = `${item.season}:${item.parcelId}`;
        if (existingPlantingKeys.has(key)) return false;
        existingPlantingKeys.add(key);
        return true;
      });

      const previousEvents = events;
      const previousPlantings = plantings;
      events = events.concat(uniqueEvents);
      plantings = plantings.concat(uniquePlantings);
      if (!persist() || !persistPlantings()) {
        events = previousEvents;
        plantings = previousPlantings;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); } catch (_) {}
        backupFeedback.textContent = 'Importazione incompleta: impossibile salvare tutti i dati nella memoria locale. Le copie precedenti sono state ripristinate quando possibile.';
        return;
      }

      render();
      renderPlantings();
      backupFeedback.textContent = `Importazione completata: ${uniqueEvents.length} nuovi eventi e ${uniquePlantings.length} nuove colture; duplicati ignorati: ${importedEvents.length - uniqueEvents.length} eventi e ${importedPlantings.length - uniquePlantings.length} colture. Le colture già presenti non sono state sovrascritte.`;
    } catch (error) {
      backupFeedback.textContent = `Backup non importato: ${error.message || 'file non valido'}`;
    }
  });

  const persistPlantings = () => {
    try { localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); return true; }
    catch (error) { planFeedback.textContent = 'Salvataggio non riuscito: memoria locale non disponibile.'; return false; }
  };

  const renderPlantings = () => {
    const season = Number(planViewSeason.value || currentYear);
    const query = planSearch.value.trim().toLocaleLowerCase('it');
    const filtered = plantings.filter(item => Number(item.season) === season && (!parcelFilter.value || item.parcelId === parcelFilter.value) && [parcelLabel(item.parcelId), item.crop, item.notes].join(' ').toLocaleLowerCase('it').includes(query))
      .sort((a,b) => parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'));
    planList.innerHTML = filtered.map(item => `<article class="regen-plan-item"><div><span class="regen-plan-season">STAGIONE ${escapeHTML(item.season)}</span><h3>${escapeHTML(parcelLabel(item.parcelId))}</h3><p class="regen-plan-crop">${escapeHTML(Array.isArray(item.plants) && item.plants.length ? item.plants.map(plant => plant.label).join(' + ') : item.crop)}</p>${item.notes ? `<p>${escapeHTML(item.notes).replace(/\n/g,'<br>')}</p>` : ''}<p class="regen-plan-no-date">Coltura di base · data non registrata</p></div><button type="button" class="regen-delete-button" data-delete-planting="${escapeHTML(item.parcelId)}" data-season="${escapeHTML(item.season)}" aria-label="Rimuovi coltura dalla parcella">×</button></article>`).join('');
    if (!filtered.length) planList.innerHTML = '<p class="regen-backup-help">Nessuna coltura registrata per questa stagione e questi filtri.</p>';
    renderRotations();
  };

  const renderRotations = () => {
    if (!rotationList) return;
    const season = Number(planViewSeason.value || currentYear);
    const all = [];
    const seen = new Set();
    [...plantings, ...publishedPlantings].forEach(item => {
      const seasonValue = Number(item.season);
      const parcelId = item.parcelId || item.parcel_id || '';
      if (!parcelId || !Number.isInteger(seasonValue)) return;
      const key = `${seasonValue}:${parcelId}`;
      const normalized = { ...item, parcelId, season: seasonValue, plants: Array.isArray(item.plants) ? item.plants : [] };
      if (seen.has(key)) {
        const idx = all.findIndex(record => `${record.season}:${record.parcelId}` === key);
        if (idx >= 0 && normalized.plants.length && !all[idx].plants?.length) all[idx] = normalized;
        return;
      }
      seen.add(key); all.push(normalized);
    });
    const current = all.filter(item => item.season === season).sort((a,b) => parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'));
    if (!current.length) { rotationList.innerHTML = '<p class="regen-backup-help">Nessuna coltura per la stagione selezionata. Registra il piano attuale e le stagioni precedenti per iniziare a confrontare le rotazioni.</p>'; return; }
    rotationList.innerHTML = current.map(item => {
      const currentFamilies = familiesForPlanting(item);
      const prior = all.filter(old => old.parcelId === item.parcelId && old.season < item.season).sort((a,b) => b.season-a.season);
      const last = prior[0];
      const previousFamilies = last ? familiesForPlanting(last) : [];
      const repeated = currentFamilies.filter(family => previousFamilies.some(old => old.toLocaleLowerCase('it') === family.toLocaleLowerCase('it')));
      let status = 'STORICO INSUFFICIENTE', cls = 'is-unknown', detail = 'Non c’è una stagione precedente registrata per questa parcella.';
      if (last && (!currentFamilies.length || !previousFamilies.length)) { status = 'FAMIGLIA DA VERIFICARE'; cls = 'is-unknown'; detail = `Ultima stagione registrata: ${last.season}. Una o entrambe le colture non hanno una famiglia botanica disponibile.`; }
      else if (last && repeated.length) { status = 'FAMIGLIA RIPETUTA'; cls = 'is-warning'; detail = `Rispetto al ${last.season}, ricompare: ${repeated.join(', ')}. Valuta una coltura di famiglia diversa e verifica le esigenze specifiche.`; }
      else if (last) { status = 'NESSUNA RIPETIZIONE RILEVATA'; cls = ''; detail = `Confronto con ${last.season}: non risultano famiglie botaniche in comune tra le colture registrate.`; }
      return `<article class="regen-rotation-item"><span class="regen-rotation-status ${cls}">${status}</span><h3>${escapeHTML(parcelLabel(item.parcelId))}</h3><p><strong>Coltura attuale:</strong> ${escapeHTML(Array.isArray(item.plants) && item.plants.length ? item.plants.map(plant => plant.label || plant.slug).join(' + ') : item.crop || item.plants?.map(plant => plant.label || plant.slug).join(' + ') || 'Non specificata')}</p><p><strong>Famiglie attuali:</strong> ${escapeHTML(currentFamilies.join(', ') || 'Non disponibili')}</p><p>${escapeHTML(detail)}</p></article>`;
    }).join('');
  };

  planForm.addEventListener('submit', event => {
    event.preventDefault();
    const parcelId = planParcelInput.value;
    const plants = selectedPlanPlants();
    const crop = plants.map(plant => plant.label).join(' + ');
    const season = Number(planSeasonInput.value);
    if (!parcelId || !plants.length || !Number.isInteger(season) || season < 2000 || season > 2100) {
      planFeedback.textContent = 'Indica stagione, parcella e almeno una pianta dell’archivio.'; return;
    }
    const previous = plantings;
    const existingIndex = plantings.findIndex(item => item.parcelId === parcelId && Number(item.season) === season);
    const record = { parcelId, crop, plants, season, notes: planNotesInput.value.trim(), updatedAt: Date.now() };
    plantings = plantings.slice();
    if (existingIndex >= 0) {
      if (!window.confirm(`La parcella «${parcelLabel(parcelId)}» ha già una coltura per ${season}. Sostituirla con questa consociazione?`)) return;
      plantings[existingIndex] = record;
    } else plantings.push(record);
    if (!persistPlantings()) { plantings = previous; return; }
    document.querySelectorAll('.regen-plan-plant').forEach(input => { input.checked = false; });
    planNotesInput.value = ''; planViewSeason.value = String(season); planSearch.value = '';
    planFeedback.textContent = `Consociazione salvata: ${plants.map(plant => plant.label).join(' + ')}. Nessuna data d’impianto aggiunta.`;
    renderPlantings();
  });

  planList.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-planting]');
    if (!button) return;
    const target = plantings.find(item => item.parcelId === button.dataset.deletePlanting && String(item.season) === button.dataset.season);
    if (!target || !window.confirm(`Rimuovere ${target.crop} da ${parcelLabel(target.parcelId)} per ${target.season}?`)) return;
    const previous = plantings;
    plantings = plantings.filter(item => item !== target);
    if (!persistPlantings()) plantings = previous;
    renderPlantings();
  });
  planViewSeason.addEventListener('change', () => { renderPlantings(); render(); });
  planSearch.addEventListener('input', renderPlantings);
  if (planPlantSearch && planPlantOptions) planPlantSearch.addEventListener('input', () => {
    const query = planPlantSearch.value.trim().toLocaleLowerCase('it');
    planPlantOptions.querySelectorAll('label').forEach(label => { label.hidden = !label.textContent.toLocaleLowerCase('it').includes(query); });
  });

  render();
  renderPlantings();
})();
