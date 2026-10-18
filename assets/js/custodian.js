(() => {
  'use strict';
  const root = document.getElementById('custodian-dashboard');
  if (!root) return;

  const dataNode = document.getElementById('custodian-seed-data');
  let seeds = [];
  try { seeds = JSON.parse(dataNode.textContent || '[]'); } catch (error) { seeds = []; }

  const $ = id => document.getElementById(id);
  const search = $('custodian-search');
  const filter = $('custodian-filter');
  const list = $('custodian-work-list');
  const empty = $('custodian-no-results');
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthNames = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const months = value => String(value || '').split(',').map(v => Number(v.trim())).filter(v => v >= 1 && v <= 12);
  const hasValue = value => value !== null && value !== undefined && String(value).trim() !== '';

  const issuesFor = seed => {
    const issues = [];
    if (!seed.hasIdentity) issues.push({key:'incomplete', label:'Identità incompleta', level:2});
    if (!hasValue(seed.family)) issues.push({key:'incomplete', label:'Famiglia botanica mancante', level:2});
    if (!Number(seed.imageCount)) issues.push({key:'images', label:'Immagini mancanti', level:2});
    if (!seed.hasSowingNotes) issues.push({key:'incomplete', label:'Istruzioni di semina mancanti', level:1});
    if (!seed.hasCultivationNotes) issues.push({key:'incomplete', label:'Istruzioni di coltivazione mancanti', level:1});
    const year = Number(seed.lastYear);
    if (!year || year < currentYear - 2) issues.push({key:'reproduction', label:!year ? 'Ultima riproduzione non registrata' : `Riproduzione da verificare: ${year}`, level:!year ? 3 : 2});
    const status = String(seed.status || '').toLowerCase();
    if (/(critico|da.rigenerare|esaurit|pericol)/.test(status)) issues.push({key:'urgent', label:`Stato di conservazione: ${seed.status}`, level:3});
    return issues;
  };

  const all = seeds.map(seed => ({...seed, issues:issuesFor(seed)}));
  const urgentCount = all.filter(seed => seed.issues.some(issue => issue.level >= 3)).length;
  $('custodian-total').textContent = all.length;
  $('custodian-incomplete').textContent = all.filter(seed => seed.issues.some(issue => ['incomplete','images'].includes(issue.key))).length;
  $('custodian-review').textContent = all.filter(seed => seed.issues.some(issue => issue.key === 'reproduction' || issue.key === 'urgent')).length;
  $('custodian-season-label').textContent = `Operazioni previste a ${monthNames[currentMonth - 1]}`;

  const seasonal = [];
  all.forEach(seed => {
    const tasks = [];
    if (months(seed.sowSeedling).includes(currentMonth)) tasks.push('Semenzaio');
    if (months(seed.sowDirect).includes(currentMonth)) tasks.push('Semina diretta');
    if (months(seed.harvestMonths).includes(currentMonth)) tasks.push('Raccolta seme');
    if (tasks.length) seasonal.push({...seed, tasks});
  });
  $('custodian-seasonal').textContent = seasonal.length;
  $('custodian-season-list').innerHTML = seasonal.length ? seasonal.map(seed => `
    <a class="custodian-season-item" href="${esc(seed.url)}"><span class="custodian-season-name">${esc(seed.name)}</span><span class="custodian-season-tasks">${seed.tasks.map(esc).join(' · ')}</span><span class="custodian-arrow" aria-hidden="true">↗</span></a>
  `).join('') : '<p class="custodian-muted">Nessuna semina o raccolta indicata per questo mese nei dossier disponibili.</p>';

  const priority = seed => seed.issues.reduce((max, issue) => Math.max(max, issue.level), 0);
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase('it');
    const selected = filter.value;
    const filtered = all.filter(seed => {
      const haystack = [seed.name, seed.scientific, seed.family, seed.status, ...seed.issues.map(issue => issue.label)].join(' ').toLocaleLowerCase('it');
      const matchesQuery = !query || haystack.includes(query);
      const matchesFilter = selected === 'all' || seed.issues.some(issue => selected === 'urgent' ? issue.level >= 3 : issue.key === selected);
      return matchesQuery && matchesFilter;
    }).sort((a,b) => priority(b)-priority(a) || a.name.localeCompare(b.name, 'it'));

    $('custodian-result-count').textContent = `${filtered.length} accessioni visualizzate · ordinate per priorità suggerita`;
    empty.hidden = filtered.length > 0;
    list.innerHTML = filtered.map(seed => {
      const level = priority(seed);
      const badge = level >= 3 ? 'PRIORITÀ ALTA' : level === 2 ? 'DA RIVEDERE' : seed.issues.length ? 'COMPLETAMENTO' : 'DATI PRESENTI';
      const issueMarkup = seed.issues.length ? seed.issues.map(issue => `<span class="custodian-issue custodian-issue-${issue.level >= 3 ? 'high' : issue.level === 2 ? 'medium' : 'low'}">${esc(issue.label)}</span>`).join('') : '<span class="custodian-issue custodian-issue-ok">Nessuna criticità rilevata dai controlli automatici</span>';
      return `<article class="custodian-seed-card" data-priority="${level}">
        <div class="custodian-seed-main"><div class="custodian-seed-kicker">${esc(seed.slug)}</div><h3><a href="${esc(seed.url)}">${esc(seed.name || 'Accessione senza nome')}</a></h3><p>${esc(seed.scientific || 'Nome scientifico mancante')}${seed.family ? ` · ${esc(seed.family)}` : ''}</p><div class="custodian-issues">${issueMarkup}</div></div>
        <div class="custodian-seed-side"><span class="custodian-priority custodian-priority-${level >= 3 ? 'high' : level === 2 ? 'medium' : 'low'}">${badge}</span><a class="custodian-open" href="${esc(seed.url)}">APRI DOSSIER ↗</a></div>
      </article>`;
    }).join('');
  };

  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  $('custodian-reset').addEventListener('click', () => { search.value = ''; filter.value = 'all'; render(); });
  render();
})();
