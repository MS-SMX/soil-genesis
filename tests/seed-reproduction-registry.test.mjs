import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('il registro riproduttivo mostra le quattro aree senza confondere dati e fonti', () => {
  const page = readFileSync(resolve(root, 'registro-riproduzione.md'), 'utf8');
  for (const field of ['impollinazione', 'isolamento', 'maturita_seme', 'popolazione']) assert.ok(page.includes(field), `manca ${field}`);
  assert.match(page, /plant\.distanza_isolamento/);
  assert.match(page, /plant\.periodo_raccolta_seme/);
  assert.match(page, /Fonte specifica non registrata/);
  assert.match(page, /Non usare un seme ottenuto da un incrocio incerto/);
});
test('fonti metodologiche e limiti sono documentati', () => {
  const page = readFileSync(resolve(root, 'registro-riproduzione.md'), 'utf8');
  assert.match(page, /seedalliance\.org\/publications\/seed-saving-guide/);
  assert.match(page, /seedsavers\.org\/learn\/isolation-methods/);
  const doc = readFileSync(resolve(root, 'docs/REGISTRO-RIPRODUZIONE-0.38.0.md'), 'utf8');
  assert.match(doc, /a livello di specie/);
  assert.match(doc, /rischio residuo/);
});
test('script filtro ha selettori presenti nella pagina e gestisce i dossier senza evidenze', () => {
  const page = readFileSync(resolve(root, 'registro-riproduzione.md'), 'utf8');
  const js = readFileSync(resolve(root, 'assets/js/seed-reproduction-registry.js'), 'utf8');
  for (const id of ['reproduction-search', 'reproduction-missing', 'reproduction-documented', 'reproduction-count', 'reproduction-empty']) assert.ok(page.includes(`id="${id}"`), `pagina senza ${id}`);
  assert.match(js, /dataset\.documented/);
  assert.match(js, /addEventListener\('input'/);
});

test('le evidenze riproduttive applicate sono tracciabili e datate', () => {
  const seeds = readdirSync(resolve(root, '_seeds')).filter(name => name.endsWith('.md'));
  const sourced = seeds.map(name => ({ name, text: readFileSync(resolve(root, '_seeds', name), 'utf8') })).filter(record => /^fonti_riproduzione:/m.test(record.text));
  assert.equal(sourced.length, 37);
  for (const record of sourced) {
    assert.match(record.text, /fonti_riproduzione:[\s\S]*?impollinazione:[\s\S]*?valore:/, record.name);
    assert.match(record.text, /isolamento:[\s\S]*?url: "https:\/\//, record.name);
    assert.match(record.text, /maturita_seme:[\s\S]*?data_verifica: "2026-10-22"/, record.name);
    assert.match(record.text, /popolazione:[\s\S]*?url: "https:\/\//, record.name);
  }
});
