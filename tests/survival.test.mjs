import test from "node:test";
import assert from "node:assert/strict";

const storage = new Map();

globalThis.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(key, String(value));
  },
  removeItem(key) {
    storage.delete(key);
  }
};

const { default: Player } = await import("../main/engine/Player.js");
const { default: ITEMS } = await import("../main/engine/ItemCatalog.js");
const { default: Inventory } = await import("../main/engine/Inventory.js");

test("un vecchio salvataggio riceve sazietà e idratazione iniziali", () => {
  const player = new Player({
    name: "Custode",
    energy: 72,
    inventory: { "scatola-conserve": 1 }
  });

  assert.equal(player.hunger, 100);
  assert.equal(player.thirst, 100);
  assert.equal(player.energy, 72);
  assert.equal(player.inventory.items["scatola-conserve"], 1);
});

test("i minuti residui si accumulano tra azioni brevi", () => {
  const player = new Player();

  player.advanceNeeds(30);
  assert.equal(player.hunger, 100);
  assert.equal(player.thirst, 100);

  player.advanceNeeds(60);
  assert.equal(player.hunger, 99);
  assert.equal(player.thirst, 99);

  player.advanceNeeds(90);
  assert.equal(player.hunger, 98);
  assert.equal(player.thirst, 97);
});

test("bisogni e minuti residui sono salvati e ripristinati", () => {
  storage.clear();
  const player = new Player();
  player.updateStats({ hunger: 61, thirst: 43, energy: 80 });
  player.advanceNeeds(30);

  const loaded = Player.load();

  assert.equal(loaded.hunger, 61);
  assert.equal(loaded.thirst, 43);
  assert.equal(loaded.energy, 80);
  assert.equal(loaded.hungerElapsedMinutes, 30);
  assert.equal(loaded.thirstElapsedMinutes, 30);
});

test("gli oggetti hanno effetti distinti sui bisogni", () => {
  assert.equal(ITEMS["scatola-conserve"].hungerRecovery, 35);
  assert.equal(ITEMS["scatola-conserve"].thirstRecovery, 0);
  assert.equal(ITEMS["bottiglia-acqua"].thirstRecovery, 45);
  assert.equal(ITEMS["bottiglia-acqua"].hungerRecovery, 0);
  assert.equal(ITEMS.bacche.usable, true);
  assert.equal(ITEMS.bacche.hungerRecovery, 10);
  assert.equal(ITEMS.erbe.usable, false);
});

test("i valori delle statistiche restano nel limite 0-100", () => {
  const player = new Player();
  player.updateStats({ hunger: 150, thirst: -20, energy: 150 });
  assert.equal(player.hunger, 100);
  assert.equal(player.thirst, 0);
  assert.equal(player.energy, 100);
});


test("la fame a zero causa danni dopo sei ore effettive", () => {
  const player = new Player({ hunger: 0, thirst: 100, health: 50 });
  player.advanceNeeds(359);
  assert.equal(player.health, 50);
  player.advanceNeeds(1);
  assert.equal(player.health, 49);
  assert.equal(player.starvationElapsedMinutes, 0);
});

test("la disidratazione causa danni dopo tre ore effettive", () => {
  const player = new Player({ hunger: 100, thirst: 0, health: 50 });
  player.advanceNeeds(179);
  assert.equal(player.health, 50);
  player.advanceNeeds(1);
  assert.equal(player.health, 49);
  assert.equal(player.dehydrationElapsedMinutes, 0);
});

test("il tempo prima che un bisogno raggiunga zero non causa danni prematuri", () => {
  const player = new Player({ hunger: 1, thirst: 100, health: 50 });
  player.advanceNeeds(90);
  assert.equal(player.hunger, 0);
  assert.equal(player.health, 50);
  player.advanceNeeds(359);
  assert.equal(player.health, 50);
  player.advanceNeeds(1);
  assert.equal(player.health, 49);
});

test("i contatori dei danni vengono salvati e ripristinati", () => {
  storage.clear();
  const player = new Player({ hunger: 0, thirst: 0, health: 50 });
  player.advanceNeeds(120);
  const loaded = Player.load();
  assert.equal(loaded.health, 50);
  assert.equal(loaded.starvationElapsedMinutes, 120);
  assert.equal(loaded.dehydrationElapsedMinutes, 120);
});

