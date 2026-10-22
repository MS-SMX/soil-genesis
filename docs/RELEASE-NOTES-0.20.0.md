# Soil Genesis 0.20.0 — Regole fitosanitarie per Brassicaceae e Allium

## Aggiunto
- Aggiunta una regola condizionale per clubroot / ernia del cavolo, con pausa indicativa di sette anni quando la malattia è menzionata nello storico e la coltura attuale include Brassicaceae. La raccomandazione include limiti, controllo delle infestanti ospiti e rischio di movimento di suolo contaminato.
- Aggiunta una regola per il marciume bianco degli Allium (*Stromatinia cepivora*, sinonimo storico *Sclerotium cepivorum*). L'avviso resta attivo anche dopo dieci anni, perché la persistenza può essere molto più lunga e la rotazione da sola è limitata.
- Aggiunti i collegamenti alle fonti universitarie nel pannello “Base scientifica e limiti del controllo”.
- Documentate le nuove regole e la distinzione fra intervallo operativo, sopravvivenza del patogeno e garanzia di controllo.

## Cautela
- Le regole si attivano solo se la malattia è esplicitamente menzionata nelle note della stessa parcella; il software non diagnostica patogeni.
- Per il clubroot il controllo usa la famiglia Brassicaceae come proxy. Le infestanti ospiti, il pH, il drenaggio e il movimento di terreno non sono ancora modellati come dati strutturati.
- Per il marciume bianco degli Allium la persistenza può raggiungere decenni: superare dieci anni non è considerato una prova di assenza del patogeno. Non usare la rotazione come unica misura.

## Fonti aggiunte
- University of Connecticut IPM, [Clubroot of Crucifers](https://ipm.cahnr.uconn.edu/clubroot-of-crucifers/): almeno sette anni fuori dalle Brassicaceae quando il clubroot è confermato, più controllo delle infestanti ospiti e prevenzione del movimento di suolo.
- Washington State University Hortsense, [Onions, Garlic: White rot](https://hortsense.cahnrs.wsu.edu/fact-sheet/onions-garlic-white-rot/): intervallo di 8–10 anni nei suoli infestati, con persistenza lunga e necessità di prevenire lo spostamento di suolo e materiale contaminato.
- University of Maryland Extension, [White Rot of Onion and Garlic](https://extension.umd.edu/resource/white-rot-onion-and-garlic/): chiarisce che il marciume bianco degli Allium è distinto dal white mold da *Sclerotinia sclerotiorum* e che gli sclerozi possono sopravvivere per 20–40 anni.

## Verifiche
- `node --check` su `assets/js/regeneration-diary.js`: superato.
- Controllo manuale delle nuove regole e dei collegamenti: superato.
- Build Jekyll completa e test nel browser: non eseguiti in questo ambiente.
