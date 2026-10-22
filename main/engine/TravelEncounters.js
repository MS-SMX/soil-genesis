const ENCOUNTERS_BY_LOCATION = {
  pallet: [
    "Dal margine del paese arriva il richiamo rauco di un Pokémon selvatico; quando ti fermi, il rumore cessa.",
    "Nel terreno umido riconosci piccole impronte di un Pokémon. Sono fresche, ma conducono verso i campi.",
    "Una finestra si muove appena in una casa apparentemente vuota. Non riesci a capire se ci sia qualcuno dentro."
  ],
  route1: [
    "L'erba si piega in una striscia stretta: qualcosa di piccolo è passato da poco e si è nascosto nella vegetazione.",
    "Senti frusciare un cespuglio e intravedi una sagoma di Pokémon tra le foglie. Non si avvicina.",
    "Trovi impronte umane recenti accanto a quelle di un Pokémon, dirette verso il margine del sentiero."
  ],
  viridian: [
    "Da un edificio sventrato arriva un breve verso di Pokémon, seguito da un silenzio improvviso.",
    "Sul muro di un vicolo qualcuno ha lasciato un segno recente. Potrebbe essere un'indicazione per altri viaggiatori.",
    "Un piccolo Pokémon fruga tra i rifiuti dall'altra parte della strada e fugge appena ti nota."
  ]
};

/** Restituisce un incontro osservativo, senza avviare combattimenti o modificare le statistiche. */
export function rollTravelEncounter(locationId = "route1", random = Math.random, chance = 0.25) {
  if (typeof random !== "function") {
    throw new TypeError("Il generatore casuale deve essere una funzione.");
  }
  const probability = Number.isFinite(chance) ? Math.min(1, Math.max(0, chance)) : 0.25;
  if (random() >= probability) return null;
  const encounters = ENCOUNTERS_BY_LOCATION[locationId] ?? ENCOUNTERS_BY_LOCATION.route1;
  const index = Math.floor(random() * encounters.length);
  return encounters[Math.min(encounters.length - 1, Math.max(0, index))];
}

export default ENCOUNTERS_BY_LOCATION;
