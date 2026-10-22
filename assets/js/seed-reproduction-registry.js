(() => {
  const root = document.getElementById('reproduction-registry');
  if (!root) return;
  const search = root.querySelector('#reproduction-search');
  const missing = root.querySelector('#reproduction-missing');
  const documented = root.querySelector('#reproduction-documented');
  const count = root.querySelector('#reproduction-count');
  const empty = root.querySelector('#reproduction-empty');
  const cards = [...root.querySelectorAll('.reproduction-card')];
  const filter = () => {
    const query = (search.value || '').trim().toLocaleLowerCase('it');
    let visible = 0;
    cards.forEach(card => {
      const matchesSearch = (card.dataset.search || '').includes(query);
      const hasEvidence = card.dataset.documented === 'true';
      const matchesEvidence = documented.checked ? hasEvidence : (!missing.checked || !hasEvidence);
      const show = matchesSearch && matchesEvidence;
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} dossier visualizzati su ${cards.length}`;
    empty.hidden = visible > 0;
  };
  search.addEventListener('input', filter);
  missing.addEventListener('change', () => { if (missing.checked) documented.checked = false; filter(); });
  documented.addEventListener('change', () => { if (documented.checked) missing.checked = false; filter(); });
  filter();
})();
