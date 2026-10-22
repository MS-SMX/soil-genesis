import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=readFileSync(resolve(root,'assets/js/parcel-history.js'),'utf8');
const html=readFileSync(resolve(root,'storico-parcelle.md'),'utf8');
const css=readFileSync(resolve(root,'assets/css/pages/regeneration-diary.css'),'utf8');
test('lo storico agronomico presenta una sezione di contesto rotazionale',()=>{
  assert.match(html,/id="parcel-rotation-context-results"/);
  assert.match(html,/CONTESTO DELLA ROTAZIONE/);
  assert.match(js,/renderRotationContext\(parcel,min,max\)/);
});
test('il confronto usa solo famiglie esplicitamente registrate nei piani',()=>{
  assert.match(js,/plant\.family\|\|plant\.family_name/);
  assert.match(js,/Confronto non disponibile: verifica le famiglie botaniche/);
  assert.match(js,/current\.season-3/);
});
test('le osservazioni fitosanitarie sono incrociate solo nella stessa parcella e intervallo',()=>{
  assert.match(js,/normalizeId\(item\.parcelId\)===parcelId/);
  assert.match(js,/Number\(item\.date\.slice\(0,4\)\)>=min/);
  assert.match(js,/non una diagnosi automatica/);
});
test('la sezione è responsiva e conserva i caveat agronomici',()=>{
  assert.match(css,/\.parcel-rotation-context-results/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(js,/non certifica la qualità della rotazione/);
});
