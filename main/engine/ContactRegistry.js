const KEY = "project-exodus-contacts-v1";

export const CONTACTS = {
  pallet: {
    id: "mara-pallet", name: "Mara", role: "Raccoglitrice e manutentrice", intro: "Tiene insieme un piccolo orto ai margini di Biancavilla e controlla chi passa sulla strada.",
    dialogue: "Non vendo promesse. Se una cosa non l'ho vista, non te la racconto come vera.",
    information: "Negli ultimi giorni il sentiero verso nord è stato percorso più spesso del solito. Le impronte sono leggere e non sembrano quelle di un gruppo numeroso.", topic: "sentiero-nord"
  },
  route1: {
    id: "elio-route1", name: "Elio", role: "Viaggiatore di passaggio", intro: "Ha sistemato un riparo provvisorio sotto una copertura di fortuna. Tiene lo zaino vicino e non si fida facilmente.",
    dialogue: "Non sono qui per fare amicizia. Ma non ho motivo di mentirti, finché non mi dai un motivo.",
    information: "Più a nord ho trovato una recinzione aperta e segni di passaggio recente. Non ho seguito le tracce: il terreno era troppo esposto.", topic: "recinzione-aperta"
  },
  viridian: {
    id: "nives-viridian", name: "Nives", role: "Riparatrice", intro: "Lavora vicino a un edificio danneggiato, recuperando cavi e parti ancora utilizzabili.",
    dialogue: "Se cerchi una guida, non sono la persona giusta. Se cerchi di capire cosa funziona ancora, forse sì.",
    information: "Un vecchio pannello di segnalazione si riattiva a intermittenza dopo il tramonto. Non trasmette messaggi leggibili, ma indica che una parte della rete ha ancora alimentazione.", topic: "pannello-intermittente"
  }
};

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "{}");
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch { return {}; }
}
function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}
export default class ContactRegistry {
  static all() { return Object.values(read()).map(entry => ({ ...entry })); }
  static at(locationId) {
    const contact = CONTACTS[locationId];
    if (!contact) return null;
    const savedData = read();
    const saved = savedData[contact.id] || {};
    // Compatibilità: i contatti incontrati nelle versioni precedenti non avevano metAt.
    const metAt = savedData[contact.id]
      ? (saved.metAt || "già incontrato")
      : "";
    return { ...contact, ...saved, metAt, locationId };
  }
  static get(id) { const entry = read()[id]; return entry ? { ...entry } : null; }
  static meet(locationId) {
    const contact = CONTACTS[locationId];
    if (!contact) return null;
    const data = read();
    if (!data[contact.id]) data[contact.id] = { id: contact.id, name: contact.name, role: contact.role, locationId, metAt: "", informationHeard: false };
    write(data);
    return { ...contact, ...data[contact.id] };
  }
  static recordMeeting(id, metAt) {
    const data = read();
    if (!data[id]) return false;
    data[id].metAt = String(metAt || "");
    return write(data);
  }
  static dialogueFor(id) {
    const data = read();
    const contact = Object.values(CONTACTS).find(entry => entry.id === id);
    if (!contact) return "La conversazione non trova un appiglio.";
    const conversations = Number(data[id]?.conversationCount || 0);
    const heardMara = Boolean(data[CONTACTS.pallet.id]?.informationHeard);
    const heardElio = Boolean(data[CONTACTS.route1.id]?.informationHeard);
    const heardNives = Boolean(data[CONTACTS.viridian.id]?.informationHeard);

    if (id === CONTACTS.pallet.id && heardElio) return "Sei tornato. Le tracce e la recinzione di cui parlava Elio sembrano appartenere allo stesso percorso. Non è una prova, ma vale la pena controllare.";
    if (id === CONTACTS.route1.id && heardMara) return "Mara ti ha parlato del sentiero a nord? Allora la recinzione aperta che ho visto potrebbe essere lungo quella stessa traccia. Non ho seguito il percorso abbastanza da esserne certo.";
    if (id === CONTACTS.viridian.id && heardElio) return "I segni di passaggio vicino alla recinzione potrebbero spiegare le brevi interruzioni del pannello. Non posso dimostrare un collegamento, ma ora abbiamo due anomalie nella stessa direzione.";
    if (conversations > 0) return `${contact.dialogue} Ci siamo già parlati: se hai qualcosa di concreto, dimmelo senza girarci intorno.`;
    return contact.dialogue;
  }
  static recordConversation(id) {
    const data = read();
    if (!data[id]) return false;
    data[id].conversationCount = Math.max(0, Number(data[id].conversationCount || 0)) + 1;
    return write(data);
  }
  static informationFor(id) {
    const data = read();
    const contact = Object.values(CONTACTS).find(entry => entry.id === id);
    if (!contact) return "Non ci sono informazioni disponibili.";
    const heardMara = Boolean(data[CONTACTS.pallet.id]?.informationHeard);
    const heardElio = Boolean(data[CONTACTS.route1.id]?.informationHeard);
    if (id === CONTACTS.route1.id && heardMara) return "La recinzione aperta è a nord e le impronte sembrano seguire una traccia leggera. Potrebbe essere il sentiero di cui parlava Mara, ma non ho seguito le orme fino in fondo.";
    if (id === CONTACTS.viridian.id && heardElio) return "Il pannello intermittente e la recinzione aperta potrebbero essere collegati: ho notato che il segnale si interrompe dopo rumori provenienti da nord. È un indizio, non una certezza.";
    if (id === CONTACTS.pallet.id && heardElio) return "Le impronte sul sentiero nord sembrano compatibili con quelle vicino alla recinzione aperta descritta da Elio. Non indicano quante persone siano passate, né dove siano finite.";
    return contact.information;
  }
  static markInformationHeard(id) {
    const data = read();
    if (!data[id]) return false;
    if (data[id].informationHeard) return false;
    data[id].informationHeard = true;
    return write(data);
  }
  static canCompareTrailClues(id) {
    const data = read();
    const maraHeard = Boolean(data[CONTACTS.pallet.id]?.informationHeard);
    const elioHeard = Boolean(data[CONTACTS.route1.id]?.informationHeard);
    const contactKnown = id === CONTACTS.pallet.id || id === CONTACTS.route1.id;
    return contactKnown && maraHeard && elioHeard && !data[id]?.trailCluesCompared;
  }
  static trailClueComparisonFor(id) {
    if (!this.canCompareTrailClues(id)) return null;
    if (id === CONTACTS.pallet.id) {
      return "Le impronte che ho visto e la recinzione descritta da Elio sembrano compatibili con lo stesso passaggio. Posso dirti che la pista merita di essere seguita, non chi l'ha lasciata né dove porti.";
    }
    if (id === CONTACTS.route1.id) {
      return "Mara ha osservato impronte leggere e io ho visto la recinzione aperta. Potrebbero essere parti dello stesso percorso, ma non ho seguito le tracce e non posso garantire che siano della stessa persona.";
    }
    return null;
  }
  static markTrailCluesCompared(id) {
    if (!this.canCompareTrailClues(id)) return false;
    const data = read();
    data[id].trailCluesCompared = true;
    return write(data);
  }
  static hasMet(id) { return Boolean(read()[id]); }
  static clear() { try { localStorage.removeItem(KEY); return true; } catch { return false; } }
}
