import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
const html = readFileSync(resolve(root, 'piano-parcelle.md'), 'utf8');
const docs = readFileSync(resolve(root, 'docs/STORICO-CONDIZIONI-PARCELLE-0.26.0.md'), 'utf8');

test('lo storico usa una chiave di storage separata dal piano stagionale', () => {
  assert.match(js, /CONDITION_HISTORY_KEY = 'soil-genesis:parcel-condition-observations:v1'/);
  assert.match(js, /let conditionObservations = readConditionObservations\(\)/);
  assert.match(js, /const observation = \{ id: `obs-/);
});
test('un campo non registrato è omesso dall’osservazione invece di essere interpretato come assenza', () => {
  assert.match(js, /input\.value !== 'unknown'/);
  assert.match(html, /I campi lasciati su “Non registrato” non vengono aggiunti/);
});
test('backup e importazione includono le osservazioni e ignorano ID duplicati', () => {
  assert.match(js, /conditionObservations: conditionObservations\.slice\(\)/);
  assert.match(js, /importedObservations/);
  assert.match(js, /existingObservationIds\.add\(item\.id\)/);
  assert.match(js, /persistConditionObservations\(\)/);
});
test('il pacchetto di pubblicazione genera il file dati delle osservazioni', () => {
  assert.match(js, /_data\/parcel-condition-history\.yml/);
  assert.match(html, /regen-published-condition-observations/);
  assert.match(js, /published: true/);
  assert.match(js, /PUBBLICATA/);
});
test('lo storico distingue le osservazioni dalle condizioni correnti del piano', () => {
  assert.match(js, /non modifica il piano colturale né le registrazioni precedenti/);
  assert.match(docs, /Modificare il piano non riscrive le osservazioni/);
  assert.match(docs, /non costituisce diagnosi fitosanitaria/);
});
