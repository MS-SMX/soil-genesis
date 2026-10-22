const FINDS_BY_ROUTE = {
  route1: [
    { itemId: "bacche", quantity: 1, message: "Tra la vegetazione trovi alcune bacche selvatiche." },
    { itemId: "erbe", quantity: 1, message: "Individui alcune erbe spontanee, da identificare prima di usarle." }
  ],
  pallet: [
    { itemId: "bacche", quantity: 1, message: "Vicino al margine del paese trovi alcune bacche selvatiche." },
    { itemId: "erbe", quantity: 1, message: "Tra le crepe di un vecchio giardino crescono alcune erbe spontanee." }
  ],
  viridian: [
    { itemId: "bende", quantity: 1, message: "In un ripostiglio lungo la strada trovi una confezione di bende ancora sigillata." },
    { itemId: "scatola-conserve", quantity: 1, message: "Sotto alcuni detriti trovi una scatola di conserve ancora chiusa." }
  ]
};

/** Ritrovamento occasionale coerente con la località raggiunta. */
export function rollTravelFind(locationId = "route1", random = Math.random) {
  if (typeof random !== "function") {
    throw new TypeError("Il generatore casuale deve essere una funzione.");
  }
  if (random() >= 0.2) return null;
  const finds = FINDS_BY_ROUTE[locationId] ?? FINDS_BY_ROUTE.route1;
  const index = Math.floor(random() * finds.length);
  return { ...finds[Math.min(finds.length - 1, Math.max(0, index))] };
}

export default FINDS_BY_ROUTE;
