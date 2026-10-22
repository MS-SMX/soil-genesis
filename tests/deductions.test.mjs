import test from "node:test";
import assert from "node:assert/strict";
const storage = new Map();
globalThis.localStorage = { getItem(k) { return storage.has(k) ? storage.get(k) : null; }, setItem(k,v) { storage.set(k,String(v)); }, removeItem(k) { storage.delete(k); } };
const { default: DeductionBoard } = await import("../main/engine/DeductionBoard.js");
test("le ipotesi si salvano senza effetto implicito sul mondo", () => {
  assert.equal(DeductionBoard.add({ title: "Pannello usato", evidence: "Elio riferisce interruzioni; il giunto mostra interventi", location: "viridian", status: "plausible", now: "giorno 1" }), true);
  const [item] = DeductionBoard.list();
  assert.equal(item.status, "plausible"); assert.equal(item.location, "viridian"); assert.equal(item.updatedAt, "giorno 1");
});
test("stato modificabile e ipotesi eliminabile", () => {
  const [item] = DeductionBoard.list();
  assert.equal(DeductionBoard.updateStatus(item.id, "rejected", "giorno 2"), true);
  assert.equal(DeductionBoard.list()[0].status, "rejected");
  assert.equal(DeductionBoard.remove(item.id), true); assert.equal(DeductionBoard.list().length, 0);
});
test("rifiuta ipotesi vuote e stati sconosciuti", () => {
  assert.equal(DeductionBoard.add({ title: " ", evidence: "x" }), false);
  assert.equal(DeductionBoard.add({ title: "x", evidence: "y", status: "world-change" }), false);
});
test("tollera storage corrotto", () => { storage.set("exodus.hypotheses.v1", "{"); assert.deepEqual(DeductionBoard.list(), []); });
