const KEY = "project-exodus-discovery-v1";
const CONTACT_KEY = "project-exodus-contacts-v1";

const POINTS = {
  pallet: [
    { id: "oak-gate", title: "Cancello della casa di Oak", description: "Il cancello è chiuso, ma il sentiero è stato spazzato di recente. Qualcuno mantiene ancora in ordine l'accesso.", action: "Esamina il sentiero", result: "Trovi segni di passaggi recenti e una striscia di stoffa impigliata alla rete. Nessuna prova che Oak sia uscito oggi, ma la casa non è del tutto dimenticata.", minutes: 15, energy: 3 },
    { id: "old-well", title: "Pozzo comunale", description: "Il vecchio pozzo è coperto da assi. Non sai se l'acqua sia potabile.", action: "Controlla la copertura", result: "Le assi sono solide e qualcuno ha lasciato un segno di gesso sul bordo. Non rischi di bere acqua non verificata, ma ora sai che il pozzo viene controllato.", minutes: 10, energy: 2 }
  ],
  route1: [
    { id: "broken-fence", title: "Recinzione divelta", description: "Una sezione della recinzione è piegata verso l'esterno. Le impronte si sovrappongono e non sono tutte recenti.", action: "Esamina le impronte", result: "Individui impronte leggere e altre più profonde, forse di una persona con uno zaino. La traccia è troppo confusa per seguirla con sicurezza.", minutes: 15, energy: 4 },
    { id: "roadside-cache", title: "Riparo sotto il cavalcavia", description: "Cartone asciutto e cenere fredda indicano un bivacco non recente. Non è detto che chi l'ha usato sia lontano.", action: "Controlla il bivacco", result: "Sotto un pannello trovi un involucro vuoto e una nota illeggibile per la pioggia. Qualcuno è passato di qui, ma non ha lasciato provviste utilizzabili.", minutes: 20, energy: 5 }
  ],
  viridian: [
    { id: "blocked-alley", title: "Vicolo ostruito", description: "Mattoni e vecchi cartelli bloccano metà del passaggio. Una via laterale resta percorribile, almeno per ora.", action: "Verifica il passaggio", result: "La via laterale è praticabile a piedi, ma il pavimento cede vicino al muro. Memorizzi il punto da evitare durante il ritorno.", minutes: 15, energy: 4 },
    { id: "marked-wall", title: "Muro segnato", description: "Tre tratti obliqui sono stati dipinti sul muro. Potrebbero essere un codice locale o semplici indicazioni.", action: "Studia i segni", result: "I segni sembrano indicare una direzione, ma manca una parte del simbolo. Li registri come indizio, non come una rotta affidabile.", minutes: 10, energy: 3 }
  ]
};

function readState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}
function readContacts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}
function writeState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export default class Discovery {
  static points(locationId) {
    const points = [...(POINTS[locationId] || [])];
    const contacts = readContacts();

    // Le informazioni ricevute dai personaggi trasformano alcuni luoghi già noti
    // in piste investigabili, senza cancellare o resettare i progressi esistenti.
    if (locationId === "route1" && contacts["mara-pallet"]?.informationHeard) {
      points.push({
        id: "north-trail-marker",
        title: "Segno sul sentiero nord",
        description: "Dopo aver parlato con Mara, riconosci una sequenza di impronte leggere che coincide con la sua descrizione. Un piccolo segno sul paletto sembra indicare che qualcuno abbia deviato verso il margine della strada.",
        action: "Confronta le tracce",
        result: "Le impronte leggere e il segno sul paletto combaciano con la direzione descritta da Mara. Non identificano chi è passato, ma confermano che il sentiero nord è stato usato di recente.",
        minutes: 15,
        energy: 4
      });
    }

    if (locationId === "viridian" && contacts["elio-route1"]?.informationHeard) {
      points.push({
        id: "signal-junction",
        title: "Giunto di alimentazione del pannello",
        description: "Le informazioni di Elio danno un senso alle interruzioni del pannello. Puoi controllare il punto in cui il cavo scompare sotto i detriti.",
        action: "Controlla il giunto",
        result: "Il cavo è stato scollegato e ricollegato più volte; non sembra un guasto casuale. La traccia non prova che qualcuno stia usando il pannello per comunicare, ma conferma un intervento recente sulla rete.",
        minutes: 20,
        energy: 5
      });
    }

    return points.map(point => ({ ...point }));
  }

  static completed(locationId) {
    const state = readState();
    return Array.isArray(state[locationId]?.completed) ? state[locationId].completed : [];
  }

  static complete(locationId, pointId) {
    const state = readState();
    if (!state[locationId]) state[locationId] = { completed: [], clue: null };
    if (!Array.isArray(state[locationId].completed)) state[locationId].completed = [];
    if (!state[locationId].completed.includes(pointId)) state[locationId].completed.push(pointId);
    return writeState(state);
  }

  static clue(locationId) {
    const state = readState();
    const clue = state[locationId]?.clue;
    return clue && typeof clue.title === "string" && typeof clue.detail === "string" && typeof clue.follow === "string"
      ? { ...clue } : null;
  }

  static setClue(locationId, clue) {
    const state = readState();
    if (!state[locationId]) state[locationId] = { completed: [], clue: null };
    state[locationId].clue = clue ? { ...clue } : null;
    return writeState(state);
  }
}
