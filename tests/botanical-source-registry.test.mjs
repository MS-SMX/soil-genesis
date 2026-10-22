import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const page=readFileSync(resolve(root,'registro-fonti-botaniche.md'),'utf8');
const js=readFileSync(resolve(root,'assets/js/botanical-source-registry.js'),'utf8');
const nav=readFileSync(resolve(root,'_includes/navbar.html'),'utf8');
const css=readFileSync(resolve(root,'assets/css/pages/botanical-quality.css'),'utf8');
test('il registro esamina le collezioni botaniche senza scrivere dati',()=>{
  assert.match(page,/site\.seeds \| concat: site\.perennials \| concat: site\.spontaneous/);
  assert.match(page,/fonti_botaniche\.famiglia/);
  assert.match(page,/fonti_botaniche\.ciclo_vita/);
  assert.match(js,/non certifica la correttezza scientifica/);
});
test('la completezza richiede valore, fonte, URL e data di verifica',()=>{
  assert.match(page,/family_source_name != ""/);
  assert.match(page,/family_source_url contains "http"/);
  assert.match(page,/family_source_date != ""/);
  assert.match(page,/family_source_value != ""/);
  assert.match(page,/life_source_name != ""/);
  assert.match(page,/life_source_url contains "http"/);
  assert.match(page,/life_source_date != ""/);
  assert.match(page,/life_source_value != ""/);
});
test('il registro confronta i valori e filtra dossier incompleti o da riconciliare',()=>{
  assert.match(page,/family_mismatch/);
  assert.match(page,/life_mismatch/);
  assert.match(js,/matchesIssue/);
  assert.match(js,/matchesQuery/);
  assert.match(page,/data-family-incomplete/);
  assert.match(page,/data-life-incomplete/);
});
test('il registro è raggiungibile dal menu e documenta il formato del front matter',()=>{
  assert.match(nav,/registro-fonti-botaniche/);
  assert.match(page,/data_verifica/);
  assert.match(page,/valore: "valore riportato dalla fonte"/);
  assert.match(css,/@media\(max-width:700px\)/);
});
