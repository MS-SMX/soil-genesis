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
