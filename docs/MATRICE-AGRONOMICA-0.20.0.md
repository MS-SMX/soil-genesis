# Soil Genesis 0.20.0 — Estensione della matrice fitosanitaria

Questa nota documenta le due nuove regole condizionali. Le regole si attivano soltanto quando il nome della malattia è presente nelle note del piano o in un evento del Registro associato alla stessa parcella. La menzione può essere un sospetto e non equivale a diagnosi confermata.

## Regole aggiunte

| Malattia esplicitamente menzionata | Colture che il software considera ospiti | Intervallo operativo | Interpretazione e limiti |
|---|---|---|---|
| Clubroot / ernia del cavolo (*Plasmodiophora brassicae*) | Brassicaceae, identificate dalla famiglia registrata; alcuni nomi comuni di brassicacee sono riconosciuti come fallback | 7 anni | La University of Connecticut Extension indica sette anni fuori dalle Brassicaceae quando il clubroot è confermato. Le spore possono persistere a lungo; controllare infestanti ospiti, drenaggio e movimento di suolo. La rotazione non garantisce eradicazione. |
| Marciume bianco degli Allium (*Stromatinia cepivora*, sinonimo *Sclerotium cepivorum*) | Famiglie registrate come Alliaceae o Amaryllidaceae e nomi comuni come aglio, cipolla, porro, scalogno, cipollotto ed erba cipollina | 10 anni come soglia minima di avviso, ma avviso persistente anche oltre | WSU Hortsense suggerisce di non coltivare Allium più spesso di una volta ogni 8–10 anni nei suoli infestati; University of Maryland Extension segnala sopravvivenza degli sclerozi per 20–40 anni e limiti della rotazione. Il controllo non cancella l'avviso solo perché sono trascorsi dieci anni. |

## Perché il marciume bianco non si comporta come una normale soglia

Una pausa di dieci anni non dimostra che il patogeno sia scomparso. Per questo la regola resta attiva finché nello storico della stessa parcella compare la menzione della malattia e la coltura corrente include un ospite. È una scelta prudenziale dell'interfaccia, non un modello quantitativo di sopravvivenza. La fonte dell'Università del Maryland distingue inoltre il marciume bianco degli Allium dal white mold causato da *Sclerotinia sclerotiorum*, che ha un intervallo di ospiti molto più ampio. Per evitare falsi positivi, la regola non si attiva sulla sola frase generica “white rot”: richiede un nome più specifico o il nome del patogeno.

## Fonti

1. **University of Connecticut IPM**, [Clubroot of Crucifers](https://ipm.cahnr.uconn.edu/clubroot-of-crucifers/). Per clubroot confermato, indica sette anni fuori dalle Brassicaceae e raccomanda di gestire infestanti ospiti, pH, drenaggio e movimento del terreno. È una fonte universitaria di extension, non una meta-analisi peer-reviewed.
2. **Washington State University Hortsense**, [Onions, Garlic: White rot](https://hortsense.cahnrs.wsu.edu/fact-sheet/onions-garlic-white-rot/). Raccomanda di non coltivare cipolle o specie affini nei suoli infestati più spesso di una volta ogni 8–10 anni.
3. **University of Maryland Extension**, [White Rot of Onion and Garlic](https://extension.umd.edu/resource/white-rot-onion-and-garlic/). Riporta la persistenza degli sclerozi per 20–40 anni, la diffusione tramite terreno e attrezzi e i limiti della rotazione da sola; distingue la malattia dal white mold.

## Limiti ancora aperti

- I nomi comuni non sono una tassonomia affidabile al 100%; le schede con famiglia botanica corretta migliorano il controllo.
- La presenza di una nota fitosanitaria non conferma la diagnosi. Per casi sospetti è necessaria una valutazione locale, eventualmente con analisi diagnostica.
- Non sono ancora strutturati nel software: piante infestanti ospiti, movimento di terreno, drenaggio, pH, cultivar resistenti e risultati di laboratorio.
- La soglia di sette anni per clubroot è riferita a malattia confermata; il programma la applica solo come avviso conservativo dopo una menzione registrata.
