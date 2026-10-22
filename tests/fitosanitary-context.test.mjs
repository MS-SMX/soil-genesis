import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const js = readFileSync(resolve(root, 'assets/js/regeneration-diary.js'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/pages/regeneration-diary.css'), 'utf8');

test('le corrispondenze fitosanitarie distinguono famiglia botanica da nome o slug', () => {
  assert.match(js, /classifyPlantDiseaseMatch/);
  assert.match(js, /corrispondenza per famiglia botanica/);
  assert.match(js, /corrispondenza per nome o identificativo: verificare la specie/);
  assert.match(js, /Compatibilità botanica, non prova che il patogeno sia presente/);
});

test('le piante perenni sono escluse dalle corrispondenze per rotazione fitosanitaria', () => {
  assert.match(js, /plantLife\(plant\) === 'perenne'\) return null/);
  assert.match(js, /return plants\.some\(plant => plantMatchesDiseaseRule\(plant, rule\)\)/);
});

test('gli avvisi contestuali derivano da note esplicite o condizioni strutturate registrate', () => {
  assert.match(js, /const contextualParcelPrompts = \(item, rule\)/);
  assert.match(js, /const note = normalizeFamily\(item\?\.notes \|\| ''\)/);
  assert.match(js, /conditions\.drainage === 'poor'/);
  assert.match(js, /conditions\.irrigation === 'overhead'/);
  assert.match(js, /conditions\.residues === 'suspect-retained'/);
  assert.match(js, /Nota contestuale da verificare/);
  assert.match(js, /non una diagnosi|non prova che il patogeno sia presente/i);
});

test('gli indicatori di corrispondenza hanno stili distinti e leggibili', () => {
  assert.match(css, /regen-pathogen-match--family/);
  assert.match(css, /regen-pathogen-match--name/);
});


test('il piano parcelle offre quattro campi strutturati opzionali e collassati', () => {
  const html = readFileSync(resolve(root, 'piano-parcelle.md'), 'utf8');
  for (const id of ['drainage', 'irrigation', 'residues', 'health']) {
    assert.match(html, new RegExp(`id=\"regen-plan-${id}\"`));
  }
  assert.match(html, /<details class=\"regen-parcel-conditions regen-field-wide\">/);
  assert.match(html, /“Non registrato” significa che l'informazione manca/);
});

test('le condizioni sono conservate nel backup e nel file YAML pubblicabile', () => {
  assert.match(js, /conditions: item\.conditions && typeof item\.conditions === 'object'/);
  assert.match(js, /conditions: readPlanConditions\(\)/);
  assert.match(js, /drainage: \$\{yamlString\(item\.conditions\?\.drainage \|\| 'unknown'\)\}/);
  assert.match(js, /irrigation: \$\{yamlString\(item\.conditions\?\.irrigation \|\| 'unknown'\)\}/);
  assert.match(js, /renderConditionSummary\(item\.conditions\)/);
});
