(() => {
  'use strict';
  const root = document.getElementById('botanical-source-registry');
  if (!root) return;
  const search = root.querySelector('#botanical-source-search');
  const family = root.querySelector('#botanical-source-family');
  const life = root.querySelector('#botanical-source-life');
  const mismatch = root.querySelector('#botanical-source-mismatch');
  const all = root.querySelector('#botanical-source-all');
  const count = root.querySelector('#botanical-source-count');
  const empty = root.querySelector('#botanical-source-empty');
  const cards = [...root.querySelectorAll('.botanical-source-card')];
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase('it');
    let visible = 0;
    cards.forEach(card => {
      const familyIncomplete = card.dataset.familyIncomplete === 'true';
      const lifeIncomplete = card.dataset.lifeIncomplete === 'true';
      const hasMismatch = card.dataset.familyMismatch === 'true' || card.dataset.lifeMismatch === 'true';
      const matchesIssue = all.checked || ((family.checked && familyIncomplete) || (life.checked && lifeIncomplete) || (mismatch.checked && hasMismatch));
      const matchesQuery = (card.dataset.search || '').includes(query);
      const show = matchesIssue && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `${visible} dossier visibili su ${cards.length}. Il controllo riguarda i metadati delle fonti, non certifica la correttezza scientifica.`;
    empty.hidden = visible > 0;
  };
  [search, family, life, mismatch, all].forEach(control => control.addEventListener('input', render));
  render();
})();
