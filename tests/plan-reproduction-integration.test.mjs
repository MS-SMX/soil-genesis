import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('il piano parcelle carica le evidenze riproduttive senza sovrascrivere i dossier', () => {
  const page = readFileSync(resolve(root, 'diario-rigenerazione.md'), 'utf8');
  assert.equal((page.match(/data-reproduction="\{\{ plant\.fonti_riproduzione \| jsonify \| escape \}\}"/g) || []).length, 2);
  assert.match(page, /regen-plan-reproduction-preview/);
  assert.match(page, /Le lacune non vengono interpretate come assenza di rischio/);
});

test('il diario mostra le quattro aree e conserva fonti nei piani locali e pubblicati', () => {
  const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
  for (const key of ['impollinazione', 'isolamento', 'maturita_seme', 'popolazione']) assert.ok(js.includes(`'${key}'`), `manca area ${key}`);
  assert.match(js, /renderPlantReproduction\(item\.plants\)/);
  assert.match(js, /plant\.reproduction && Object\.keys\(plant\.reproduction\)\.length/);
  assert.match(js, /scientific_name: \$\{yamlString\(plant\.scientificName/);
  assert.match(js, /target="_blank" rel="noopener noreferrer"/);
});

test('le fonti mostrate vengono escapate e i link accettano solo HTTP(S)', () => {
  const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
  assert.ok(js.includes('https?:'), 'il filtro URL deve limitarsi ai protocolli HTTP(S)');
  assert.match(js, /escapeHTML\(evidence\.valore\)/);
  assert.match(js, /escapeHTML\(evidence\.note\)/);
});
