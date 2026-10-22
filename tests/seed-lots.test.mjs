import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = readFileSync(resolve(root, 'lotti-seme.md'), 'utf8');
const js = readFileSync(resolve(root, 'assets/js/seed-lots.js'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/pages/seed-lots.css'), 'utf8');

test('pagina lotti collegata a un dossier esistente e raggiungibile dal menu', () => {
  assert.match(page, /site\.seeds \| sort_natural/);
  assert.match(page, /permalink: \/lotti-seme\//);
  assert.match(page, /site\.data\['seed-lots'\]\.lots/);
  assert.match(readFileSync(resolve(root, '_data/seed-lots.yml'), 'utf8'), /lots: \[\]/);
  assert.match(readFileSync(resolve(root, '_includes/navbar.html'), 'utf8'), /LOTTI \/ GERMINAZIONE/);
  assert.match(readFileSync(resolve(root, '_layouts/application.html'), 'utf8'), /pages\/seed-lots\.css/);
});
test('il lotto registra identificativo, provenienza, quantità, conservazione e stato', () => {
  for (const field of ['lot-date','lot-origin','lot-quantity','lot-unit','lot-storage','lot-status','lot-notes']) assert.ok(page.includes(`id="${field}"`), `campo mancante: ${field}`);
  assert.match(js, /makeLotId/);
  assert.match(js, /SGLOT-/);
});
test('la prova di germinazione valida il campione e calcola la percentuale', () => {
  for (const field of ['test-date','test-sown','test-germinated','test-days','test-temperature','test-method','test-notes']) assert.ok(page.includes(`id="${field}"`), `campo mancante: ${field}`);
  assert.match(js, /germinated > sown/);
  assert.match(js, /\(test\.germinated \/ test\.sown\) \* 1000/);
});
test('il registro salva in locale, supporta backup e importa record compatibili', () => {
  assert.match(js, /soil-genesis:seed-lots:v1/);
  assert.match(js, /localStorage\.setItem/);
  assert.match(js, /lots-export-json/);
  assert.match(js, /lots-import-trigger/);
  assert.match(js, /Il file contiene record non compatibili/);
});
test('esportazione YAML mantiene lotto e prove con i limiti descritti', () => {
  assert.match(js, /seed-lots\.yml/);
  assert.match(js, /germination_tests/);
  assert.match(js, /germination_percent/);
  assert.match(page, /non garantisce da sola la vitalità dell'intero lotto/i);
  assert.match(page, /non pubblica/i);
});
test("l'interfaccia ha feedback accessibili e layout responsivo", () => {
  for (const id of ['lot-feedback','test-feedback','lots-backup-feedback','lots-list','lots-search']) assert.ok(page.includes(`id="${id}"`));
  assert.match(page, /aria-live="polite"/);
  assert.match(css, /@media\(max-width:650px\)/);
  assert.match(css, /:focus-visible/);
});
