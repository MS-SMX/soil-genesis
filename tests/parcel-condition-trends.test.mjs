import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
const html = readFileSync(resolve(root, 'piano-parcelle.md'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/pages/regeneration-diary.css'), 'utf8');
const docs = readFileSync(resolve(root, 'docs/LETTURA-TEMPORALE-CONDIZIONI-0.27.0.md'), 'utf8');

test('il riepilogo temporale ha un contenitore accessibile dedicato', () => {
  assert.match(html, /regen-condition-trends-title/);
  assert.match(html, /id="regen-condition-trends"[^>]*aria-live="polite"/);
});
test('il confronto è limitato all’anno selezionato e al filtro parcella', () => {
  assert.match(js, /Number\(item\.date\.slice\(0,4\)\) <= season/);
  assert.match(js, /normalizeParcelId\(item\.parcelId\) === normalizeParcelId\(parcelSelected\)/);
});
test('i quattro campi distinguono dati mancanti, osservazione singola, stabilità e cambiamento', () => {
  for (const field of ['drainage', 'irrigation', 'residues', 'health']) assert.ok(js.includes(`['${field}'`));
  assert.match(js, /Nessun dato registrato entro/);
  assert.match(js, /Una sola osservazione disponibile/);
  assert.match(js, /Invariato rispetto al/);
  assert.match(js, /Cambiamento registrato tra/);
});
test('il riepilogo non afferma causalità o diagnosi', () => {
  assert.match(html, /non dimostra che una pratica o una condizione ne sia la causa/);
  assert.match(docs, /non attribuisce causalità/);
  assert.match(docs, /non costituisce diagnosi/);
});
test('il riepilogo ha regole responsive per la visualizzazione mobile', () => {
  assert.match(css, /\.regen-condition-trends/);
  assert.match(css, /@media\(max-width:700px\) \{ \.regen-condition-trends \{/);
});
