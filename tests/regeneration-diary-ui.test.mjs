import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/pages/regeneration-diary.css'), 'utf8');
const page = readFileSync(resolve(root, 'piano-parcelle.md'), 'utf8');

test('la libreria fitosanitaria è chiusa per impostazione predefinita', () => {
  assert.match(js, /<details class="regen-pathogen-library">/);
  assert.doesNotMatch(js, /<details class="regen-pathogen-library"[^>]*\bopen\b/);
});

test('le schede compatibili e i dettagli delle rotazioni non appesantiscono le schede iniziali', () => {
  assert.match(js, /<details class="regen-crop-pathogen-links">/);
  assert.match(js, /<details class="regen-rotation-more">/);
  assert.match(js, /<details class="regen-rotation-evidence">/);
});

test('i link contestuali aprono il profilo richiesto e lo portano in vista', () => {
  assert.match(js, /data-open-pathogen/);
  assert.match(js, /library\.open = true/);
  assert.match(js, /target\.open = true/);
  assert.match(js, /target\.scrollIntoView/);
});

test('il piano pubblicato è espandibile e i controlli hanno stili di focus', () => {
  assert.match(page, /<details class="regen-published-plan-disclosure">/);
  assert.match(css, /summary:focus-visible/);
  assert.match(css, /regen-published-plan-disclosure/);
});
