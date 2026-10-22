(() => {
  'use strict';
  const root = document.getElementById('botanical-quality');
  if (!root) return;
  const search = root.querySelector('#botanical-quality-search');
  const family = root.querySelector('#botanical-quality-family');
  const life = root.querySelector('#botanical-quality-life');
  const all = root.querySelector('#botanical-quality-all');
  const count = root.querySelector('#botanical-quality-count');
  const empty = root.querySelector('#botanical-quality-no-results');
  const cards = [...root.querySelectorAll('.botanical-quality-card')];
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase('it');
    let visible = 0;
    cards.forEach(card => {
      const familyMissing = card.dataset.familyMissing === 'true';
      const lifeMissing = card.dataset.lifeMissing === 'true';
      const matchesIssue = all.checked || ((family.checked && familyMissing) || (life.checked && lifeMissing));
      const matchesQuery = (card.dataset.search || '').includes(query);
      const show = matchesIssue && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `${visible} dossier visibili su ${cards.length} con almeno un campo botanico da verificare.`;
    empty.hidden = visible > 0;
  };
  [search, family, life, all].forEach(control => control.addEventListener('input', render));
  render();
})();
