import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=readFileSync(resolve(root,'assets/js/parcel-history.js'),'utf8');
const html=readFileSync(resolve(root,'storico-parcelle.md'),'utf8');
const docs=readFileSync(resolve(root,'docs/STORICO-AGRONOMICO-UNIFICATO-0.28.0.md'),'utf8');
test('lo storico include osservazioni pubblicate e locali',()=>{
  assert.match(html,/id="parcel-history-published-conditions"/);
  assert.match(js,/CONDITION_KEY = 'soil-genesis:parcel-condition-observations:v1'/);
  assert.match(js,/publishedConditions/);
  assert.match(js,/localConditions/);
});
test('le osservazioni duplicate vengono unite tramite ID',()=>{
  assert.match(js,/conditionMap\.get\(String\(item\.id\)\)/);
  assert.match(js,/source:'both'/);
});
test('i passaggi tra stagioni sono derivati solo da piani registrati',()=>{
  assert.match(js,/Produce descriptive season-to-season transitions only when both seasons are explicitly recorded/);
  assert.match(js,/TRANSIZIONE TRA STAGIONI/);
  assert.match(js,/non è una valutazione automatica della qualità della rotazione/i);
});
test('la cronologia distingue osservazioni e transizioni da diagnosi e causalità',()=>{
  assert.match(js,/non diagnosi né prova di causalità/);
  assert.match(js,/non certifica una rotazione agronomicamente adeguata/);
  assert.match(docs,/non costituisce una diagnosi fitosanitaria/);
});
