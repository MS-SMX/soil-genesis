import test from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(key, String(value)); },
  removeItem(key) { store.delete(key); }
};

const { default: ContactRegistry } = await import("../main/engine/ContactRegistry.js");
const { default: Discovery } = await import("../main/engine/Discovery.js");
const { default: FieldNotebook } = await import("../main/engine/FieldNotebook.js");
const { northTrailCase } = await import("../main/engine/InvestigationCase.js");

test("il dossier indica la prima tappa finché Mara non condivide informazioni", () => {
  store.clear();
  const state = northTrailCase();
  assert.equal(state.progress, 0);
  assert.equal(state.status, "non iniziata");
});

test("il dossier avanza solo con le informazioni e la scoperta persistenti", () => {
  store.clear();
  ContactRegistry.meet("pallet");
  ContactRegistry.markInformationHeard("mara-pallet");
  assert.equal(northTrailCase().progress, 1);
  Discovery.complete("route1", "north-trail-marker");
  assert.equal(northTrailCase().progress, 2);
  ContactRegistry.meet("route1");
  ContactRegistry.markInformationHeard("elio-route1");
  const state = northTrailCase();
  assert.equal(state.progress, 3);
  assert.equal(state.status, "indizi raccolti, conclusione aperta");
  assert.match(state.conclusion, /non identificano chi sia passato/);
});

test("le note del dossier non dichiarano una fonte presente se manca dal taccuino", () => {
  store.clear();
  ContactRegistry.meet("pallet");
  ContactRegistry.markInformationHeard("mara-pallet");
  const state = northTrailCase();
  assert.equal(state.steps[0].done, true);
  assert.equal(state.steps[0].source, false);
  FieldNotebook.add({ locationId: "pallet", locationName: "Biancavilla", title: "Informazione da Mara", detail: "Passaggi a nord", category: "Informazione", sourceType: "character", sourceName: "Mara" });
  assert.equal(northTrailCase().steps[0].source, true);
});