test("mangiare o bere azzera il relativo contatore di danno", () => {
  const player = new Player({ hunger: 0, thirst: 0 });
  player.advanceNeeds(120);
  player.updateStats({ hunger: 10, thirst: 20 });
  player.resetNeedClock("hunger");
  player.resetNeedClock("thirst");
  assert.equal(player.starvationElapsedMinutes, 0);
  assert.equal(player.dehydrationElapsedMinutes, 0);
});


test("gli oggetti medici hanno recuperi di salute distinti", () => {
  assert.equal(ITEMS.bende.healthRecovery, 15);
  assert.equal(ITEMS["kit-primo-soccorso"].healthRecovery, 35);
  assert.equal(ITEMS.bende.usable, true);
  assert.equal(ITEMS["kit-primo-soccorso"].usable, true);
});

test("gli oggetti medici non alterano fame, sete o energia nei dati catalogo", () => {
  for (const id of ["bende", "kit-primo-soccorso"]) {
    assert.equal(ITEMS[id].hungerRecovery, 0);
    assert.equal(ITEMS[id].thirstRecovery, 0);
    assert.equal(ITEMS[id].energyRecovery, 0);
  }
});

test("la salute resta nel limite 0-100", () => {
  const player = new Player({ health: 80 });
  player.updateStats({ health: 120 });
  assert.equal(player.health, 100);
  player.updateStats({ health: -10 });
  assert.equal(player.health, 0);
});

test("l'inventario accetta e salva i nuovi oggetti medici", () => {
  const player = new Player();
  player.collectItem("bende", 2);
  player.collectItem("kit-primo-soccorso", 1);
  const loaded = new Player(player.toJSON());
  assert.equal(loaded.inventory.items.bende, 2);
  assert.equal(loaded.inventory.items["kit-primo-soccorso"], 1);
});

test("la privazione prolungata può generare lesioni persistenti a salute critica", () => {
  const player = new Player({ hunger: 0, thirst: 100, health: 26 });
  player.advanceNeeds(360);
  assert.equal(player.health, 25);
  assert.equal(player.woundSeverity, 2);
  assert.equal(player.getWoundLabel(), "Seria");
});

test("lesioni e tempo di recupero vengono salvati", () => {
  storage.clear();
  const player = new Player({ woundSeverity: 2, woundRecoveryElapsedMinutes: 300 });
  player.save();
  const loaded = Player.load();
  assert.equal(loaded.woundSeverity, 2);
  assert.equal(loaded.woundRecoveryElapsedMinutes, 300);
});

test("il riposo guarisce un livello di lesione dopo dodici ore in condizioni stabili", () => {
  const player = new Player({ woundSeverity: 2, hunger: 100, thirst: 100 });
  assert.equal(player.recoverWoundsDuringRest(600), 0);
  assert.equal(player.woundSeverity, 2);
  assert.equal(player.recoverWoundsDuringRest(120), 1);
  assert.equal(player.woundSeverity, 1);
  assert.equal(player.woundRecoveryElapsedMinutes, 0);
});

test("fame o sete critiche bloccano il recupero naturale delle lesioni", () => {
  const player = new Player({ woundSeverity: 1, hunger: 20, thirst: 100 });
  assert.equal(player.recoverWoundsDuringRest(1440), 0);
  assert.equal(player.woundSeverity, 1);
});

test("le cure mediche trattano lesioni senza scendere sotto zero", () => {
  const player = new Player({ woundSeverity: 3, woundRecoveryElapsedMinutes: 400 });
  assert.equal(player.treatWounds(2), 2);
  assert.equal(player.woundSeverity, 1);
  assert.equal(player.woundRecoveryElapsedMinutes, 0);
  assert.equal(player.treatWounds(5), 1);
  assert.equal(player.woundSeverity, 0);
});

const { default: EventLog } = await import("../main/engine/EventLog.js");

test("il registro eventi persiste e viene ripristinato dopo un nuovo avvio", () => {
  storage.delete("project-exodus-event-log-v1");
  const first = new EventLog(30);
  first.add("Partenza da Biancavilla.", "Giorno 1, 08:00");
  first.add("Arrivo al Percorso 1.", "Giorno 1, 11:00");

  const restored = new EventLog(30);
  assert.equal(restored.getEntries().length, 2);
  assert.equal(restored.getEntries()[0].message, "Arrivo al Percorso 1.");
  assert.equal(restored.getEntries()[1].message, "Partenza da Biancavilla.");
});

