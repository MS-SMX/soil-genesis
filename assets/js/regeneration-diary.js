(() => {
  'use strict';

  const root = document.getElementById('regen-diary');
  if (!root) return;

  const STORAGE_KEY = 'soil-genesis:regeneration-diary:v1';
  const PLAN_STORAGE_KEY = 'soil-genesis:plot-plantings:v1';
  const CONDITION_HISTORY_KEY = 'soil-genesis:parcel-condition-observations:v1';
  const form = document.getElementById('regen-form');
  const dateInput = document.getElementById('regen-date');
  const categoryInput = document.getElementById('regen-category');
  const seedInput = document.getElementById('regen-seed');
  const parcelInput = document.getElementById('regen-parcel');
  const parcelFilter = document.getElementById('regen-filter-parcel');
  const planForm = document.getElementById('regen-plan-form');
  const planSeasonInput = document.getElementById('regen-plan-season');
  const planParcelInput = document.getElementById('regen-plan-parcel');
  const planPlantSearch = document.getElementById('regen-plan-plant-search');
  const planPlantOptions = document.getElementById('regen-plan-plant-options');
  const selectedPlanPlants = () => Array.from(document.querySelectorAll('.regen-plan-plant:checked')).map(input => {
    let reproduction = {};
    try { reproduction = JSON.parse(input.dataset.reproduction || '{}') || {}; } catch (_) { reproduction = {}; }
    return { type: input.dataset.plantType, slug: input.dataset.plantSlug, label: input.dataset.plantLabel, scientificName: input.dataset.plantScientific || '', family: input.dataset.plantFamily || '', life: input.dataset.plantLife || 'non specificato', reproduction };
  });
  const planNotesInput = document.getElementById('regen-plan-notes');
  const reproductionPreview = document.getElementById('regen-plan-reproduction-preview');
  const observationForm = document.getElementById('regen-observation-form');
  const observationDateInput = document.getElementById('regen-observation-date');
  const observationParcelInput = document.getElementById('regen-observation-parcel');
  const observationNotesInput = document.getElementById('regen-observation-notes');
  const observationFeedback = document.getElementById('regen-observation-feedback');
  const observationList = document.getElementById('regen-observation-list');
  const conditionTrends = document.getElementById('regen-condition-trends');
  const observationConditionInputs = {
    drainage: document.getElementById('regen-observation-drainage'),
    irrigation: document.getElementById('regen-observation-irrigation'),
    residues: document.getElementById('regen-observation-residues'),
    health: document.getElementById('regen-observation-health')
  };
  const readObservationConditions = () => Object.fromEntries(Object.entries(observationConditionInputs).filter(([, input]) => input && input.value && input.value !== 'unknown').map(([key, input]) => [key, input.value]));
  const planConditionInputs = {
    drainage: document.getElementById('regen-plan-drainage'),
    irrigation: document.getElementById('regen-plan-irrigation'),
    residues: document.getElementById('regen-plan-residues'),
    health: document.getElementById('regen-plan-health')
  };
  const readPlanConditions = () => Object.fromEntries(Object.entries(planConditionInputs).map(([key, input]) => [key, input?.value || 'unknown']));
  const conditionLabels = {
    drainage: { unknown: 'Non registrato', good: 'Drenaggio adeguato / senza ristagni osservati', poor: 'Drenaggio scarso / ristagni osservati', variable: 'Drenaggio variabile o da verificare' },
    irrigation: { unknown: 'Non registrata', ground: 'Irrigazione al suolo / localizzata', overhead: 'Irrigazione soprachioma / a pioggia', mixed: 'Irrigazione mista' },
    residues: { unknown: 'Non registrati', removed: 'Residui rimossi / gestiti', 'healthy-retained': 'Residui sani lasciati in superficie', 'suspect-retained': 'Residui sospetti o infetti presenti', composted: 'Residui destinati al compost' },
    health: { unknown: 'Non valutato / non registrato', 'none-observed': 'Nessun sintomo osservato (non equivale ad assenza)', symptoms: 'Sintomi osservati, causa ignota', suspected: 'Problema sospetto, da verificare', confirmed: 'Problema confermato da fonte competente' }
  };
  const renderConditionSummary = conditions => {
    const entries = Object.entries(conditionLabels).filter(([key]) => conditions && conditions[key] && conditions[key] !== 'unknown').map(([key, values]) => values[conditions[key]] ? `<li><strong>${escapeHTML(({drainage:'Drenaggio',irrigation:'Irrigazione',residues:'Residui',health:'Stato fitosanitario'})[key])}:</strong> ${escapeHTML(values[conditions[key]])}</li>` : '');
    return entries.length ? `<details class="regen-condition-summary"><summary>Condizioni registrate <span>${entries.length}</span></summary><ul>${entries.join('')}</ul><p class="regen-backup-help">Dati osservativi inseriti dall'utente, non una diagnosi né una valutazione automatica del rischio.</p></details>` : '';
  };
  const planFeedback = document.getElementById('regen-plan-feedback');
  const planViewSeason = document.getElementById('regen-plan-view-season');
  const planSearch = document.getElementById('regen-plan-search');
  const planList = document.getElementById('regen-plan-list');
  const rotationList = document.getElementById('regen-rotation-list');
  const notesInput = document.getElementById('regen-notes');
  const searchInput = document.getElementById('regen-search');
  const categoryFilter = document.getElementById('regen-filter-category');
  const seedFilter = document.getElementById('regen-filter-seed');
  const eventsContainer = document.getElementById('regen-events');
  const emptyState = document.getElementById('regen-empty');
  const count = document.getElementById('regen-count');
  const feedback = document.getElementById('regen-form-feedback');
  const resetButton = document.getElementById('regen-reset-filters');
  const exportButton = document.getElementById('regen-export');
  const publishExportButton = document.getElementById('regen-publish-export');
  const importTrigger = document.getElementById('regen-import-trigger');
  const importFile = document.getElementById('regen-import-file');
  const backupFeedback = document.getElementById('regen-backup-feedback');

  const todayLocal = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const currentYear = Number(todayLocal().slice(0, 4));
  const parcelGroups = [
    { label: 'Esagono 1 · settori concentrici', prefix: 'hex1', items: Array.from({length:7}, (_, ring) => Array.from({length:6}, (_, sector) => ({id:`hex1-${String.fromCharCode(65+ring)}${sector+1}`, label:`Esagono 1 · ${String.fromCharCode(65+ring)}${sector+1}`}))).flat() },
    { label: 'Esagono 1 · porte rampicanti', prefix: 'hex1-gate', items: Array.from({length:6}, (_, i) => ({id:`hex1-gate-${i+1}`,label:`Esagono 1 · Porta rampicante ${i+1}`})) },
    { label: 'Esagono 2 · settori concentrici', prefix: 'hex2', items: Array.from({length:7}, (_, ring) => Array.from({length:6}, (_, sector) => ({id:`hex2-${String.fromCharCode(65+ring)}${sector+1}`, label:`Esagono 2 · ${String.fromCharCode(65+ring)}${sector+1}`}))).flat() },
    { label: 'Esagono 2 · porte rampicanti', prefix: 'hex2-gate', items: Array.from({length:6}, (_, i) => ({id:`hex2-gate-${i+1}`,label:`Esagono 2 · Porta rampicante ${i+1}`})) },
    { label: 'Mezzo esagono 1 · file intere', items: Array.from({length:4}, (_, row) => ({id:`half1-row${row+1}`, label:`Mezzo esagono 1 · Fila ${row+1}`})) },
    { label: 'Mezzo esagono 2', items: Array.from({length:5}, (_, row) => ['A','B'].map(side => ({id:`half2-row${row+1}-${side.toLowerCase()}`, label:`Mezzo esagono 2 · Fila ${row+1} · metà ${side}`}))).flat() },
    { label: 'Quadrato centrale', items: [{id:'central-left',label:'Quadrato centrale · Settore sinistro'},{id:'central-right',label:'Quadrato centrale · Settore destro'},{id:'central-vine-tunnel',label:'Quadrato centrale · Tunnel delle Liane'}] },
    { label: 'Filare classico', items: [{id:'classic-row',label:'Filare classico'}] }
  ];
  const parcels = parcelGroups.flatMap(group => group.items);
  const normalizeParcelId = id => { const match = String(id || '').match(/^half1-row([1-4])-[ab]$/); return match ? `half1-row${match[1]}` : String(id || ''); };
  const parcelLabel = id => parcels.find(parcel => parcel.id === normalizeParcelId(id))?.label || '';
  const migrateLegacyParcelData = () => {
    events = events.map(item => { const parcelId = normalizeParcelId(item.parcelId); return parcelId === item.parcelId ? item : { ...item, parcelId, parcelLabel: parcelLabel(parcelId) }; });
    const migrated = new Map();
    plantings.forEach(item => { const parcelId = normalizeParcelId(item.parcelId); const record = { ...item, parcelId }; const key = `${record.season}:${parcelId}`; if (!migrated.has(key)) migrated.set(key, record); else { const target = migrated.get(key); target.plants = Array.from(new Map([...(target.plants || []), ...(record.plants || [])].map(plant => [`${plant.type}:${plant.slug}`, plant])).values()); target.crop = Array.from(new Set([target.crop, record.crop].filter(Boolean))).join(' + '); target.notes = Array.from(new Set([target.notes, record.notes].filter(Boolean))).join('\n'); target.conditions = Object.fromEntries(['drainage','irrigation','residues','health'].map(key => [key, (record.conditions && record.conditions[key] && record.conditions[key] !== 'unknown') ? record.conditions[key] : (target.conditions?.[key] || 'unknown')])); } });
    plantings = Array.from(migrated.values());
  };
  const populateParcelSelect = (select, includeEmpty, emptyLabel) => {
    select.innerHTML = '';
    if (includeEmpty) {
      const empty = document.createElement('option'); empty.value = ''; empty.textContent = emptyLabel; select.appendChild(empty);
    }
    parcelGroups.forEach(group => {
      const optgroup = document.createElement('optgroup'); optgroup.label = group.label;
      group.items.forEach(parcel => { const option = document.createElement('option'); option.value = parcel.id; option.textContent = parcel.label; optgroup.appendChild(option); });
      select.appendChild(optgroup);
    });
  };
  populateParcelSelect(parcelInput, true, 'Nessuna parcella specifica');
  populateParcelSelect(parcelFilter, true, 'Tutte le parcelle');
  populateParcelSelect(planParcelInput, true, 'Seleziona una parcella');
  planSeasonInput.value = String(currentYear);
  planViewSeason.value = String(currentYear);
  dateInput.value = todayLocal();

  const readEvents = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
    } catch (error) {
      return [];
    }
  };

  const readPlantings = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.parcelId && item.crop && Number.isFinite(Number(item.season))) : [];
    } catch (error) { return []; }
  };

  let events = readEvents();
  let plantings = readPlantings();
  const readConditionObservations = () => { try { const parsed = JSON.parse(localStorage.getItem(CONDITION_HISTORY_KEY) || '[]'); return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.id && item.parcelId && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) : []; } catch (_) { return []; } };
  let conditionObservations = readConditionObservations();
  const readPublishedConditionObservations = () => {
    const source = document.getElementById('regen-published-condition-observations');
    if (!source) return [];
    try {
      const parsed = JSON.parse(source.textContent || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && item.id && (item.parcel_id || item.parcelId) && item.date).map(item => ({ id: String(item.id), parcelId: normalizeParcelId(item.parcel_id || item.parcelId), date: String(item.date), conditions: item.conditions && typeof item.conditions === 'object' ? item.conditions : {}, notes: typeof item.notes === 'string' ? item.notes : '', published: true })) : [];
    } catch (_) { return []; }
  };
  const publishedConditionObservations = readPublishedConditionObservations();
  if (observationDateInput) observationDateInput.value = todayLocal();
  populateParcelSelect(observationParcelInput, true, 'Seleziona una parcella');
  const readPublishedPlantings = () => {
    const source = document.getElementById('regen-published-plantings');
    if (!source) return [];
    try { const parsed = JSON.parse(source.textContent || '[]'); return Array.isArray(parsed) ? parsed : []; }
    catch (_) { return []; }
  };
  const publishedPlantings = readPublishedPlantings();
  const readPublishedEvents = () => {
    const source = document.getElementById('regen-published-events');
    if (!source) return [];
    try {
      const parsed = JSON.parse(source.textContent || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  };
  const publishedEvents = readPublishedEvents();
  migrateLegacyParcelData();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); localStorage.setItem(CONDITION_HISTORY_KEY, JSON.stringify(conditionObservations)); } catch (_) {}
  const familyByRef = new Map(Array.from(document.querySelectorAll('.regen-plan-plant')).map(input => [`${input.dataset.plantType}:${input.dataset.plantSlug}`, input.dataset.plantFamily || '']));
  const lifeByRef = new Map(Array.from(document.querySelectorAll('.regen-plan-plant')).map(input => [`${input.dataset.plantType}:${input.dataset.plantSlug}`, input.dataset.plantLife || 'non specificato']));
  const plantFamily = plant => String(plant?.family || familyByRef.get(`${plant?.type}:${plant?.slug}`) || '').trim();
  const plantLife = plant => {
    const value = String(plant?.life || lifeByRef.get(`${plant?.type}:${plant?.slug}`) || '').trim().toLocaleLowerCase('it');
    if (String(plant?.type || '').toLocaleLowerCase('it') === 'perennial' || /perenn/.test(value)) return 'perenne';
    if (/bienn/.test(value) || /biennal/.test(value)) return 'biennale';
    if (/annual|annuale|annua/.test(value)) return 'annuale';
    return value || 'non specificato';
  };
  const familiesForPlanting = (item, options = {}) => {
    const refs = Array.isArray(item.plants) ? item.plants : [];
    const eligible = options.excludePerennials ? refs.filter(plant => plantLife(plant) !== 'perenne') : refs;
    const families = eligible.map(plantFamily).filter(Boolean);
    if (!refs.length && item.family) families.push(String(item.family));
    return Array.from(new Set(families.map(value => value.trim()).filter(Boolean)));
  };
  const persistentPlantsForPlanting = item => (Array.isArray(item.plants) ? item.plants : []).filter(plant => plantLife(plant) === 'perenne');
  const unknownLifePlantsForPlanting = item => (Array.isArray(item.plants) ? item.plants : []).filter(plant => plantLife(plant) === 'non specificato');
  const normalizeFamily = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('it');

  // Disease-specific rules are deliberately conditional: they activate only when a disease
  // name was explicitly recorded for the same parcel. They are not disease diagnoses.
  const diseaseRotationRules = [
    {
      id: 'phytophthora-capsici',
      names: ['phytophthora capsici', 'fitoftora capsici'],
      label: 'Phytophthora capsici',
      hosts: ['cucurbitaceae'],
      hostTerms: ['pomodoro', 'tomato', 'melanzana', 'eggplant', 'peperone', 'pepper', 'capsicum'],
      beanHost: true,
      minGap: 3,
      recommendation: 'La fonte di extension raccomanda di escludere per almeno tre anni le colture ospiti indicate. La fonte include cucurbitacee, solanacee e fagioli; la rotazione da sola può non bastare perché il patogeno persiste nel suolo e si diffonde con l’acqua.',
      source: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/phytophthora',
      sourceLabel: 'University of Minnesota Extension, gestione di Phytophthora'
    },
    {
      id: 'fusarium-wilt-tomato',
      names: ['fusarium oxysporum', 'fusarium', 'fusariosi vascolare'],
      label: 'Fusarium (diagnosi da confermare)',
      hosts: [],
      hostTerms: ['pomodoro', 'tomato', 'melanzana', 'eggplant', 'peperone', 'pepper', 'capsicum'],
      minGap: 5,
      recommendation: 'La fonte indica 3–5 anni o più lontano da colture suscettibili, insieme al controllo delle solanacee infestanti e delle piante spontanee ospiti. Le specie e le razze di Fusarium differiscono: non interpretare questa nota come conferma della diagnosi o come garanzia che la rotazione risolva il problema.',
      source: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/fusarium-wilt',
      sourceLabel: 'University of Minnesota Extension, Fusarium wilt'
    },
    {
      id: 'early-blight',
      names: ['alternaria solani', 'early blight', 'alternariosi precoce'],
      label: 'Alternaria solani / early blight',
      hosts: [],
      hostTerms: ['pomodoro', 'tomato', 'patata', 'potato', 'peperone', 'pepper', 'capsicum'],
      minGap: 2,
      recommendation: 'La fonte raccomanda di ruotare lontano da pomodoro e colture affini per almeno due anni. La regola riguarda la malattia documentata, non tutte le solanacee in ogni situazione.',
      source: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/early-blight-in-tomato-and-potato',
      sourceLabel: 'University of Minnesota Extension, early blight in tomato and potato'
    },
    {
      id: 'cucurbit-gummy-stem-blight',
      names: ['gummy stem blight', 'didymella bryoniae', 'black rot delle cucurbitacee'],
      label: 'Gummy stem blight / black rot delle cucurbitacee',
      hosts: ['cucurbitaceae'],
      minGap: 2,
      recommendation: 'La fonte raccomanda che passino almeno due anni prima di coltivare di nuovo cucurbitacee nella stessa parcella. La gestione dei residui infetti e l’uso di seme sano restano importanti.',
      source: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/gummy-stem-blight-and-black-rot',
      sourceLabel: 'University of Minnesota Extension, gummy stem blight and black rot'
    },
    {
      id: 'cucurbit-angular-leaf-spot',
      names: ['angular leaf spot', 'maculatura angolare delle cucurbitacee'],
      label: 'Maculatura angolare delle cucurbitacee',
      hosts: ['cucurbitaceae'],
      minGap: 2,
      recommendation: 'La fonte raccomanda almeno due anni prima di riportare cucurbitacee nella stessa parcella. Il patogeno può sopravvivere nei residui e arrivare anche tramite seme: la rotazione non è l’unica misura.',
      source: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/angular-leaf-spot',
      sourceLabel: 'University of Minnesota Extension, angular leaf spot'
    },
    {
      id: 'clubroot-brassicas',
      names: ['clubroot', 'ernia del cavolo', 'plasmophora brassicae', 'plasmodiophora brassicae'],
      label: 'Ernia del cavolo / clubroot',
      hosts: ['brassicaceae'],
      hostTerms: ['cavolo', 'cavoli', 'broccolo', 'broccoli', 'cavolfiore', 'verza', 'rucola', 'ravanello', 'rapa', 'senape', 'kale', 'brassica'],
      minGap: 7,
      recommendation: 'Le fonti universitarie raccomandano una pausa di circa 5–7 anni o almeno 7 anni quando il clubroot è confermato, insieme al controllo delle infestanti ospiti e alla prevenzione del movimento di suolo contaminato. Il patogeno può persistere a lungo: l’intervallo non garantisce eradicazione.',
      source: 'https://ipm.cahnr.uconn.edu/clubroot-of-crucifers/',
      sourceLabel: 'University of Connecticut IPM, clubroot of crucifers'
    },
    {
      id: 'white-rot-alliums',
      names: ['white rot onion', 'white rot garlic', 'marciume bianco degli allium', 'marciume bianco di aglio', 'sclerotium cepivorum', 'stromatinia cepivora'],
      label: 'Marciume bianco degli Allium',
      hosts: ['alliaceae', 'amaryllidaceae'],
      hostTerms: ['aglio', 'cipolla', 'cipollotto', 'porro', 'scalogno', 'erba cipollina', 'allium'],
      minGap: 10,
      alwaysWarn: true,
      recommendation: 'La guida WSU indica di non coltivare cipolle e specie affini nei suoli infestati più spesso di una volta ogni 8–10 anni; altre fonti segnalano sclerozi capaci di sopravvivere per decenni e sottolineano che la rotazione da sola è limitata. Questo avviso resta attivo anche oltre dieci anni: verifica la diagnosi, evita di spostare suolo e materiale infetto e chiedi indicazioni fitosanitarie locali.',
      source: 'https://hortsense.cahnrs.wsu.edu/fact-sheet/onions-garlic-white-rot/',
      sourceLabel: 'Washington State University Hortsense, white rot of onions and garlic'
    }
  ];
  // Consultable agronomic profiles. These explain the biology behind the rules above;
  // they are guidance summaries, not diagnostic criteria or universal prescriptions.
  const pathogenProfiles = [
    {
      id: 'phytophthora-capsici', title: 'Phytophthora capsici', kind: 'Oomicete (non è un fungo vero e proprio)',
      persistence: 'Sopravvive nel suolo e nei residui vegetali. La durata dipende anche dai tipi riproduttivi presenti: alcune strutture di resistenza possono durare almeno cinque anni.',
      spread: 'Acqua di ruscellamento o irrigazione, suolo aderente ad attrezzi e ruote, schizzi di pioggia e materiale vegetale infetto.',
      predisposition: 'Suolo saturo o poco drenante, ristagni e temperature calde. I focolai possono comparire nelle depressioni del terreno e seguire il deflusso dell’acqua.',
      rotation: 'La fonte UMN indica almeno tre anni fuori da cucurbitacee e solanacee. È un intervallo di riduzione del rischio, non una garanzia di eradicazione.',
      management: ['Migliorare il drenaggio e valutare aiuole rialzate.', 'Evitare di lavorare il terreno quando è bagnato e di trasferire terra tra parcelle.', 'Preferire, quando possibile, fonti d’acqua non contaminate da acque superficiali.', 'Rimuovere e gestire separatamente le piante infette; pulire gli attrezzi dopo l’uso.'],
      sources: [{ label: 'University of Minnesota Extension, Managing phytophthora on farms', url: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/phytophthora' }]
    },
    {
      id: 'fusarium-wilt-tomato', title: 'Fusarium wilt (profilo riferito al pomodoro; diagnosi da confermare)', kind: 'Complesso fungino: specie e forme speciali possono avere ospiti diversi',
      persistence: 'Il patogeno del wilt del pomodoro può sopravvivere per molti anni nel suolo come clamidospore e associato a residui o piante ospiti senza sintomi.',
      spread: 'Trapianti infetti, seme in alcuni casi, suolo contaminato su attrezzi e macchinari. Alcune infestanti possono mantenere il patogeno.',
      predisposition: 'Temperature del suolo elevate, suoli acidi e ferite radicali; nematodi e lavorazioni che danneggiano le radici possono aggravare il rischio. Fusarium e Verticillium possono dare sintomi simili.',
      rotation: 'La fonte UMN indica 3–5 anni o più lontano dalle colture suscettibili per ridurre la pressione. Le razze differiscono e una rotazione non elimina necessariamente l’inoculo.',
      management: ['Confermare la diagnosi con un servizio fitopatologico prima di prendere decisioni pluriennali.', 'Usare varietà resistenti alla razza presente, quando nota.', 'Acquistare trapianti sani e pulire terra e residui da attrezzi e calzature.', 'Rimuovere le piante infette e controllare le infestanti ospiti durante la rotazione.'],
      sources: [{ label: 'University of Minnesota Extension, Fusarium wilt', url: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/fusarium-wilt' }, { label: 'UC IPM, Fusarium wilt del pomodoro', url: 'https://ipm.ucanr.edu/agriculture/tomato/fusarium-wilt/' }]
    },
    {
      id: 'early-blight', title: 'Alternaria / early blight', kind: 'Malattia fungina (Alternaria solani e specie affini)',
      persistence: 'Può superare l’inverno nei residui infetti e nel suolo; può inoltre essere introdotta con seme o trapianti.',
      spread: 'Le spore raggiungono il fogliame dagli inoculi presenti nei residui e nel suolo; pioggia, schizzi e foglie bagnate favoriscono la diffusione.',
      predisposition: 'Tempo umido, rugiada persistente e chioma poco arieggiata; i sintomi spesso iniziano sulle foglie più basse.',
      rotation: 'La fonte UMN raccomanda almeno due anni lontano da pomodoro e colture affini indicate. La regola non va estesa automaticamente a ogni malattia delle Solanaceae.',
      management: ['Usare varietà tolleranti o resistenti quando disponibili.', 'Pacciamare il terreno e irrigare alla base per ridurre gli schizzi.', 'Migliorare aerazione e distanza tra piante; evitare di lavorare sulle foglie bagnate.', 'Rimuovere residui e foglie colpite; pulire gli strumenti di potatura.'],
      sources: [{ label: 'University of Minnesota Extension, Early blight in tomato and potato', url: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/early-blight-in-tomato-and-potato' }]
    },
    {
      id: 'cucurbit-gummy-stem-blight', title: 'Gummy stem blight / black rot delle cucurbitacee', kind: 'Malattia fungina (Didymella bryoniae)',
      persistence: 'Il fungo può sopravvivere nei residui di cucurbitacee e arrivare tramite seme; piante spontanee e volontarie possono mantenere l’inoculo.',
      spread: 'Seme e trapianti, spore trasportate dal vento e schizzi d’acqua a breve distanza.',
      predisposition: 'Umidità elevata, bagnatura fogliare prolungata, pioggia o irrigazione soprachioma.',
      rotation: 'Le fonti universitarie indicano generalmente almeno due anni, spesso 2–3, senza cucurbitacee. Il risultato dipende anche da seme, residui e ospiti spontanei.',
      management: ['Partire da seme e trapianti sani.', 'Rimuovere residui infetti e cucurbitacee volontarie.', 'Preferire irrigazione localizzata e favorire l’asciugatura della chioma.', 'Non raccogliere seme da piante o frutti sospetti.'],
      sources: [{ label: 'University of Minnesota Extension, Gummy stem blight and black rot', url: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/gummy-stem-blight-and-black-rot' }, { label: 'University of Florida IFAS, Management of Gummy Stem Blight', url: 'https://ask.ifas.ufl.edu/publication/PP280' }]
    },
    {
      id: 'cucurbit-angular-leaf-spot', title: 'Maculatura angolare delle cucurbitacee', kind: 'Malattia batterica (Pseudomonas syringae pv. lachrymans)',
      persistence: 'Può essere trasmessa dal seme e sopravvivere nei residui vegetali per circa due anni o più, secondo la fonte e le condizioni.',
      spread: 'Schizzi di pioggia o irrigazione, mani e strumenti durante le lavorazioni, insetti e materiale vegetale infetto.',
      predisposition: 'Alta umidità e bagnatura fogliare prolungata; le lesioni possono essere delimitate dalle nervature delle foglie.',
      rotation: 'La fonte UMN indica almeno due anni senza cucurbitacee nella stessa parcella. Il seme infetto può reintrodurre il batterio anche dopo la rotazione.',
      management: ['Usare seme sano e, dove disponibili, cultivar resistenti o tolleranti.', 'Irrigare al suolo e non lavorare sulle piante bagnate.', 'Pulire strumenti e mani tra piante o parcelle.', 'Rimuovere i residui infetti a fine stagione e non conservare seme da piante malate.'],
      sources: [{ label: 'University of Minnesota Extension, Angular leaf spot', url: 'https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/angular-leaf-spot' }, { label: 'University of Wisconsin–Madison, Cucurbit Angular Leaf Spot', url: 'https://vegpath.plantpath.wisc.edu/diseases/cucurbit-angular-leaf-spot/' }]
    },
    {
      id: 'clubroot-brassicas', title: 'Ernia del cavolo / clubroot', kind: 'Patogeno protista del suolo (Plasmodiophora brassicae)',
      persistence: 'Le spore di resistenza possono restare vitali nel suolo per 7–10 anni o più. Una rotazione lunga riduce il rischio, ma non certifica che il terreno sia libero dal patogeno.',
      spread: 'Soprattutto suolo contaminato su scarpe, attrezzi e macchinari, acqua, trapianti infetti e radici infette in decomposizione. Non è considerato normalmente un patogeno trasmesso dal seme.',
      predisposition: 'Terreni umidi e acidi, drenaggio scarso e temperature fresche o moderate; infestanti delle Brassicaceae possono fungere da ospiti.',
      rotation: 'Quando confermato, UConn raccomanda sette anni senza Brassicaceae e controllo delle infestanti ospiti. Evitare anche cover crop brassicacee nella parcella infestata.',
      management: ['Usare trapianti sani prodotti in substrato pulito e non riutilizzare contenitori contaminati.', 'Limitare rigorosamente il movimento di terra e acqua dalla parcella infestata.', 'Migliorare il drenaggio e controllare volontarie e infestanti ospiti.', 'La correzione del pH può essere valutata con analisi del suolo e consulenza locale: non applicare calce alla cieca, perché può influenzare disponibilità di nutrienti e altre colture.'],
      sources: [{ label: 'University of Connecticut IPM, Clubroot of Brassicas', url: 'https://ipm.cahnr.uconn.edu/clubroot-of-crucifers/' }, { label: 'Cornell Vegetables, Clubroot of Crucifers', url: 'https://www.vegetables.cornell.edu/pest-management/disease-factsheets/clubroot-of-crucifers/' }]
    },
    {
      id: 'white-rot-alliums', title: 'Marciume bianco degli Allium', kind: 'Malattia fungina (Stromatinia cepivora; sinonimo storico Sclerotium cepivorum)',
      persistence: 'Gli sclerozi possono sopravvivere nel suolo per 20–40 anni. Per questo il solo intervallo di rotazione non garantisce il controllo.',
      spread: 'Suolo contaminato, materiale di propagazione infetto e trasferimento di terra con attrezzi, calzature o mezzi.',
      predisposition: 'Condizioni fresche e umide favoriscono la malattia; colpisce aglio, cipolla e Allium affini.',
      rotation: 'WSU indica di non coltivare Allium nei suoli infestati più spesso di una volta ogni 8–10 anni. L’avviso resta attivo oltre dieci anni perché la persistenza documentata può essere molto maggiore.',
      management: ['Non spostare terreno dalla parcella infestata a zone sane.', 'Usare bulbi, bulbilli e materiale di propagazione sano.', 'Rimuovere le piante infette e il materiale associato; non compostarlo.', 'Mantenere un drenaggio adeguato e chiedere indicazioni fitosanitarie locali per la gestione di un focolaio confermato.'],
      sources: [{ label: 'Washington State University Hortsense, White rot of onions and garlic', url: 'https://hortsense.cahnrs.wsu.edu/fact-sheet/onions-garlic-white-rot/' }, { label: 'University of Maryland Extension, White Rot of Onion and Garlic', url: 'https://extension.umd.edu/resource/white-rot-onion-and-garlic/' }]
    }
  ];
  const renderPathogenProfiles = () => `
    <details class="regen-pathogen-library">
      <summary id="regen-pathogen-library-title"><span>SCHEDE FITOSANITARIE</span><small>${pathogenProfiles.length} profili · persistenza, diffusione, prevenzione e fonti</small></summary>
      <div class="regen-pathogen-library-body">
      <p class="regen-pathogen-intro">Apri una scheda per consultare persistenza, vie di diffusione, condizioni favorevoli e misure complementari alla rotazione. Le durate sono indicazioni tratte dalle fonti collegate, non garanzie di risanamento.</p>
      <div class="regen-pathogen-cards">${pathogenProfiles.map(profile => `
        <details class="regen-pathogen-card" id="pathogen-${escapeHTML(profile.id)}">
          <summary><span>${escapeHTML(profile.title)}</span><small>${escapeHTML(profile.kind)}</small></summary>
          <div class="regen-pathogen-content">
            <p><strong>Persistenza:</strong> ${escapeHTML(profile.persistence)}</p>
            <p><strong>Diffusione:</strong> ${escapeHTML(profile.spread)}</p>
            <p><strong>Condizioni favorevoli:</strong> ${escapeHTML(profile.predisposition)}</p>
            <p><strong>Rotazione:</strong> ${escapeHTML(profile.rotation)}</p>
            <p><strong>Misure complementari:</strong></p><ul>${profile.management.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
            <p><strong>Fonti:</strong></p><ul class="regen-pathogen-sources">${profile.sources.map(source => `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)}</a></li>`).join('')}</ul>
          </div>
        </details>`).join('')}</div>
      </div>
    </details>`;

  const diseaseRuleById = new Map(diseaseRotationRules.map(rule => [rule.id, rule]));
  // Explicit note terms and structured observations can add contextual prompts.
  // These are management checks, never a risk score or a diagnosis.
  const parcelConditionPrompts = {
    'phytophthora-capsici': [
      { id: 'water', terms: ['ristagno', 'ristagni', 'suolo saturo', 'drenaggio scarso', 'mal drenato', 'acqua ferma'], prompt: 'Hai annotato ristagni o drenaggio scarso: verifica il deflusso e limita il trasferimento di acqua e terra tra parcelle.' },
      { id: 'irrigation', terms: ['irrigazione soprachioma', 'irrigazione a pioggia', 'soprachioma'], prompt: 'Hai annotato irrigazione soprachioma: valuta se l’acqua può diffondere inoculo e se è possibile irrigare al suolo.' }
    ],
    'clubroot-brassicas': [
      { id: 'water', terms: ['ristagno', 'ristagni', 'suolo saturo', 'drenaggio scarso', 'mal drenato'], prompt: 'Hai annotato ristagni o drenaggio scarso: controlla il drenaggio e limita il movimento di terreno dalla parcella.' },
      { id: 'soil-ph', terms: ['suolo acido', 'terreno acido', 'ph basso', 'pH basso'], prompt: 'Hai annotato terreno acido: valuta il pH con un’analisi del suolo prima di decidere eventuali correzioni; non applicare calce alla cieca.' }
    ],
    'early-blight': [
      { id: 'irrigation', terms: ['irrigazione soprachioma', 'irrigazione a pioggia', 'foglie bagnate', 'bagnatura fogliare'], prompt: 'Hai annotato bagnatura fogliare o irrigazione soprachioma: valuta irrigazione al suolo e maggiore aerazione della chioma.' },
      { id: 'residues', terms: ['residui infetti', 'residui malati', 'residui non rimossi'], prompt: 'Hai annotato residui infetti non rimossi: verifica la loro gestione e non conservarli come materiale di propagazione.' }
    ],
    'cucurbit-gummy-stem-blight': [
      { id: 'irrigation', terms: ['irrigazione soprachioma', 'irrigazione a pioggia', 'foglie bagnate', 'bagnatura fogliare'], prompt: 'Hai annotato bagnatura fogliare o irrigazione soprachioma: riduci, se possibile, la durata della bagnatura e favorisci l’asciugatura della chioma.' },
      { id: 'residues', terms: ['residui infetti', 'residui malati', 'residui non rimossi'], prompt: 'Hai annotato residui infetti non rimossi: la gestione dei residui è una misura complementare importante alla rotazione.' }
    ],
    'cucurbit-angular-leaf-spot': [
      { id: 'irrigation', terms: ['irrigazione soprachioma', 'irrigazione a pioggia', 'foglie bagnate', 'bagnatura fogliare'], prompt: 'Hai annotato bagnatura fogliare o irrigazione soprachioma: valuta irrigazione al suolo e limita le lavorazioni sulle piante bagnate.' },
      { id: 'residues', terms: ['residui infetti', 'residui malati', 'residui non rimossi'], prompt: 'Hai annotato residui infetti non rimossi: verifica la gestione dei residui e non conservare seme da piante sospette.' }
    ],
    'white-rot-alliums': [
      { id: 'soil-movement', terms: ['terra contaminata', 'suolo contaminato', 'attrezzi contaminati', 'terreno infestato'], prompt: 'Hai annotato suolo o attrezzi contaminati: evita di trasferire terreno e materiale dalla parcella e pulisci gli strumenti prima di passare ad altre zone.' }
    ],
    'fusarium-wilt-tomato': [
      { id: 'soil-movement', terms: ['terra contaminata', 'suolo contaminato', 'attrezzi contaminati', 'terreno infestato'], prompt: 'Hai annotato suolo o attrezzi contaminati: riduci il trasferimento di terra e residui tra parcelle e verifica la pulizia degli strumenti.' },
      { id: 'residues', terms: ['residui infetti', 'residui malati', 'residui non rimossi'], prompt: 'Hai annotato residui infetti non rimossi: verifica la gestione dei residui e delle eventuali piante ospiti spontanee.' }
    ]
  };
  const contextualParcelPrompts = (item, rule) => {
    const note = normalizeFamily(item?.notes || '');
    const prompts = (parcelConditionPrompts[rule.id] || [])
      .filter(condition => condition.terms.some(term => note.includes(normalizeFamily(term))))
      .map(condition => condition.prompt);
    const conditions = item?.conditions || {};
    if (['phytophthora-capsici', 'clubroot-brassicas'].includes(rule.id) && conditions.drainage === 'poor') {
      prompts.push('La scheda della parcella registra drenaggio scarso o ristagni: verifica il deflusso e limita il movimento di acqua e terreno tra parcelle.');
    }
    if (['early-blight', 'cucurbit-gummy-stem-blight', 'cucurbit-angular-leaf-spot'].includes(rule.id) && conditions.irrigation === 'overhead') {
      prompts.push('La scheda registra irrigazione soprachioma: valuta, dove praticabile, irrigazione al suolo e misure per ridurre la bagnatura fogliare.');
    }
    if (['early-blight', 'cucurbit-gummy-stem-blight', 'cucurbit-angular-leaf-spot', 'fusarium-wilt-tomato'].includes(rule.id) && conditions.residues === 'suspect-retained') {
      prompts.push('La scheda registra residui sospetti o infetti presenti: verifica l’identificazione del problema e la gestione dei residui prima di riutilizzarli o compostarli.');
    }
    if (conditions.health === 'symptoms' || conditions.health === 'suspected') {
      prompts.push('Sono registrati sintomi o un problema sospetto: identifica la causa prima di applicare una regola specifica; la compatibilità botanica non è una diagnosi.');
    }
    return Array.from(new Set(prompts));
  };
  // The matching method is exposed in the UI so users can distinguish a family-level
  // match from a loose text match. Neither method indicates pathogen presence.
  const classifyPlantDiseaseMatch = (plant, rule) => {
    if (!plant || !rule || plantLife(plant) === 'perenne') return null;
    const family = normalizeFamily(plantFamily(plant));
    if (rule.hosts.some(host => family === normalizeFamily(host))) {
      return { level: 'family', label: 'corrispondenza per famiglia botanica' };
    }
    const identity = normalizeFamily(`${plant.label || ''} ${plant.slug || ''} ${plant.scientificName || ''}`);
    if ((rule.hostTerms || []).some(term => identity.includes(normalizeFamily(term)))) {
      return { level: 'name', label: 'corrispondenza per nome o identificativo: verificare la specie' };
    }
    if (rule.beanHost && /fagiol|bean|phaseolus|fagiolino/i.test(identity)) {
      return { level: 'name', label: 'corrispondenza per nome o identificativo: verificare la specie' };
    }
    return null;
  };
  const plantMatchesDiseaseRule = (plant, rule) => Boolean(classifyPlantDiseaseMatch(plant, rule));
  const profileHostMatches = (planting, profile) => {
    const rule = diseaseRuleById.get(profile.id);
    if (!rule) return [];
    const plants = Array.isArray(planting?.plants) && planting.plants.length
      ? planting.plants
      : (planting?.crop ? [{ label: String(planting.crop), slug: String(planting.crop), family: planting.family || '', life: 'non specificato' }] : []);
    return plants.map(plant => ({ plant, match: classifyPlantDiseaseMatch(plant, rule) })).filter(entry => entry.match);
  };
  const renderPlantingProfileLinks = planting => {
    const matches = pathogenProfiles.map(profile => ({ profile, hosts: profileHostMatches(planting, profile) })).filter(match => match.hosts.length);
    if (!matches.length) return '';
    return `<details class="regen-crop-pathogen-links"><summary>Schede fitosanitarie compatibili <span>${matches.length}</span></summary><div class="regen-crop-pathogen-content"><p class="regen-pathogen-match-caveat">Compatibilità botanica, non prova che il patogeno sia presente nella parcella. La corrispondenza per famiglia è più solida di quella basata soltanto su nome o slug; entrambe vanno verificate.</p><ul>${matches.map(({ profile, hosts }) => `<li><a href="#pathogen-${escapeHTML(profile.id)}" data-open-pathogen="${escapeHTML(profile.id)}">${escapeHTML(profile.title)}</a>${hosts.map(({ plant, match }) => `<span class="regen-pathogen-match regen-pathogen-match--${match.level}"> · ${escapeHTML(plant.label || plant.slug || planting.crop || 'coltura non specificata')}: ${escapeHTML(match.label)}</span>`).join('')}<small>Prevenzione: ${escapeHTML(profile.management[0])}</small></li>`).join('')}</ul></div></details>`;
  };

  const plantingText = item => [item?.crop, item?.notes, ...(Array.isArray(item?.plants) ? item.plants.map(plant => `${plant.label || ''} ${plant.slug || ''}`) : [])].filter(Boolean).join(' ');
  const isBeanPlant = plant => /fagiol|bean|phaseolus|fagiolino/i.test(`${plant?.label || ''} ${plant?.slug || ''}`);
  const diseaseMentions = item => {
    const text = normalizeFamily(plantingText(item));
    return diseaseRotationRules.filter(rule => rule.names.some(name => text.includes(normalizeFamily(name))));
  };
  const familyMatches = (planting, family) => familiesForPlanting(planting, { excludePerennials: true }).some(value => normalizeFamily(value) === normalizeFamily(family));
  const hostsDisease = (planting, rule) => {
    const plants = Array.isArray(planting?.plants) && planting.plants.length
      ? planting.plants
      : (planting?.crop ? [{ label: String(planting.crop), slug: String(planting.crop), family: planting.family || '', life: 'non specificato' }] : []);
    return plants.some(plant => plantMatchesDiseaseRule(plant, rule));
  };
  const diseaseEvidenceForParcel = (parcelId, beforeSeason, history) => {
    const records = [
      ...history.filter(item => item.parcelId === parcelId && item.season <= beforeSeason).map(item => ({ item, year: Number(item.season), source: 'piano parcelle' })),
      ...[...publishedEvents, ...events].filter(item => normalizeParcelId(item.parcelId || item.parcel_id || '') === parcelId && item.date && Number(String(item.date).slice(0, 4)) <= beforeSeason).map(item => ({ item: { ...item, parcelId: normalizeParcelId(item.parcelId || item.parcel_id || ''), notes: item.notes || item.content || '' }, year: Number(String(item.date).slice(0, 4)), source: 'registro eventi' }))
    ];
    return records.flatMap(record => diseaseMentions(record.item).map(rule => ({ rule, year: record.year, source: record.source })));
  };

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (error) {
      feedback.textContent = 'Salvataggio non riuscito: memoria locale non disponibile.';
      return false;
    }
  };

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const reproductionAreas = [
    ['impollinazione', 'Impollinazione'],
    ['isolamento', 'Isolamento / rischio d’incrocio'],
    ['maturita_seme', 'Maturità e raccolta'],
    ['popolazione', 'Dimensione della popolazione']
  ];
  const reproductionValueMarkup = (area, evidence) => {
    if (!evidence || typeof evidence !== 'object' || !evidence.valore) return `<li><strong>${escapeHTML(area)}:</strong> non documentato</li>`;
    const url = /^https?:\/\//i.test(String(evidence.url || '')) ? String(evidence.url) : '';
    const source = evidence.fonte ? escapeHTML(evidence.fonte) : 'Fonte non indicata';
    const link = url ? ` · <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${source} ↗</a>` : ` · ${source}`;
    const date = evidence.data_verifica ? ` <small>(verificata ${escapeHTML(evidence.data_verifica)})</small>` : '';
    const note = evidence.note ? `<small class="regen-reproduction-note">${escapeHTML(evidence.note)}</small>` : '';
    return `<li><strong>${escapeHTML(area)}:</strong> ${escapeHTML(evidence.valore)}${link}${date}${note}</li>`;
  };
  const renderPlantReproduction = plants => {
    const sourced = (Array.isArray(plants) ? plants : []).filter(plant => plant && plant.reproduction && Object.values(plant.reproduction).some(item => item && item.valore));
    if (!sourced.length) return '';
    return `<details class="regen-plant-reproduction"><summary>Evidenze per la conservazione dei semi <span>${sourced.length} piante</span></summary><p class="regen-reproduction-caveat">Dati a livello di specie quando non è indicata una fonte specifica per cultivar. Non sono garanzie di purezza varietale né istruzioni automatiche.</p>${sourced.map(plant => `<section><h4>${escapeHTML(plant.label || plant.slug)}${plant.scientificName ? ` <em>${escapeHTML(plant.scientificName)}</em>` : ''}</h4><ul>${reproductionAreas.map(([key, label]) => reproductionValueMarkup(label, plant.reproduction[key])).join('')}</ul></section>`).join('')}</details>`;
  };
  const renderReproductionPreview = () => {
    if (!reproductionPreview) return;
    const plants = selectedPlanPlants();
    if (!plants.length) {
      reproductionPreview.innerHTML = '<p class="regen-backup-help">Seleziona una pianta per visualizzare le evidenze di riproduzione disponibili. Le lacune non vengono interpretate come assenza di rischio.</p>';
      return;
    }
    reproductionPreview.innerHTML = `<h3>EVIDENZE DISPONIBILI · ${plants.length} SELEZIONATE</h3><p class="regen-reproduction-caveat">Controlla in particolare isolamento e rischio d’incrocio se prevedi di raccogliere seme da conservazione. Le fonti mancanti richiedono verifica prima della fioritura.</p>${plants.map(plant => {
      const evidence = plant.reproduction || {};
      const count = reproductionAreas.filter(([key]) => evidence[key] && evidence[key].valore && evidence[key].url).length;
      return `<section><strong>${escapeHTML(plant.label)}</strong><span>${count}/4 aree con fonte e valore</span><ul>${reproductionAreas.map(([key, label]) => reproductionValueMarkup(label, evidence[key])).join('')}</ul></section>`;
    }).join('')}`;
  };
  planPlantOptions?.addEventListener('change', renderReproductionPreview);

  const formatDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value || 'Data non specificata';
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(new Date(year, month - 1, day));
  };

  const seedLabel = slug => {
    if (!slug) return 'Evento generale';
    const normalized = /^(seed:|perennial:)/.test(slug) ? slug : `seed:${slug}`;
    const option = Array.from(seedInput.options).find(item => item.value === normalized);
    return option ? option.textContent.trim() : slug.replace(/^(seed:|perennial:)/, '');
  };

  const normalizePlantRef = value => value ? (/^(seed:|perennial:)/.test(value) ? value : `seed:${value}`) : '';

  const sortEvents = list => list.slice().sort((a, b) => {
    const dateOrder = String(b.date || '').localeCompare(String(a.date || ''));
    return dateOrder || Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });

  const render = () => {
    const query = searchInput.value.trim().toLocaleLowerCase('it');
    const category = categoryFilter.value;
    const seed = seedFilter.value;
    const parcel = parcelFilter.value;
    const filtered = sortEvents(events).filter(event => {
      const searchable = [event.notes, event.category, seedLabel(event.seedSlug), parcelLabel(event.parcelId)].join(' ').toLocaleLowerCase('it');
      return (!query || searchable.includes(query)) &&
        (!category || event.category === category) &&
        (!seed || normalizePlantRef(event.seedSlug) === seed) &&
        (!parcel || event.parcelId === parcel);
    });

    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'evento' : 'eventi'} visualizzati · ${events.length} totali`;
    emptyState.hidden = filtered.length > 0;
    eventsContainer.innerHTML = filtered.map(event => `
      <article class="regen-event" data-event-id="${escapeHTML(event.id)}">
        <div class="regen-event-date"><time datetime="${escapeHTML(event.date)}">${escapeHTML(formatDate(event.date))}</time></div>
        <div class="regen-event-body">
          <div class="regen-event-meta"><span class="regen-category-tag">${escapeHTML(event.category)}</span>${event.parcelId ? `<span class="regen-event-parcel">${escapeHTML(parcelLabel(event.parcelId))}</span>` : ''}<span class="regen-event-seed">${escapeHTML(seedLabel(event.seedSlug))}</span></div>
          <p>${escapeHTML(event.notes).replace(/\n/g, '<br>')}</p>
        </div>
        <button type="button" class="regen-delete-button" data-delete-id="${escapeHTML(event.id)}" aria-label="Elimina evento del ${escapeHTML(formatDate(event.date))}" title="Elimina evento">×</button>
      </article>
    `).join('');
    document.querySelectorAll('.regen-published-event').forEach(record => {
      const recordSearch = (record.dataset.search || record.textContent || '').toLocaleLowerCase('it');
      const visible = (!query || recordSearch.includes(query)) &&
        (!category || record.dataset.category === category) &&
        (!seed || normalizePlantRef(record.dataset.seed) === seed) &&
        (!parcel || record.dataset.parcel === parcel);
      record.hidden = !visible;
    });
    document.querySelectorAll('.regen-published-plan-list .regen-plan-item').forEach(record => {
      const recordSearch = (record.textContent || '').toLocaleLowerCase('it');
      record.hidden = (!query || recordSearch.includes(query)) && (!parcel || record.dataset.parcel === parcel) ? false : true;
      if (planViewSeason && planViewSeason.value) record.hidden = record.hidden || Number(record.dataset.season) !== Number(planViewSeason.value);
    });
    if (typeof renderPlantings === 'function') renderPlantings();
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const notes = notesInput.value.trim();
    if (!dateInput.value || !categoryInput.value || !notes) {
      feedback.textContent = 'Compila data, categoria e osservazioni.';
      return;
    }

    const item = {
      id: (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      date: dateInput.value,
      category: categoryInput.value,
      seedSlug: seedInput.value,
      parcelId: parcelInput.value,
      parcelLabel: parcelLabel(parcelInput.value),
      notes,
      createdAt: Date.now()
    };

    events.push(item);
    if (!persist()) {
      events = events.filter(existing => existing.id !== item.id);
      return;
    }

    form.reset();
    dateInput.value = todayLocal();
    categoryInput.value = 'Semina';
    feedback.textContent = 'Evento registrato in questo browser.';
    searchInput.value = '';
    categoryFilter.value = '';
    seedFilter.value = '';
    parcelFilter.value = '';
    render();
  });

  eventsContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-id]');
    if (!button) return;
    const target = events.find(item => item.id === button.dataset.deleteId);
    if (!target || !window.confirm(`Eliminare l'evento del ${formatDate(target.date)}?`)) return;
    const previous = events;
    events = events.filter(item => item.id !== target.id);
    if (!persist()) events = previous;
    render();
  });

  [searchInput, categoryFilter, seedFilter, parcelFilter].forEach(control => {
    control.addEventListener(control === searchInput ? 'input' : 'change', render);
  });

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    seedFilter.value = '';
    parcelFilter.value = '';
    render();
  });

  const downloadJSON = (payload, filename) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const safeSlug = value => String(value || 'evento').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'evento';
  const yamlString = value => JSON.stringify(String(value ?? ''));
  const markdownForEvent = item => {
    const seed = item.seedSlug ? seedLabel(item.seedSlug) : '';
    const title = `${item.category}: ${seed || 'evento generale'} (${item.date})`;
    const isPerennial = String(item.seedSlug || '').startsWith('perennial:');
    const slug = String(item.seedSlug || '').replace(/^(seed:|perennial:)/, '');
    return `---\nlayout: field-log\ntitle: ${yamlString(title)}\ntype: field\ndate: ${item.date}\nevent_id: ${yamlString(item.id)}\ncategory: ${yamlString(item.category)}\nseed_slug: ${yamlString(isPerennial ? '' : slug)}\nperennial_slug: ${yamlString(isPerennial ? slug : '')}\nseed_name: ${yamlString(seed)}\nparcel_id: ${yamlString(item.parcelId || '')}\nparcel_label: ${yamlString(item.parcelLabel || parcelLabel(item.parcelId))}\n---\n\n${String(item.notes || '').replace(/\r\n/g, '\n').trim()}\n`;
  };
  const crc32 = bytes => {
    let crc = -1;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    return (crc ^ -1) >>> 0;
  };
  const makeZip = files => {
    const encoder = new TextEncoder();
    const localParts = [], centralParts = [];
    let offset = 0;
    const u16 = n => [n & 255, (n >>> 8) & 255];
    const u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
    files.forEach(file => {
      const name = encoder.encode(file.name);
      const data = encoder.encode(file.content);
      const crc = crc32(data);
      const localHeader = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0)
      ]);
      localParts.push(localHeader, name, data);
      const centralHeader = new Uint8Array([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0),
        ...u16(0), ...u16(0), ...u32(0), ...u32(offset)
      ]);
      centralParts.push(centralHeader, name);
      offset += localHeader.length + name.length + data.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const centralOffset = offset;
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
      ...u32(centralSize), ...u32(centralOffset), ...u16(0)
    ]);
    return new Blob([...localParts, ...centralParts, end], {type: 'application/zip'});
  };

  publishExportButton.addEventListener('click', () => {
    if (!events.length && !plantings.length && !conditionObservations.length) {
      backupFeedback.textContent = 'Nessun evento, piano parcelle o osservazione locale da preparare per la pubblicazione.';
      return;
    }
    const files = sortEvents(events).map(item => {
      const shortId = safeSlug(item.id).slice(-28);
      const filename = `field-${item.date}-${shortId || 'evento'}.md`;
      return { name: `_logs/${filename}`, content: markdownForEvent(item) };
    });
    const planYaml = `season: ${currentYear}
plantings:
${plantings.slice().sort((a,b) => Number(a.season)-Number(b.season) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it')).map(item => `  - parcel_id: ${yamlString(item.parcelId)}\n    parcel_label: ${yamlString(parcelLabel(item.parcelId))}\n    season: ${Number(item.season)}\n    crop: ${yamlString(item.crop)}\n    plants:${(Array.isArray(item.plants) && item.plants.length) ? `\n${item.plants.map(plant => `      - type: ${yamlString(plant.type)}\n        slug: ${yamlString(plant.slug)}\n        label: ${yamlString(plant.label)}\n        scientific_name: ${yamlString(plant.scientificName || '')}\n        family: ${yamlString(plant.family || '')}\n        life: ${yamlString(plant.life || 'non specificato')}${plant.reproduction && Object.keys(plant.reproduction).length ? `\n        reproduction:\n${Object.entries(plant.reproduction).map(([key, evidence]) => `          ${key}:\n            valore: ${yamlString(evidence?.valore || '')}\n            fonte: ${yamlString(evidence?.fonte || '')}\n            url: ${yamlString(evidence?.url || '')}\n            data_verifica: ${yamlString(evidence?.data_verifica || '')}\n            note: ${yamlString(evidence?.note || '')}`).join('\n')}` : ''}`).join('\n')}` : ' []'}\n    notes: ${yamlString(item.notes || '')}\n    conditions:\n      drainage: ${yamlString(item.conditions?.drainage || 'unknown')}\n      irrigation: ${yamlString(item.conditions?.irrigation || 'unknown')}\n      residues: ${yamlString(item.conditions?.residues || 'unknown')}\n      health: ${yamlString(item.conditions?.health || 'unknown')}`).join('\n')}\n`;
    files.push({name:'_data/plot-plantings.yml', content: planYaml});
    const observationRows = conditionObservations.slice().sort((a,b) => a.date.localeCompare(b.date) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it')).map(item => `  - id: ${yamlString(item.id)}\n    parcel_id: ${yamlString(item.parcelId)}\n    parcel_label: ${yamlString(parcelLabel(item.parcelId))}\n    date: ${item.date}\n    conditions:\n${Object.entries(item.conditions || {}).map(([key,value]) => `      ${key}: ${yamlString(value)}`).join('\n')}\n    notes: ${yamlString(item.notes || '')}`).join('\n');
    const observationYaml = observationRows ? `version: 1\nobservations:\n${observationRows}\n` : 'version: 1\nobservations: []\n';
    files.push({name:'_data/parcel-condition-history.yml', content: observationYaml});
    const blob = makeZip(files);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soil-genesis-field-logs-${todayLocal()}.zip`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    backupFeedback.textContent = `Pacchetto pronto: ${events.length} eventi, ${plantings.length} colture di base e ${conditionObservations.length} osservazioni datate. Estrai _logs/ e _data/ nella radice del repository, poi esegui commit e push. Le bozze locali non vengono cancellate.`;
  });

  exportButton.addEventListener('click', () => {
    const stamp = todayLocal();
    downloadJSON({
      format: 'soil-genesis-regeneration-diary',
      version: 1,
      exportedAt: new Date().toISOString(),
      events: sortEvents(events),
      plantings: plantings.slice().sort((a, b) => Number(a.season) - Number(b.season) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it')),
      conditionObservations: conditionObservations.slice().sort((a,b) => a.date.localeCompare(b.date))
    }, `soil-genesis-diario-${stamp}.json`);
    backupFeedback.textContent = `Backup esportato: ${events.length} eventi, ${plantings.length} colture di base e ${conditionObservations.length} osservazioni. Conserva il file in un luogo sicuro.`;
  });

  importTrigger.addEventListener('click', () => {
    importFile.value = '';
    importFile.click();
  });

  const isValidImportedEvent = item => item && typeof item === 'object' &&
    typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.category === 'string' && item.category.trim().length > 0 &&
    typeof item.notes === 'string' && item.notes.trim().length > 0 &&
    (item.seedSlug == null || typeof item.seedSlug === 'string') &&
    (item.parcelId == null || typeof item.parcelId === 'string');
  const isValidImportedPlanting = item => item && typeof item === 'object' &&
    typeof item.parcelId === 'string' && parcelLabel(item.parcelId) &&
    typeof item.crop === 'string' && item.crop.trim().length > 0 &&
    Number.isInteger(Number(item.season)) && Number(item.season) >= 2000 && Number(item.season) <= 2100 &&
    (item.notes == null || typeof item.notes === 'string') &&
    (item.plants == null || (Array.isArray(item.plants) && item.plants.every(plant => plant && typeof plant === 'object' && typeof plant.label === 'string')));

  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const isEnvelope = parsed && !Array.isArray(parsed) && parsed.format === 'soil-genesis-regeneration-diary' && parsed.version === 1;
      const importedEvents = Array.isArray(parsed) ? parsed : isEnvelope && Array.isArray(parsed.events) ? parsed.events : [];
      const importedPlantings = isEnvelope && Array.isArray(parsed.plantings) ? parsed.plantings : [];
      const importedObservations = isEnvelope && Array.isArray(parsed.conditionObservations) ? parsed.conditionObservations : [];
      if (!Array.isArray(parsed) && !isEnvelope) throw new Error('Formato di backup non riconosciuto.');
      const validObservation = item => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.parcelId === 'string' && !!parcelLabel(item.parcelId) && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && item.conditions && typeof item.conditions === 'object' && Object.keys(item.conditions).every(key => ['drainage','irrigation','residues','health'].includes(key));
      if (!importedEvents.every(isValidImportedEvent) || !importedPlantings.every(isValidImportedPlanting) || !importedObservations.every(validObservation)) {
        throw new Error('Formato non riconosciuto o eventi/colture incompleti.');
      }

      const existingIds = new Set(events.map(item => String(item.id || '')).filter(Boolean));
      const incomingEvents = importedEvents.map((item, index) => ({
        id: String(item.id || `import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`),
        date: item.date,
        category: item.category.trim(),
        seedSlug: typeof item.seedSlug === 'string' ? item.seedSlug : '',
        parcelId: typeof item.parcelId === 'string' ? item.parcelId : '',
        parcelLabel: typeof item.parcelLabel === 'string' ? item.parcelLabel : parcelLabel(item.parcelId),
        notes: item.notes.trim(),
        createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now() + index
      }));
      const uniqueEvents = incomingEvents.filter(item => {
        if (existingIds.has(item.id)) return false;
        existingIds.add(item.id);
        return true;
      });

      const existingPlantingKeys = new Set(plantings.map(item => `${item.season}:${item.parcelId}`));
      const incomingPlantings = importedPlantings.map(item => ({
        parcelId: item.parcelId,
        crop: item.crop.trim(),
        plants: Array.isArray(item.plants) ? item.plants : [],
        season: Number(item.season),
        notes: typeof item.notes === 'string' ? item.notes.trim() : '',
        conditions: item.conditions && typeof item.conditions === 'object' ? { drainage: ['unknown','good','poor','variable'].includes(item.conditions.drainage) ? item.conditions.drainage : 'unknown', irrigation: ['unknown','ground','overhead','mixed'].includes(item.conditions.irrigation) ? item.conditions.irrigation : 'unknown', residues: ['unknown','removed','healthy-retained','suspect-retained','composted'].includes(item.conditions.residues) ? item.conditions.residues : 'unknown', health: ['unknown','none-observed','symptoms','suspected','confirmed'].includes(item.conditions.health) ? item.conditions.health : 'unknown' } : { drainage: 'unknown', irrigation: 'unknown', residues: 'unknown', health: 'unknown' },
        updatedAt: Number.isFinite(Number(item.updatedAt)) ? Number(item.updatedAt) : Date.now()
      }));
      const uniquePlantings = incomingPlantings.filter(item => {
        const key = `${item.season}:${item.parcelId}`;
        if (existingPlantingKeys.has(key)) return false;
        existingPlantingKeys.add(key);
        return true;
      });

      const existingObservationIds = new Set(conditionObservations.map(item => String(item.id)));
      const incomingObservations = importedObservations.filter(item => { if (existingObservationIds.has(item.id)) return false; existingObservationIds.add(item.id); return true; }).map(item => ({ id: item.id, parcelId: item.parcelId, date: item.date, conditions: Object.fromEntries(Object.entries(item.conditions).filter(([key,value]) => ({ drainage:['good','poor','variable'], irrigation:['ground','overhead','mixed'], residues:['removed','healthy-retained','suspect-retained','composted'], health:['none-observed','symptoms','suspected','confirmed'] }[key] || []).includes(value))), notes: typeof item.notes === 'string' ? item.notes.trim() : '', createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now() }));
      const previousEvents = events;
      const previousPlantings = plantings;
      const previousObservations = conditionObservations;
      events = events.concat(uniqueEvents);
      plantings = plantings.concat(uniquePlantings);
      conditionObservations = conditionObservations.concat(incomingObservations);
      if (!persist() || !persistPlantings() || !persistConditionObservations()) {
        events = previousEvents;
        plantings = previousPlantings;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); localStorage.setItem(CONDITION_HISTORY_KEY, JSON.stringify(conditionObservations)); } catch (_) {}
        backupFeedback.textContent = 'Importazione incompleta: impossibile salvare tutti i dati nella memoria locale. Le copie precedenti sono state ripristinate quando possibile.';
        return;
      }

      render();
      renderPlantings();
      renderConditionObservations();
      backupFeedback.textContent = `Importazione completata: ${uniqueEvents.length} eventi, ${uniquePlantings.length} colture e ${incomingObservations.length} osservazioni nuove. I duplicati sono stati ignorati; le registrazioni esistenti non sono state sovrascritte.`;
    } catch (error) {
      backupFeedback.textContent = `Backup non importato: ${error.message || 'file non valido'}`;
    }
  });

  const persistPlantings = () => {
    try { localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plantings)); return true; }
    catch (error) { planFeedback.textContent = 'Salvataggio non riuscito: memoria locale non disponibile.'; return false; }
  };

  const persistConditionObservations = () => {
    try { localStorage.setItem(CONDITION_HISTORY_KEY, JSON.stringify(conditionObservations)); return true; }
    catch (_) { if (observationFeedback) observationFeedback.textContent = 'Salvataggio non riuscito: memoria locale non disponibile.'; return false; }
  };
  const renderConditionTrends = (observations, throughYear) => {
    if (!conditionTrends) return;
    const fields = [
      ['drainage', 'Drenaggio'],
      ['irrigation', 'Irrigazione'],
      ['residues', 'Residui colturali'],
      ['health', 'Stato fitosanitario']
    ];
    const byParcel = new Map();
    observations.forEach(item => {
      const parcelId = normalizeParcelId(item.parcelId);
      if (!parcelId) return;
      if (!byParcel.has(parcelId)) byParcel.set(parcelId, []);
      byParcel.get(parcelId).push(item);
    });
    const cards = Array.from(byParcel.entries()).sort(([a], [b]) => parcelLabel(a).localeCompare(parcelLabel(b), 'it')).map(([parcelId, entries]) => {
      const lines = fields.map(([key, label]) => {
        const recorded = entries.filter(item => item.conditions && item.conditions[key] && item.conditions[key] !== 'unknown' && conditionLabels[key]?.[item.conditions[key]]).sort((a,b) => a.date.localeCompare(b.date));
        if (!recorded.length) return `<li class="regen-condition-trend-item is-unrecorded"><strong>${label}</strong><span>Nessun dato registrato entro ${throughYear}.</span></li>`;
        const latest = recorded[recorded.length - 1];
        const latestLabel = conditionLabels[key][latest.conditions[key]];
        const previous = recorded.length > 1 ? recorded[recorded.length - 2] : null;
        let comparison = 'Una sola osservazione disponibile: nessun confronto temporale possibile.';
        let state = 'is-single';
        if (previous) {
          const previousLabel = conditionLabels[key][previous.conditions[key]];
          if (previous.conditions[key] === latest.conditions[key]) {
            comparison = `Invariato rispetto al ${formatDate(previous.date)}: ${previousLabel}.`;
            state = 'is-stable';
          } else {
            comparison = `Cambiamento registrato tra ${formatDate(previous.date)} e ${formatDate(latest.date)}: da “${previousLabel}” a “${latestLabel}”.`;
            state = 'is-changed';
          }
        }
        return `<li class="regen-condition-trend-item ${state}"><strong>${label}</strong><span class="regen-condition-trend-current">Ultimo dato · ${escapeHTML(formatDate(latest.date))}: ${escapeHTML(latestLabel)}</span><small>${escapeHTML(comparison)}</small></li>`;
      }).join('');
      const latestDate = entries[entries.length - 1]?.date || '';
      const countLabel = `${entries.length} ${entries.length === 1 ? 'osservazione' : 'osservazioni'}`;
      return `<article class="regen-condition-trend-card"><header><h4>${escapeHTML(parcelLabel(parcelId) || parcelId)}</h4><span>${countLabel} · ultimo dato ${escapeHTML(latestDate ? formatDate(latestDate) : 'non disponibile')}</span></header><ul>${lines}</ul></article>`;
    });
    conditionTrends.innerHTML = cards.length ? cards.join('') : '<p class="regen-backup-help">Non ci sono osservazioni datate per il filtro selezionato e fino alla stagione indicata. Registra osservazioni in date diverse per ottenere un confronto.</p>';
  };

  const renderConditionObservations = () => {
    if (!observationList) return;
    const season = Number(planViewSeason.value || currentYear);
    const publishedIds = new Set(publishedConditionObservations.map(item => item.id));
    const allObservations = [...publishedConditionObservations, ...conditionObservations.filter(item => !publishedIds.has(item.id))];
    const parcelSelected = parcelFilter.value;
    const trendObservations = allObservations.filter(item => Number(item.date.slice(0,4)) <= season && (!parcelSelected || normalizeParcelId(item.parcelId) === normalizeParcelId(parcelSelected))).sort((a,b) => a.date.localeCompare(b.date));
    renderConditionTrends(trendObservations, season);
    const filtered = allObservations.filter(item => Number(item.date.slice(0,4)) === season && (!parcelSelected || normalizeParcelId(item.parcelId) === normalizeParcelId(parcelSelected))).sort((a,b) => b.date.localeCompare(a.date) || parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'));
    observationList.innerHTML = filtered.map(item => {
      const rows = Object.entries(item.conditions || {}).filter(([key,value]) => conditionLabels[key]?.[value]).map(([key,value]) => `<li><strong>${escapeHTML(({drainage:'Drenaggio',irrigation:'Irrigazione',residues:'Residui',health:'Stato fitosanitario'})[key])}:</strong> ${escapeHTML(conditionLabels[key][value])}</li>`).join('');
      return `<article class="regen-condition-observation"><div class="regen-condition-observation-head"><time datetime="${escapeHTML(item.date)}">${escapeHTML(formatDate(item.date))}</time><strong>${escapeHTML(parcelLabel(item.parcelId))}</strong>${item.published ? '<span class="regen-observation-published">PUBBLICATA</span>' : `<button type="button" class="regen-delete-button" data-delete-observation="${escapeHTML(item.id)}" aria-label="Elimina osservazione del ${escapeHTML(item.date)}">×</button>`}</div><ul>${rows}</ul>${item.notes ? `<p>${escapeHTML(item.notes).replace(/\n/g,'<br>')}</p>` : ''}<p class="regen-backup-help">${item.published ? 'Osservazione pubblicata e versionata nel repository.' : 'Bozza locale: non modifica il piano colturale né le registrazioni precedenti.'}</p></article>`;
    }).join('');
    if (!filtered.length) observationList.innerHTML = '<p class="regen-backup-help">Nessuna osservazione registrata per questa stagione e questi filtri.</p>';
  };

  const renderPlantings = () => {
    const season = Number(planViewSeason.value || currentYear);
    const query = planSearch.value.trim().toLocaleLowerCase('it');
    const filtered = plantings.filter(item => Number(item.season) === season && (!parcelFilter.value || item.parcelId === parcelFilter.value) && [parcelLabel(item.parcelId), item.crop, item.notes, ...Object.values(item.conditions || {})].join(' ').toLocaleLowerCase('it').includes(query))
      .sort((a,b) => parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'));
    planList.innerHTML = filtered.map(item => `<article class="regen-plan-item"><div><span class="regen-plan-season">STAGIONE ${escapeHTML(item.season)}</span><h3>${escapeHTML(parcelLabel(item.parcelId))}</h3><p class="regen-plan-crop">${escapeHTML(Array.isArray(item.plants) && item.plants.length ? item.plants.map(plant => plant.label).join(' + ') : item.crop)}</p>${item.notes ? `<p>${escapeHTML(item.notes).replace(/\n/g,'<br>')}</p>` : ''}${renderConditionSummary(item.conditions)}${renderPlantReproduction(item.plants)}${renderPlantingProfileLinks(item)}<p class="regen-plan-no-date">Coltura di base · data non registrata</p></div><button type="button" class="regen-delete-button" data-delete-planting="${escapeHTML(item.parcelId)}" data-season="${escapeHTML(item.season)}" aria-label="Rimuovi coltura dalla parcella">×</button></article>`).join('');
    if (!filtered.length) planList.innerHTML = '<p class="regen-backup-help">Nessuna coltura registrata per questa stagione e questi filtri.</p>';
    renderRotations();
  };

  const renderRotations = () => {
    if (!rotationList) return;
    const season = Number(planViewSeason.value || currentYear);
    const all = [];
    const byKey = new Map();
    [...publishedPlantings, ...plantings].forEach(item => {
      const seasonValue = Number(item.season);
      const parcelId = normalizeParcelId(item.parcelId || item.parcel_id || '');
      if (!parcelId || !Number.isInteger(seasonValue)) return;
      const key = `${seasonValue}:${parcelId}`;
      const normalizedPlants = (Array.isArray(item.plants) ? item.plants : []).map(plant => ({
        ...plant,
        type: plant.type || (plant.perennial_slug ? 'perennial' : 'seed'),
        slug: plant.slug || plant.seed_slug || plant.perennial_slug || '',
        family: plant.family || '',
        life: plant.life || ''
      }));
      const normalized = { ...item, parcelId, season: seasonValue, plants: normalizedPlants };
      if (byKey.has(key)) {
        const existing = byKey.get(key);
        // Merge the published and local snapshot so a richer local family/life record is not lost.
        const mergedPlants = new Map();
        [...existing.plants, ...normalized.plants].forEach(plant => {
          const plantKey = `${plant.type}:${plant.slug}`;
          mergedPlants.set(plantKey, { ...(mergedPlants.get(plantKey) || {}), ...plant });
        });
        byKey.set(key, { ...existing, ...normalized, plants: Array.from(mergedPlants.values()), notes: normalized.notes || existing.notes || '' });
      } else byKey.set(key, normalized);
    });
    all.push(...byKey.values());
    const current = all.filter(item => item.season === season).sort((a,b) => parcelLabel(a.parcelId).localeCompare(parcelLabel(b.parcelId), 'it'));
    if (!current.length) {
      rotationList.innerHTML = '<p class="regen-backup-help">Nessuna coltura per la stagione selezionata. Registra il piano attuale e le stagioni precedenti per iniziare a confrontare le rotazioni.</p>' + renderPathogenProfiles();
      return;
    }
    rotationList.innerHTML = current.map(item => {
      const refs = Array.isArray(item.plants) ? item.plants : [];
      const currentFamilies = familiesForPlanting(item, { excludePerennials: true });
      const perennialPlants = persistentPlantsForPlanting(item);
      const unknownLifePlants = unknownLifePlantsForPlanting(item);
      const prior = all.filter(old => old.parcelId === item.parcelId && old.season < item.season).sort((a,b) => b.season-a.season);
      const last = prior[0];
      const priorWindow = prior.filter(old => old.season >= item.season - 3);
      const priorWithAnnualFamilies = prior.filter(old => familiesForPlanting(old, { excludePerennials: true }).length > 0);
      const lastAnnual = priorWithAnnualFamilies[0];
      const previousFamilies = lastAnnual ? familiesForPlanting(lastAnnual, { excludePerennials: true }) : [];
      const repeatedLast = lastAnnual && lastAnnual.season >= item.season - 3
        ? currentFamilies.filter(family => previousFamilies.some(old => normalizeFamily(old) === normalizeFamily(family)))
        : [];
      const repeatedWindow = currentFamilies.filter(family => priorWindow.some(old => familiesForPlanting(old, { excludePerennials: true }).some(oldFamily => normalizeFamily(oldFamily) === normalizeFamily(family))));
      const repeated = Array.from(new Set([...repeatedLast, ...repeatedWindow]));
      let status = 'STORICO INSUFFICIENTE', cls = 'is-unknown';
      const details = [];
      const diseaseDetails = [];
      const diseaseLinks = [];
      const diseaseEvidence = diseaseEvidenceForParcel(item.parcelId, item.season, all);
      const relevantDiseaseRules = new Map();
      diseaseEvidence.forEach(record => {
        if (!hostsDisease(item, record.rule)) return;
        const elapsed = item.season - record.year;
        if (record.rule.alwaysWarn || elapsed < record.rule.minGap) {
          const existing = relevantDiseaseRules.get(record.rule.id);
          if (!existing || record.year > existing.year) relevantDiseaseRules.set(record.rule.id, { ...record, elapsed });
        }
      });
      if (!currentFamilies.length && perennialPlants.length) {
        status = 'PARCELLA CON PERENNI';
        cls = '';
        details.push('La parcella contiene soltanto piante perenni selezionate. Il sistema non propone di spostarle e non applica a queste piante la rotazione annuale.');
      } else if (!lastAnnual) {
        details.push('Non c’è una coltura annuale o biennale precedente con famiglia botanica registrata. La valutazione è preliminare.');
      } else if (!currentFamilies.length || !previousFamilies.length) {
        status = 'DATI BOTANICI DA VERIFICARE';
        cls = 'is-unknown';
        details.push(`Ultima coltura annuale/biennale confrontabile: stagione ${lastAnnual.season}. Una o più famiglie botaniche non sono disponibili.`);
      } else if (repeated.length) {
        status = 'FAMIGLIA RIPETUTA';
        cls = 'is-warning';
        const years = priorWindow.filter(old => familiesForPlanting(old, { excludePerennials: true }).some(oldFamily => repeated.some(family => normalizeFamily(family) === normalizeFamily(oldFamily)))).map(old => old.season);
        details.push(`Famiglie presenti anche nello storico recente: ${repeated.join(', ')}${years.length ? ` (stagioni ${Array.from(new Set(years)).sort((a,b)=>a-b).join(', ')})` : ''}. Valuta un intervallo più lungo o una famiglia diversa. Una guida universitaria per orti domestici indica spesso 2–4 anni prima di riportare la stessa famiglia, ma la durata appropriata dipende da coltura, patogeno e condizioni locali.`);
      } else {
        status = 'NESSUNA RIPETIZIONE RILEVATA';
        cls = '';
        details.push(`Nel confronto con la stagione ${lastAnnual.season} e le stagioni registrate negli ultimi tre anni non risultano famiglie annuali/biennali in comune.`);
      }
      if (relevantDiseaseRules.size) {
        status = 'ATTENZIONE: STORICO FITOSANITARIO';
        cls = 'is-warning';
        relevantDiseaseRules.forEach(record => {
          const remaining = Math.max(0, record.rule.minGap - record.elapsed);
          diseaseDetails.push(`È stata registrata una menzione di ${record.rule.label} nella stagione ${record.year} (${record.source}). La coltura attuale include ospiti indicati dalla fonte e sono trascorsi ${record.elapsed} anni: ${record.rule.recommendation} ${remaining ? `Intervallo indicativo non ancora raggiunto secondo questa fonte: circa ${remaining} ${remaining === 1 ? 'anno' : 'anni'}.` : ''}`);
          contextualParcelPrompts(item, record.rule).forEach(prompt => diseaseDetails.push(`Nota contestuale da verificare: ${prompt}`));
          diseaseLinks.push(`<li><a href="${record.rule.source}" target="_blank" rel="noopener noreferrer">Fonte per ${escapeHTML(record.rule.label)}: ${escapeHTML(record.rule.sourceLabel)}</a></li>`);
        });
      }
      if (perennialPlants.length) {
        details.push(`Perenni presenti: ${perennialPlants.map(plant => plant.label || plant.slug).join(', ')}. Sono escluse dal controllo di rotazione annuale: non vanno considerate colture da spostare automaticamente.`);
      }
      if (unknownLifePlants.length) {
        details.push(`Ciclo di vita non specificato per: ${unknownLifePlants.map(plant => plant.label || plant.slug).join(', ')}. Verifica la scheda botanica prima di interpretare la rotazione.`);
      }
      if (!refs.length && !item.crop) details.push('La registrazione non contiene un elenco di piante leggibile. Aggiorna la consociazione per ottenere un confronto più affidabile.');
      details.push('Indicazione orientativa: il controllo considera famiglie e storico registrato, non diagnostica malattie né valuta da solo fertilità, consociazioni, residui colturali o condizioni locali.');
      const cropLabel = refs.length ? refs.map(plant => plant.label || plant.slug).join(' + ') : item.crop || 'Non specificata';
      const lifeLabel = refs.length ? Array.from(new Set(refs.map(plantLife))).join(', ') : 'non disponibile';
      return `<article class="regen-rotation-item"><span class="regen-rotation-status ${cls}">${status}</span><h3>${escapeHTML(parcelLabel(item.parcelId))}</h3><p class="regen-rotation-crop"><strong>Coltura:</strong> ${escapeHTML(cropLabel)}</p>${diseaseDetails.map(detail => `<p class="regen-rotation-alert">${escapeHTML(detail)}</p>`).join('')}${diseaseLinks.length ? `<ul class="regen-rotation-sources">${Array.from(new Set(diseaseLinks)).join('')}</ul>` : ''}<details class="regen-rotation-more"><summary>Dettagli dell'analisi</summary><div><p><strong>Famiglie per il confronto:</strong> ${escapeHTML(currentFamilies.join(', ') || 'Non disponibili')}</p><p><strong>Ciclo di vita:</strong> ${escapeHTML(lifeLabel)}</p>${renderPlantingProfileLinks(item)}${details.map(detail => `<p>${escapeHTML(detail)}</p>`).join('')}</div></details></article>`;
    }).join('') + `
      <details class="regen-rotation-evidence">
        <summary id="regen-rotation-evidence-title">Base scientifica e limiti del controllo <small>Fonti, criteri e schede fitosanitarie</small></summary>
        <div class="regen-rotation-evidence-body">
        <p>La ripetizione di una famiglia è un segnale generale, non una diagnosi. Le regole fitosanitarie specifiche si attivano solo quando una malattia è stata menzionata nelle note del piano o nel Registro eventi della stessa parcella; una menzione non equivale a una diagnosi confermata.</p>
        <ul>
          <li><a href="https://doi.org/10.1016/j.jenvman.2025.125833" target="_blank" rel="noopener noreferrer">Kim et al. (2025), revisione sistematica di 150 studi su rotazioni e cover crops</a> (principi generali).</li>
          <li><a href="https://doi.org/10.1038/s41467-025-64567-9" target="_blank" rel="noopener noreferrer">Zhang et al. (2025), meta-analisi di 3.663 osservazioni di prove di campo sulle rotazioni</a> (risultati medi globali).</li>
          <li><a href="https://doi.org/10.1126/sciadv.aba1715" target="_blank" rel="noopener noreferrer">Tamburini et al. (2020), sintesi di 98 meta-analisi sulla diversificazione agricola</a>.</li>
          <li><a href="https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-problems/managing-plant-diseases-in-the-home-garden" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, rotazione generale delle famiglie (2–4 anni, indicazione per orti domestici)</a>.</li>
          <li><a href="https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/phytophthora" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, Phytophthora: ospiti e rotazione minima di tre anni</a>.</li>
          <li><a href="https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/fusarium-wilt" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, Fusarium wilt: rotazione di 3–5 anni o più per colture suscettibili</a>.</li>
          <li><a href="https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/gummy-stem-blight-and-black-rot" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, gummy stem blight / black rot delle cucurbitacee</a>.</li>
          <li><a href="https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/angular-leaf-spot" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, maculatura angolare delle cucurbitacee</a>.</li>
          <li><a href="https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/early-blight-in-tomato-and-potato" target="_blank" rel="noopener noreferrer">University of Minnesota Extension, Alternaria / early blight su pomodoro e patata</a>.</li>
          <li><a href="https://ipm.cahnr.uconn.edu/clubroot-of-crucifers/" target="_blank" rel="noopener noreferrer">University of Connecticut IPM, clubroot: pausa di 7 anni quando confermato</a>.</li>
          <li><a href="https://hortsense.cahnrs.wsu.edu/fact-sheet/onions-garlic-white-rot/" target="_blank" rel="noopener noreferrer">Washington State University Hortsense, marciume bianco di cipolla e aglio: intervallo 8–10 anni e limiti della rotazione</a>.</li>
        </ul>
        ${renderPathogenProfiles()}
        <p class="regen-evidence-caveat">Le indicazioni fitosanitarie provengono da fonti universitarie di extension e sono contestuali, non soglie universali validate per ogni clima. Il controllo non identifica patogeni, non conferma diagnosi e non considera automaticamente infestanti ospiti, analisi di laboratorio, cultivar o persistenza locale. Le menzioni di malattia devono essere verificate sul campo; non usare la rotazione come unica misura di gestione.</p>
        </div>
      </details>`;
  };

  observationForm?.addEventListener('submit', event => {
    event.preventDefault();
    const parcelId = observationParcelInput.value;
    const date = observationDateInput.value;
    const conditions = readObservationConditions();
    const notes = observationNotesInput.value.trim();
    if (!parcelId || !date || (!Object.keys(conditions).length && !notes)) { observationFeedback.textContent = 'Indica una parcella, una data e almeno una condizione osservata o una nota.'; return; }
    const previous = conditionObservations;
    const observation = { id: `obs-${date}-${safeSlug(parcelId)}-${Date.now().toString(36)}`, parcelId, date, conditions, notes, createdAt: Date.now() };
    conditionObservations = [...conditionObservations, observation];
    if (!persistConditionObservations()) { conditionObservations = previous; return; }
    Object.values(observationConditionInputs).forEach(input => { if (input) input.value = 'unknown'; });
    observationNotesInput.value = ''; planViewSeason.value = date.slice(0,4);
    observationFeedback.textContent = `Osservazione del ${date} salvata nello storico. Nessun dato precedente è stato modificato.`;
    renderConditionObservations();
  });
  observationList?.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-observation]');
    if (!button) return;
    const target = conditionObservations.find(item => item.id === button.dataset.deleteObservation);
    if (!target || !window.confirm(`Eliminare soltanto l'osservazione del ${target.date} per ${parcelLabel(target.parcelId)}?`)) return;
    const previous = conditionObservations;
    conditionObservations = conditionObservations.filter(item => item.id !== target.id);
    if (!persistConditionObservations()) conditionObservations = previous;
    renderConditionObservations();
  });

  planForm.addEventListener('submit', event => {
    event.preventDefault();
    const parcelId = planParcelInput.value;
    const plants = selectedPlanPlants();
    const crop = plants.map(plant => plant.label).join(' + ');
    const season = Number(planSeasonInput.value);
    if (!parcelId || !plants.length || !Number.isInteger(season) || season < 2000 || season > 2100) {
      planFeedback.textContent = 'Indica stagione, parcella e almeno una pianta dell’archivio.'; return;
    }
    const previous = plantings;
    const existingIndex = plantings.findIndex(item => item.parcelId === parcelId && Number(item.season) === season);
    const record = { parcelId, crop, plants, season, notes: planNotesInput.value.trim(), conditions: readPlanConditions(), updatedAt: Date.now() };
    plantings = plantings.slice();
    if (existingIndex >= 0) {
      if (!window.confirm(`La parcella «${parcelLabel(parcelId)}» ha già una coltura per ${season}. Sostituirla con questa consociazione?`)) return;
      plantings[existingIndex] = record;
    } else plantings.push(record);
    if (!persistPlantings()) { plantings = previous; return; }
    document.querySelectorAll('.regen-plan-plant').forEach(input => { input.checked = false; });
    renderReproductionPreview();
    planNotesInput.value = ''; Object.values(planConditionInputs).forEach(input => { if (input) input.value = 'unknown'; }); planViewSeason.value = String(season); planSearch.value = '';
    planFeedback.textContent = `Consociazione salvata: ${plants.map(plant => plant.label).join(' + ')}. Nessuna data d’impianto aggiunta.`;
    renderPlantings();
  });

  planList.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-planting]');
    if (!button) return;
    const target = plantings.find(item => item.parcelId === button.dataset.deletePlanting && String(item.season) === button.dataset.season);
    if (!target || !window.confirm(`Rimuovere ${target.crop} da ${parcelLabel(target.parcelId)} per ${target.season}?`)) return;
    const previous = plantings;
    plantings = plantings.filter(item => item !== target);
    if (!persistPlantings()) plantings = previous;
    renderPlantings();
  });
  planViewSeason.addEventListener('change', () => { renderPlantings(); renderConditionObservations(); render(); });
  planSearch.addEventListener('input', renderPlantings);
  if (planPlantSearch && planPlantOptions) planPlantSearch.addEventListener('input', () => {
    const query = planPlantSearch.value.trim().toLocaleLowerCase('it');
    planPlantOptions.querySelectorAll('label').forEach(label => { label.hidden = !label.textContent.toLocaleLowerCase('it').includes(query); });
  });

  root.addEventListener('click', event => {
    const link = event.target.closest('[data-open-pathogen]');
    if (!link) return;
    const target = document.getElementById(`pathogen-${link.dataset.openPathogen}`);
    if (!target) return;
    event.preventDefault();
    const library = target.closest('.regen-pathogen-library');
    if (library) library.open = true;
    const evidence = target.closest('.regen-rotation-evidence');
    if (evidence) evidence.open = true;
    const enclosingDisclosure = target.closest('.regen-rotation-more');
    if (enclosingDisclosure) enclosingDisclosure.open = true;
    target.open = true;
    window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  });

  render();
  renderPlantings();
  renderConditionObservations();
})();
