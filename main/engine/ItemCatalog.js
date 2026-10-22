const ITEMS = {
  "scatola-conserve": {
    id: "scatola-conserve",
    weight: 0.7,
    name: "Scatola di conserve",
    description: "Un pasto semplice, ancora sigillato.",
    category: "cibo",
    usable: true,
    hungerRecovery: 35,
    thirstRecovery: 0,
    energyRecovery: 10,
    healthRecovery: 0,
    woundRecovery: 0
  },
  "bottiglia-acqua": {
    id: "bottiglia-acqua",
    weight: 1.1,
    name: "Bottiglia d'acqua",
    description: "Acqua potabile in una bottiglia chiusa.",
    category: "acqua",
    usable: true,
    hungerRecovery: 0,
    thirstRecovery: 45,
    energyRecovery: 0,
    healthRecovery: 0,
    woundRecovery: 0
  },
  "bacche": {
    id: "bacche",
    weight: 0.2,
    name: "Bacche selvatiche",
    description: "Frutti raccolti durante l'esplorazione. Nutrono poco, ma possono aiutare.",
    category: "cibo",
    usable: true,
    hungerRecovery: 10,
    thirstRecovery: 0,
    energyRecovery: 0,
    healthRecovery: 0,
    woundRecovery: 0
  },
  "erbe": {
    id: "erbe",
    weight: 0.3,
    name: "Erbe spontanee",
    description: "Piante da identificare prima di qualsiasi utilizzo.",
    category: "risorsa",
    usable: false,
    hungerRecovery: 0,
    thirstRecovery: 0,
    energyRecovery: 0,
    healthRecovery: 0,
    woundRecovery: 0
  },
  "bende": {
    id: "bende",
    weight: 0.4,
    name: "Bende pulite",
    description: "Materiale medico essenziale. Può aiutare a trattare ferite lievi.",
    category: "medicina",
    usable: true,
    hungerRecovery: 0,
    thirstRecovery: 0,
    energyRecovery: 0,
    healthRecovery: 15,
    woundRecovery: 1
  },
  "kit-primo-soccorso": {
    id: "kit-primo-soccorso",
    weight: 1.2,
    name: "Kit di primo soccorso",
    description: "Un piccolo kit con garze, disinfettante e strumenti di base.",
    category: "medicina",
    usable: true,
    hungerRecovery: 0,
    thirstRecovery: 0,
    energyRecovery: 0,
    healthRecovery: 35,
    woundRecovery: 2
  }
};

export default ITEMS;
