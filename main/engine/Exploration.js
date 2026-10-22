const CLUES = {
  pallet: [
    { title: "Orme vicino ai campi", detail: "Le impronte sono leggere e si dirigono verso la campagna. Non sembrano appartenere a qualcuno che stesse correndo.", follow: "Segui per qualche minuto le impronte: finiscono vicino a una recinzione rotta. Qualcuno passa ancora da queste parti." },
    { title: "Segni su una porta", detail: "Piccoli graffi recenti sul legno. Potrebbero essere di un Pokémon curioso, non necessariamente aggressivo.", follow: "Dietro la casa trovi peli impigliati nel legno, ma nessun animale. Meglio non inseguirlo oltre." },
    { title: "Fumo lontano", detail: "Una colonna sottile si confonde con il cielo. Potrebbe essere un camino o un fuoco da campo.", follow: "La direzione non è abbastanza chiara per raggiungere la fonte senza allontanarti troppo." }
  ],
  route1: [
    { title: "Erba schiacciata", detail: "Un passaggio stretto attraversa l'erba alta. Il movimento sembra recente e di piccola taglia.", follow: "Segui la traccia fino a un cespuglio pieno di bacche. Riesci a raccoglierne una manciata senza danneggiare la pianta.", itemId: "bacche", quantity: 1 },
    { title: "Impronte sovrapposte", detail: "Impronte umane e di Pokémon seguono la stessa direzione. Non puoi sapere se viaggiassero insieme.", follow: "Le tracce si perdono sul terreno duro. Hai guadagnato un'indicazione, non una destinazione." },
    { title: "Piume tra i rovi", detail: "Qualche piuma chiara è rimasta impigliata nei rovi. Il Pokémon che le ha perse potrebbe essere vicino.", follow: "Ti fermi ad ascoltare, ma la vegetazione resta immobile. Non c'è motivo di addentrarti nei rovi." }
  ],
  viridian: [
    { title: "Segno di passaggio", detail: "Un simbolo tracciato sul muro è recente. Potrebbe essere un riferimento lasciato da altri viaggiatori.", follow: "Trovi una freccia sbiadita che indica una strada secondaria. Non puoi sapere se sia ancora sicura." },
    { title: "Riparo improvvisato", detail: "Cartone e teli sono stati sistemati sotto una tettoia. Qualcuno potrebbe aver dormito qui, ma non stanotte.", follow: "Sotto il telo trovi una piccola scatola di conserve ancora chiusa.", itemId: "scatola-conserve", quantity: 1 },
    { title: "Rumore tra i detriti", detail: "Un rumore leggero arriva da un vicolo. Potrebbe essere un Pokémon in cerca di cibo o soltanto materiale mosso dal vento.", follow: "Ti avvicini senza fare rumore. Una sagoma scatta via tra i detriti, lasciandoti soltanto impronte." }
  ]
};

export function inspectLocation(locationId = "route1", random = Math.random) {
  if (typeof random !== "function") throw new TypeError("Il generatore casuale deve essere una funzione.");
  const clues = CLUES[locationId] ?? CLUES.route1;
  const index = Math.floor(random() * clues.length);
  return { ...clues[Math.min(clues.length - 1, Math.max(0, index))] };
}

export function followClue(clue) {
  if (!clue || typeof clue.follow !== "string" || !clue.follow.trim()) throw new TypeError("Traccia non valida.");
  return { message: clue.follow, itemId: clue.itemId ?? null, quantity: clue.quantity ?? 0 };
}

export default CLUES;
