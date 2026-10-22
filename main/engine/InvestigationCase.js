import Discovery from "./Discovery.js";
import FieldNotebook from "./FieldNotebook.js";
import ContactRegistry from "./ContactRegistry.js";

/** Stato derivato dal mondo già salvato: nessun nuovo salvataggio o reset richiesto. */
export function northTrailCase() {
  const mara = ContactRegistry.get("mara-pallet");
  const elio = ContactRegistry.get("elio-route1");
  const heardMara = Boolean(mara?.informationHeard);
  const trailChecked = Discovery.completed("route1").includes("north-trail-marker");
  const heardElio = Boolean(elio?.informationHeard);
  const notebook = FieldNotebook.entries();
  const hasMaraSource = notebook.some(entry => entry.sourceName === "Mara" && /informazione/i.test(entry.title));
  const hasTrailSource = notebook.some(entry => entry.locationId === "route1" && /sentiero nord|tracce/i.test(entry.title));
  const hasElioSource = notebook.some(entry => entry.sourceName === "Elio" && /informazione/i.test(entry.title));

  if (!heardMara) {
    return {
      id: "north-trail",
      title: "Tracce verso nord",
      status: "non iniziata",
      progress: 0,
      steps: [
        { done: false, text: "Parla con Mara a Biancavilla e chiedile informazioni sul sentiero nord." },
        { done: false, text: "Raggiungi il Percorso 1 ed esamina il segno sul sentiero nord." },
        { done: false, text: "Confronta la traccia con ciò che sa Elio." }
      ],
      conclusion: "Una pista locale è disponibile, ma devi prima raccogliere una testimonianza."
    };
  }

  const steps = [
    { done: heardMara, text: "Testimonianza di Mara sul passaggio verso nord", source: hasMaraSource },
    { done: trailChecked, text: "Esamina il segno sul sentiero nord al Percorso 1", source: hasTrailSource },
    { done: heardElio, text: "Chiedi a Elio cosa ha visto vicino alla recinzione", source: hasElioSource }
  ];
  const progress = steps.filter(step => step.done).length;
  return {
    id: "north-trail",
    title: "Tracce verso nord",
    status: progress === 3 ? "indizi raccolti, conclusione aperta" : "in corso",
    progress,
    steps,
    conclusion: progress === 3
      ? "Mara riferisce un passaggio leggero verso nord; sul sentiero trovi segni compatibili e Elio descrive una recinzione aperta. Le fonti convergono sull'esistenza di passaggi recenti, ma non identificano chi sia passato né dove sia andato. Non è una soluzione definitiva."
      : "Le osservazioni e le testimonianze non sono ancora complete. Le tappe restano aperte e nessuna deduzione viene trattata come un fatto confermato."
  };
}
