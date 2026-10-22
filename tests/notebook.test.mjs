import test from "node:test";
import assert from "node:assert/strict";

const storage = new Map();
globalThis.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); }
};

const { default: FieldNotebook } = await import("../main/engine/FieldNotebook.js");

test("il taccuino conserva annotazioni tra letture", () => {
  assert.equal(FieldNotebook.add({ locationId: "route1", locationName: "Percorso 1", title: "Impronte", detail: "Passaggio recente", category: "Traccia umana", timestamp: "Giorno 1" }), true);
  assert.equal(FieldNotebook.entries().length, 1);
  assert.equal(FieldNotebook.entries()[0].locationName, "Percorso 1");
});

test("il taccuino evita annotazioni identiche", () => {
  const entry = { locationId: "route1", locationName: "Percorso 1", title: "Impronte", detail: "Passaggio recente" };
  FieldNotebook.add(entry);
  FieldNotebook.add(entry);
  assert.equal(FieldNotebook.entries().length, 1);
});

test("il taccuino rifiuta contenuti vuoti e limita le voci", () => {
  assert.equal(FieldNotebook.add({ title: " ", detail: "test" }), false);
  for (let i = 0; i < 45; i++) FieldNotebook.add({ locationId: "pallet", title: `Voce ${i}`, detail: `Dettaglio ${i}` });
  assert.equal(FieldNotebook.entries().length, 40);
});

test("il taccuino tollera dati salvati corrotti", () => {
  storage.set("project-exodus-field-notebook-v1", "non-json");
  assert.deepEqual(FieldNotebook.entries(), []);
});


test("il taccuino conserva provenienza, personaggio e contesto", () => {
  FieldNotebook.clear();
  FieldNotebook.add({ locationId: "pallet", locationName: "Biancavilla", title: "Voce di Mara", detail: "Ha visto un veicolo", category: "Informazione", sourceType: "character", sourceName: "Mara", context: "Colloquio vicino al laboratorio" });
  const entry = FieldNotebook.entries()[0];
  assert.equal(entry.sourceType, "character");
  assert.equal(entry.sourceName, "Mara");
  assert.equal(entry.context, "Colloquio vicino al laboratorio");
});

test("il taccuino normalizza classificazioni di provenienza non valide", () => {
  FieldNotebook.clear();
  FieldNotebook.add({ title: "Dato", detail: "Dettaglio", sourceType: "inventato" });
  assert.equal(FieldNotebook.entries()[0].sourceType, "unclassified");
});
