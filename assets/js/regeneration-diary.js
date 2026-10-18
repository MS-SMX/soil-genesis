(() => {
  'use strict';

  const root = document.getElementById('regen-diary');
  if (!root) return;

  const STORAGE_KEY = 'soil-genesis:regeneration-diary:v1';
  const form = document.getElementById('regen-form');
  const dateInput = document.getElementById('regen-date');
  const categoryInput = document.getElementById('regen-category');
  const seedInput = document.getElementById('regen-seed');
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

  dateInput.value = todayLocal();

  const readEvents = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
    } catch (error) {
      return [];
    }
  };

  let events = readEvents();

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
    const option = Array.from(seedInput.options).find(item => item.value === slug);
    return option ? option.textContent.trim() : slug;
  };

  const sortEvents = list => list.slice().sort((a, b) => {
    const dateOrder = String(b.date || '').localeCompare(String(a.date || ''));
    return dateOrder || Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });

  const render = () => {
    const query = searchInput.value.trim().toLocaleLowerCase('it');
    const category = categoryFilter.value;
    const seed = seedFilter.value;
    const filtered = sortEvents(events).filter(event => {
      const searchable = [event.notes, event.category, seedLabel(event.seedSlug)].join(' ').toLocaleLowerCase('it');
      return (!query || searchable.includes(query)) &&
        (!category || event.category === category) &&
        (!seed || event.seedSlug === seed);
    });

    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'evento' : 'eventi'} visualizzati · ${events.length} totali`;
    emptyState.hidden = filtered.length > 0;
    eventsContainer.innerHTML = filtered.map(event => `
      <article class="regen-event" data-event-id="${escapeHTML(event.id)}">
        <div class="regen-event-date"><time datetime="${escapeHTML(event.date)}">${escapeHTML(formatDate(event.date))}</time></div>
        <div class="regen-event-body">
          <div class="regen-event-meta"><span class="regen-category-tag">${escapeHTML(event.category)}</span><span class="regen-event-seed">${escapeHTML(seedLabel(event.seedSlug))}</span></div>
          <p>${escapeHTML(event.notes).replace(/\n/g, '<br>')}</p>
        </div>
        <button type="button" class="regen-delete-button" data-delete-id="${escapeHTML(event.id)}" aria-label="Elimina evento del ${escapeHTML(formatDate(event.date))}" title="Elimina evento">×</button>
      </article>
    `).join('');
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

  [searchInput, categoryFilter, seedFilter].forEach(control => {
    control.addEventListener(control === searchInput ? 'input' : 'change', render);
  });

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    seedFilter.value = '';
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
    return `---\nlayout: field-log\ntitle: ${yamlString(title)}\ntype: field\ndate: ${item.date}\nevent_id: ${yamlString(item.id)}\ncategory: ${yamlString(item.category)}\nseed_slug: ${yamlString(item.seedSlug || '')}\nseed_name: ${yamlString(seed)}\n---\n\n${String(item.notes || '').replace(/\r\n/g, '\n').trim()}\n`;
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
    if (!events.length) {
      backupFeedback.textContent = 'Nessun evento locale da preparare per la pubblicazione.';
      return;
    }
    const files = sortEvents(events).map(item => {
      const shortId = safeSlug(item.id).slice(-28);
      const filename = `field-${item.date}-${shortId || 'evento'}.md`;
      return { name: `_logs/${filename}`, content: markdownForEvent(item) };
    });
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
    backupFeedback.textContent = `Pacchetto pronto: ${files.length} file Markdown nella cartella _logs/. Estrai il contenuto nella radice del repository e poi esegui commit e push. Gli eventi locali non vengono cancellati.`;
  });

  exportButton.addEventListener('click', () => {
    const stamp = todayLocal();
    downloadJSON({
      format: 'soil-genesis-regeneration-diary',
      version: 1,
      exportedAt: new Date().toISOString(),
      events: sortEvents(events)
    }, `soil-genesis-diario-${stamp}.json`);
    backupFeedback.textContent = `Backup esportato: ${events.length} ${events.length === 1 ? 'evento' : 'eventi'}. Conserva il file in un luogo sicuro.`;
  });

  importTrigger.addEventListener('click', () => {
    importFile.value = '';
    importFile.click();
  });

  const isValidImportedEvent = item => item && typeof item === 'object' &&
    typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.category === 'string' && item.category.trim().length > 0 &&
    typeof item.notes === 'string' && item.notes.trim().length > 0 &&
    (item.seedSlug == null || typeof item.seedSlug === 'string');

  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : parsed && parsed.format === 'soil-genesis-regeneration-diary' && parsed.version === 1 ? parsed.events : null;
      if (!Array.isArray(imported) || !imported.every(isValidImportedEvent)) {
        throw new Error('Formato non riconosciuto o eventi incompleti.');
      }

      const existingIds = new Set(events.map(item => String(item.id || '')).filter(Boolean));
      const incoming = imported.map((item, index) => ({
        id: String(item.id || `import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`),
        date: item.date,
        category: item.category.trim(),
        seedSlug: typeof item.seedSlug === 'string' ? item.seedSlug : '',
        notes: item.notes.trim(),
        createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now() + index
      }));
      const uniqueIncoming = incoming.filter(item => {
        if (existingIds.has(item.id)) return false;
        existingIds.add(item.id);
        return true;
      });

      if (uniqueIncoming.length === 0) {
        backupFeedback.textContent = `Importazione completata: nessun nuovo evento. I ${imported.length} eventi del file erano già presenti.`;
        return;
      }

      const previous = events;
      events = events.concat(uniqueIncoming);
      if (!persist()) {
        events = previous;
        backupFeedback.textContent = 'Importazione annullata: non è stato possibile salvare i dati nella memoria locale.';
        return;
      }

      render();
      backupFeedback.textContent = `Importati ${uniqueIncoming.length} nuovi eventi; ${imported.length - uniqueIncoming.length} duplicati ignorati. Gli eventi già presenti sono stati mantenuti.`;
    } catch (error) {
      backupFeedback.textContent = `Backup non importato: ${error.message || 'file non valido'}`;
    }
  });

  render();
})();
