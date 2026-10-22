import test from "node:test";
import assert from "node:assert/strict";
const storage = new Map();
globalThis.localStorage = { getItem(k) { return storage.has(k) ? storage.get(k) : null; }, setItem(k,v) { storage.set(k,String(v)); }, removeItem(k) { storage.delete(k); } };
const { default: ContactRegistry, CONTACTS } = await import("../main/engine/ContactRegistry.js");
test("ogni località principale ha un contatto definito", () => {
  assert.deepEqual(Object.keys(CONTACTS).sort(), ["pallet", "route1", "viridian"]);
  for (const contact of Object.values(CONTACTS)) assert.ok(contact.name && contact.dialogue && contact.information);
});
test("un contatto incontrato resta registrato", () => {
  const contact = ContactRegistry.meet("pallet");
  assert.equal(contact.name, "Mara");
  assert.equal(ContactRegistry.hasMet("mara-pallet"), true);
  assert.equal(ContactRegistry.all().length, 1);
});
test("le informazioni possono essere registrate una sola volta", () => {
  ContactRegistry.meet("route1");
  assert.equal(ContactRegistry.markInformationHeard("elio-route1"), true);
  assert.equal(ContactRegistry.markInformationHeard("elio-route1"), false);
  assert.equal(ContactRegistry.get("elio-route1").informationHeard, true);
});
test("località sconosciute non inventano contatti", () => {
  ContactRegistry.clear();
  assert.equal(ContactRegistry.meet("unknown"), null);
  assert.equal(ContactRegistry.all().length, 0);
});
test("il registro tollera dati corrotti", () => {
  storage.set("project-exodus-contacts-v1", "non-json");
  assert.deepEqual(ContactRegistry.all(), []);
});

test("il contatto locale è individuabile senza un incontro casuale", () => {
  ContactRegistry.clear();
  assert.equal(ContactRegistry.at("pallet").name, "Mara");
  assert.equal(ContactRegistry.at("route1").name, "Elio");
  assert.equal(ContactRegistry.at("viridian").name, "Nives");
  assert.equal(ContactRegistry.at("unknown"), null);
});
test("l'incontro locale viene memorizzato con data", () => {
  ContactRegistry.clear();
  ContactRegistry.meet("pallet");
  assert.equal(ContactRegistry.recordMeeting("mara-pallet", "giorno 1, 12:00"), true);
  assert.equal(ContactRegistry.at("pallet").metAt, "giorno 1, 12:00");
});


test("le conversazioni successive ricordano gli incontri precedenti", () => {
  ContactRegistry.clear();
  const contact = ContactRegistry.meet("pallet");
  assert.match(ContactRegistry.dialogueFor(contact.id), /Non vendo promesse/);
  assert.equal(ContactRegistry.recordConversation(contact.id), true);
  assert.equal(ContactRegistry.recordConversation(contact.id), true);
  assert.match(ContactRegistry.dialogueFor(contact.id), /Ci siamo già parlati/);
  assert.equal(ContactRegistry.get(contact.id).conversationCount, 2);
});

test("le informazioni possono collegare indizi di personaggi diversi", () => {
  ContactRegistry.clear();
  const mara = ContactRegistry.meet("pallet");
  ContactRegistry.markInformationHeard(mara.id);
  const elio = ContactRegistry.meet("route1");
  assert.match(ContactRegistry.informationFor(elio.id), /Mara/);
  ContactRegistry.markInformationHeard(elio.id);
  const nives = ContactRegistry.meet("viridian");
  assert.match(ContactRegistry.informationFor(nives.id), /recinzione aperta/);
});

test("il confronto delle testimonianze richiede entrambe le informazioni e si registra una sola volta per contatto", () => {
  ContactRegistry.clear();
  const mara = ContactRegistry.meet("pallet");
  const elio = ContactRegistry.meet("route1");
  assert.equal(ContactRegistry.canCompareTrailClues(mara.id), false);
  ContactRegistry.markInformationHeard(mara.id);
  assert.equal(ContactRegistry.canCompareTrailClues(elio.id), false);
  ContactRegistry.markInformationHeard(elio.id);
  assert.equal(ContactRegistry.canCompareTrailClues(mara.id), true);
  assert.match(ContactRegistry.trailClueComparisonFor(mara.id), /non chi/);
  assert.equal(ContactRegistry.markTrailCluesCompared(mara.id), true);
  assert.equal(ContactRegistry.canCompareTrailClues(mara.id), false);
  assert.equal(ContactRegistry.canCompareTrailClues(elio.id), true);
  assert.equal(ContactRegistry.markTrailCluesCompared(mara.id), false);
});
