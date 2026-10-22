import test from "node:test";
import assert from "node:assert/strict";

const storage = new Map();
globalThis.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); }
};

const { default: Discovery } = await import("../main/engine/Discovery.js");

test("i punti d'interesse cambiano in base alla località", () => {
  assert.equal(Discovery.points("pallet").length, 2);
  assert.equal(Discovery.points("route1").length, 2);
  assert.equal(Discovery.points("sconosciuta").length, 0);
});

test("una scoperta completata resta registrata dopo una nuova lettura", () => {
  assert.equal(Discovery.completed("pallet").includes("oak-gate"), false);
  assert.equal(Discovery.complete("pallet", "oak-gate"), true);
  assert.equal(Discovery.completed("pallet").includes("oak-gate"), true);
  assert.equal(Discovery.completed("route1").includes("oak-gate"), false);
});

test("gli indizi vengono salvati e ripristinati per località", () => {
  const clue = { title: "Traccia", detail: "Dettaglio", follow: "Esito" };
  assert.equal(Discovery.setClue("route1", clue), true);
  assert.deepEqual(Discovery.clue("route1"), clue);
  assert.equal(Discovery.clue("pallet"), null);
  assert.equal(Discovery.setClue("route1", null), true);
  assert.equal(Discovery.clue("route1"), null);
});

test("le informazioni di Mara sbloccano una pista aggiuntiva sul Percorso 1", () => {
  storage.delete("project-exodus-contacts-v1");
  assert.equal(Discovery.points("route1").some(point => point.id === "north-trail-marker"), false);
  storage.set("project-exodus-contacts-v1", JSON.stringify({ "mara-pallet": { informationHeard: true } }));
  assert.equal(Discovery.points("route1").some(point => point.id === "north-trail-marker"), true);
  assert.equal(Discovery.points("pallet").some(point => point.id === "north-trail-marker"), false);
});

test("le informazioni di Elio sbloccano il controllo del giunto a Smeraldopoli", () => {
  storage.delete("project-exodus-contacts-v1");
  assert.equal(Discovery.points("viridian").some(point => point.id === "signal-junction"), false);
  storage.set("project-exodus-contacts-v1", JSON.stringify({ "elio-route1": { informationHeard: true } }));
  assert.equal(Discovery.points("viridian").some(point => point.id === "signal-junction"), true);
  assert.equal(Discovery.points("route1").some(point => point.id === "signal-junction"), false);
});
