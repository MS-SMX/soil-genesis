const EVENTS = [
  "A lato della strada trovi impronte recenti, ma chi le ha lasciate è già lontano.",
  "Un vecchio fuoco è ancora circondato da cenere e lattine vuote. Qualcuno è passato di qui.",
  "Un cartello piegato indica una deviazione ormai impraticabile. Prosegui con cautela.",
  "Tra l'erba alta scorgi i resti di un piccolo accampamento, abbandonato da tempo.",
  "In lontananza senti un rumore metallico. Quando raggiungi il punto, non trovi nessuno.",
  "Un tratto del percorso è invaso dalla vegetazione. Lo superi senza perdere la direzione."
];

/** Restituisce un evento narrativo per una parte dei viaggi, senza effetti casuali sulle statistiche. */
export function rollTravelEvent(random = Math.random, chance = 0.4) {
  if (typeof random !== "function") throw new TypeError("Il generatore casuale deve essere una funzione.");
  const probability = Number.isFinite(chance) ? Math.min(1, Math.max(0, chance)) : 0.4;
  if (random() >= probability) return null;
  const index = Math.floor(random() * EVENTS.length);
  return EVENTS[Math.min(EVENTS.length - 1, Math.max(0, index))];
}

export default EVENTS;