test("il registro eventi conserva solo il numero massimo di voci", () => {
  storage.delete("project-exodus-event-log-v1");
  const log = new EventLog(3);
  log.add("Evento uno", "08:00");
  log.add("Evento due", "09:00");
  log.add("Evento tre", "10:00");
  log.add("Evento quattro", "11:00");

  assert.equal(log.getEntries().length, 3);
  assert.equal(log.getEntries()[0].message, "Evento quattro");
  assert.equal(log.getEntries()[2].message, "Evento due");
});

test("un registro salvato non valido non impedisce l'avvio", () => {
  storage.set("project-exodus-event-log-v1", "{dato rotto");
  const log = new EventLog(30);
  assert.deepEqual(log.getEntries(), []);
  log.add("Il sistema è operativo.", "12:00");
  assert.equal(new EventLog(30).getEntries()[0].message, "Il sistema è operativo.");
});

test("svuotare il registro persiste lo stato vuoto", () => {
  storage.delete("project-exodus-event-log-v1");
  const log = new EventLog(30);
  log.add("Da cancellare", "12:00");
  log.clear();
  assert.deepEqual(new EventLog(30).getEntries(), []);
});


test("il peso dell'inventario viene calcolato dalle quantità", () => {
  const inventory = new Inventory({ "bottiglia-acqua": 2, bende: 1 });
  assert.equal(inventory.getWeightKg(), 2.6);
});

test("l'inventario rifiuta oggetti che superano la capacità", () => {
  const inventory = new Inventory({ "kit-primo-soccorso": 9 });
  assert.equal(inventory.canAdd("bottiglia-acqua", 4), false);
  assert.throws(() => inventory.add("bottiglia-acqua", 4), /Peso massimo superato/);
  assert.equal(inventory.items["bottiglia-acqua"], undefined);
});

test("il limite di peso è di 12 kg e gli oggetti hanno un peso definito", () => {
  assert.equal(Inventory.MAX_WEIGHT_KG, 12);
  for (const item of Object.values(ITEMS)) {
    assert.ok(Number.isFinite(item.weight) && item.weight > 0);
  }
});


test("abbandonare oggetti aggiorna quantità e peso dell'inventario", () => {
  const inventory = new Inventory({ bacche: 5, "bottiglia-acqua": 1 });
  assert.equal(inventory.getWeightKg(), 2.1);
  inventory.remove("bacche", 1);
  assert.equal(inventory.items.bacche, 4);
  assert.ok(Math.abs(inventory.getWeightKg() - 1.9) < 1e-9);
  inventory.remove("bacche", 4);
  assert.equal(inventory.items.bacche, undefined);
  assert.equal(inventory.getWeightKg(), 1.1);
});

test("l'inventario rifiuta di abbandonare più oggetti di quelli posseduti", () => {
  const inventory = new Inventory({ bacche: 2 });
  assert.throws(() => inventory.remove("bacche", 3), /quantità sufficiente/i);
  assert.equal(inventory.items.bacche, 2);
});


const { default: LocationStorage } = await import("../main/engine/LocationStorage.js");

test("il deposito locale salva e ripristina oggetti separati per località", () => {
  storage.clear();
  assert.equal(LocationStorage.save("pallet", { "scatola-conserve": 3 }), true);
  assert.deepEqual(LocationStorage.load("pallet"), { "scatola-conserve": 3 });
  assert.deepEqual(LocationStorage.load("route1"), {});
});

test("il deposito scarta quantità non valide e oggetti sconosciuti", () => {
  storage.clear();
  LocationStorage.save("pallet", { "scatola-conserve": 2, "oggetto-fantasma": 8, bacche: -1 });
  assert.deepEqual(LocationStorage.load("pallet"), { "scatola-conserve": 2 });
});

test("il deposito rifiuta ID località non validi", () => {
  assert.throws(() => LocationStorage.key("../pallet"), /ID della località non valido/);
});


const { rollTravelEvent } = await import("../main/engine/TravelEvents.js");

test("gli eventi di viaggio non vengono sempre generati", () => {
  assert.equal(rollTravelEvent(() => 0.9), null);
});

