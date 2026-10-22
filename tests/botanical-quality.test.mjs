import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'qualita-dati-botanici.md'),'utf8');
const js=readFileSync(resolve(root,'assets/js/botanical-quality.js'),'utf8');
const css=readFileSync(resolve(root,'assets/css/pages/botanical-quality.css'),'utf8');
const nav=readFileSync(resolve(root,'_includes/navbar.html'),'utf8');
test('la pagina di qualità dati controlla le tre collezioni botaniche previste',()=>{
  assert.match(html,/site\.seeds \| concat: site\.perennials \| concat: site\.spontaneous/);
  assert.match(html,/family_missing/);
  assert.match(html,/life_missing/);
});
test('i filtri consentono ricerca e revisione separata dei due campi',()=>{
  assert.match(html,/botanical-quality-search/);
  assert.match(html,/botanical-quality-family/);
  assert.match(html,/botanical-quality-life/);
  assert.match(html,/botanical-quality-all/);
  assert.match(js,/matchesIssue/);
  assert.match(js,/matchesQuery/);
});
test('i risultati collegano il dossier e l editor GitHub senza compilare i campi mancanti',()=>{
  assert.match(html,/Apri dossier/);
  assert.match(html,/Modifica su GitHub/);
  assert.match(html,/non corregge né completa automaticamente/);
  assert.match(html,/github\.com\/MS-SMX\/soil-genesis\/edit\/main/);
});
test('la pagina è raggiungibile dal menu e ha layout responsivo',()=>{
  assert.match(nav,/qualita-dati-botanici/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(html,/id="botanical-quality-no-results"/);
});
