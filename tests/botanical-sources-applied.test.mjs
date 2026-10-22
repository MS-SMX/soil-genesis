import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const seeds=resolve(root,'_seeds');
const records=readdirSync(seeds).filter(name=>name.endsWith('.md')).map(name=>({name,text:readFileSync(resolve(seeds,name),'utf8')}));
const sourced=records.filter(({text})=>/^fonti_botaniche:/m.test(text));
test('le fonti sono applicate a dossier reali con taxa botanici documentati',()=>{
  assert.equal(sourced.length,59);
  const taxa=new Set(sourced.map(({text})=>text.match(/^nome_scientifico:\s*(.+)$/m)?.[1]?.trim()));
  assert.equal(taxa.size,45); // etichette scientifiche, incluse varianti e sinonimi documentati.
  for (const taxon of ['Cicer arietinum','Solanum lycopersicum','Ocimum basilicum','Capsicum annuum','Vigna unguiculata','Cucumis sativus','Cucurbita pepo','Daucus carota','Brassica rapa sp. sylvestris var. esculenta','Beta vulgaris conditiva','Beta vulgaris (var.cicla)','Beta vulgaris','Allium cepa','Citrullus lanatus','Apium graveolens','Raphanus sativus','Foeniculum vulgare','Anethum graveolens','Petroselinum crispum','Coriandrum sativum','Allium porrum','Brassica oleracea','Brassica oleracea su. gongylodes','Cucumis melo','Lactuca sativa','Eruca sativa','Cucurbita moschata','Pisum sativum','Allium fistulosum','Physalis peruviana','Arachis hypogaea','Asparagus officinalis','Agastache rugosa','Cucumis metuliferus','Spinacia oleracea','Physalis ixocarpa','Acmella oleracea','Calendula officinalis','Cynara cardunculus subsp. scolymus','Cosmos sulphureus','Fagopyrum esculentum','Abelmoschus esculentus','Trichosanthes cucumerina','Helianthus annuus','Tagetes erecta']) assert.ok(taxa.has(taxon),`manca ${taxon}`);
  for (const taxon of ['Cucumis sativus','Cucurbita pepo','Daucus carota','Brassica rapa sp. sylvestris var. esculenta','Beta vulgaris conditiva','Beta vulgaris (var.cicla)','Beta vulgaris','Allium cepa','Citrullus lanatus','Apium graveolens','Raphanus sativus','Foeniculum vulgare','Anethum graveolens','Petroselinum crispum','Coriandrum sativum','Allium porrum','Brassica oleracea','Brassica oleracea su. gongylodes','Cucumis melo','Lactuca sativa','Eruca sativa','Cucurbita moschata','Pisum sativum']) assert.ok(taxa.has(taxon),`manca ${taxon}`);
});
test('ogni dossier documentato contiene valore, fonte, URL e data per entrambi i campi',()=>{
  for (const {name,text} of sourced) {
    const frontMatter=text.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(frontMatter,`${name}: front matter non trovato`);
    const fm=frontMatter[1];
    assert.match(fm,/fonti_botaniche:\n\s+famiglia:\n\s+valore:/,`${name}: valore famiglia assente`);
    assert.match(fm,/famiglia:[\s\S]*?fonte: "[^"\n]+"[\s\S]*?url: "https:\/\//,`${name}: fonte famiglia incompleta`);
    assert.match(fm,/famiglia:[\s\S]*?data_verifica: "2026-10-22"/,`${name}: data famiglia assente`);
    assert.match(fm,/ciclo_vita:[\s\S]*?valore: "[^"\n]+"[\s\S]*?fonte: "[^"\n]+"[\s\S]*?url: "https:\/\//,`${name}: fonte ciclo incompleta`);
    assert.match(fm,/ciclo_vita:[\s\S]*?data_verifica: "2026-10-22"/,`${name}: data ciclo assente`);
  }
});
test('la documentazione distingue tassonomia e ciclo colturale',()=>{
  const oldDoc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.32.0.md'),'utf8');
  const doc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.33.0.md'),'utf8');
  const nextDoc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.34.0.md'),'utf8');
  assert.match(oldDoc,/University of Maryland Extension/);
  assert.match(oldDoc,/può persistere come pianta perenne/);
  assert.match(doc,/Apiaceae/);
  assert.match(doc,/Amaryllidaceae/);
  assert.match(doc,/nessuna fonte è stata copiata su taxa diversi/i);
  assert.match(nextDoc,/annuale o biennale/);
  assert.match(nextDoc,/perenne/);
  const extendedDoc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.35.0.md'),'utf8');
  assert.match(extendedDoc,/Pisum sativum/);
  assert.match(extendedDoc,/Lathyrus oleraceus/);
  assert.match(extendedDoc,/semiperenne/);
  const latestDoc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.36.0.md'),'utf8');
  assert.match(latestDoc,/Cucumis metuliferus/);
  assert.match(latestDoc,/Allium fistulosum/);
  assert.match(latestDoc,/41 a 49/);
  const newestDoc=readFileSync(resolve(root,'docs/REGISTRO-FONTI-BOTANICHE-0.37.0.md'),'utf8');
  assert.match(newestDoc,/49 a 59/);
  assert.match(newestDoc,/Heliantus annuus/);
  assert.match(newestDoc,/Cynara cardunculus subsp. scolymus/);
  assert.match(newestDoc,/annuale o subarbusto/);
});
test('il registro riconosce due sinonimi familiari senza nascondere differenze tassonomiche reali',()=>{
  const page=readFileSync(resolve(root,'registro-fonti-botaniche.md'),'utf8');
  assert.match(page,/family_value_normalized == "umbrelliferae"/);
  assert.match(page,/family_value_normalized = "apiaceae"/);
  assert.match(page,/family_value_normalized == "alliaceae"/);
  assert.match(page,/family_value_normalized = "amaryllidaceae"/);
});