test("un viaggio può generare un evento narrativo valido", () => {
  const values = [0.1, 0.5];
  const event = rollTravelEvent(() => values.shift());
  assert.equal(typeof event, "string");
  assert.ok(event.length > 10);
});

test("la selezione dell'evento gestisce gli estremi dell'indice", () => {
  const values = [0, 0.999999];
  const event = rollTravelEvent(() => values.shift());
  assert.equal(typeof event, "string");
});


const { rollTravelFind } = await import("../main/engine/TravelFinds.js");

test("i ritrovamenti di viaggio non avvengono quando il tiro supera la probabilità", () => {
  assert.equal(rollTravelFind("route1", () => 0.9), null);
});

test("i ritrovamenti di viaggio restituiscono bacche o erbe con quantità valida", () => {
  const berries = rollTravelFind("route1", (() => { const values = [0.1, 0.1]; return () => values.shift(); })());
  assert.equal(berries.itemId, "bacche");
  assert.equal(berries.quantity, 1);
  const herbs = rollTravelFind("route1", (() => { const values = [0.1, 0.9]; return () => values.shift(); })());
  assert.equal(herbs.itemId, "erbe");
  assert.equal(herbs.quantity, 1);
});

test("il generatore dei ritrovamenti rifiuta input non validi", () => {
  assert.throws(() => rollTravelFind("route1", null), TypeError);
});


test("i ritrovamenti dipendono dalla località raggiunta", () => {
  const urban = rollTravelFind("viridian", (() => { const values = [0.1, 0.1]; return () => values.shift(); })());
  assert.equal(urban.itemId, "bende");
  const rural = rollTravelFind("route1", (() => { const values = [0.1, 0.1]; return () => values.shift(); })());
  assert.equal(rural.itemId, "bacche");
});

test("una località sconosciuta usa il profilo di ritrovamenti predefinito", () => {
  const result = rollTravelFind("unknown", (() => { const values = [0.1, 0.1]; return () => values.shift(); })());
  assert.equal(result.itemId, "bacche");
});


const { rollTravelEncounter } = await import("../main/engine/TravelEncounters.js");

test("gli avvistamenti ambientali possono essere assenti", () => {
  assert.equal(rollTravelEncounter("route1", () => 0.9), null);
});

test("gli avvistamenti restituiscono descrizioni senza effetti di gioco", () => {
  const values = [0.1, 0.2];
  const encounter = rollTravelEncounter("route1", () => values.shift());
  assert.equal(typeof encounter, "string");
  assert.ok(encounter.length > 15);
});

test("le descrizioni degli avvistamenti dipendono dalla località", () => {
  const urbanValues = [0.1, 0.1];
  const ruralValues = [0.1, 0.1];
  const urban = rollTravelEncounter("viridian", () => urbanValues.shift());
  const rural = rollTravelEncounter("route1", () => ruralValues.shift());
  assert.notEqual(urban, rural);
});

test("il generatore di avvistamenti rifiuta input casuali non validi", () => {
  assert.throws(() => rollTravelEncounter("route1", null), TypeError);
});

const { inspectLocation, followClue } = await import("../main/engine/Exploration.js");

test("l'esplorazione produce indizi contestuali alla località", () => {
  const rural = inspectLocation("route1", () => 0);
  const urban = inspectLocation("viridian", () => 0);
  assert.equal(rural.title, "Erba schiacciata");
  assert.equal(urban.title, "Segno di passaggio");
  assert.notEqual(rural.title, urban.title);
});

test("l'esplorazione gestisce località sconosciute con un profilo predefinito", () => {
  assert.equal(inspectLocation("unknown", () => 0).title, "Erba schiacciata");
});

test("seguire una traccia restituisce esito e possibile ritrovamento", () => {
  const clue = inspectLocation("route1", () => 0);
  const result = followClue(clue);
  assert.match(result.message, /bacche/i);
  assert.equal(result.itemId, "bacche");
  assert.equal(result.quantity, 1);
});

test("seguire una traccia senza ritrovamenti non inventa oggetti", () => {
  const clue = inspectLocation("route1", () => 0.4);
  const result = followClue(clue);
  assert.equal(result.itemId, null);
  assert.equal(result.quantity, 0);
});

test("followClue rifiuta tracce non valide", () => {
  assert.throws(() => followClue(null), TypeError);
  assert.throws(() => followClue({ follow: " " }), TypeError);
});
