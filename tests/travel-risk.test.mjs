import test from "node:test";
import assert from "node:assert/strict";
import { rollTravelEncounter } from "../main/engine/TravelEncounters.js";
import { rollTravelEvent } from "../main/engine/TravelEvents.js";

test("la probabilità di incontro è configurabile per il rischio del percorso", () => {
  assert.equal(rollTravelEncounter("route1", () => 0.3, 0.25), null);
  assert.match(rollTravelEncounter("route1", () => 0.3, 0.45), /./);
});

test("la probabilità degli eventi di viaggio è configurabile", () => {
  assert.equal(rollTravelEvent(() => 0.5, 0.4), null);
  assert.match(rollTravelEvent(() => 0.5, 0.6), /./);
});

test("le probabilità fuori intervallo vengono limitate", () => {
  assert.match(rollTravelEncounter("route1", () => 0.99, 2), /./);
  assert.equal(rollTravelEvent(() => 0.01, -1), null);
});
