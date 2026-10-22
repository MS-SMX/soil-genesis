# Registro riproduzione e conservazione — 0.38.0

## Scopo

Aggiunta una vista operativa che incrocia i campi riproduttivi già presenti nei dossier con un blocco `fonti_riproduzione`. Il rilascio registra evidenze a livello di specie in 37 dossier. Le indicazioni non certificano la singola cultivar e restano marcate come orientative quando le guide divergono o non offrono un valore numerico.

## Quattro aree di evidenza

1. **Impollinazione e sistema riproduttivo**: autofecondazione, incrocio, vettore del polline e condizioni note.
2. **Isolamento e rischio d'incrocio**: distanza con unità, barriere o isolamento temporale, compatibilità fra varietà e rischio residuo.
3. **Maturità e raccolta del seme**: criterio osservabile di maturità, non soltanto il mese in cui si raccoglie il prodotto alimentare.
4. **Dimensione della popolazione**: numero di piante e obiettivo (uso domestico, mantenimento genetico, scambio o conservazione).

## Fonti metodologiche

- Organic Seed Alliance, *A Seed Saving Guide for Gardeners and Farmers*: https://seedalliance.org/publications/seed-saving-guide/
- Seed Savers Exchange, *Isolation Methods*: https://seedsavers.org/learn/isolation-methods/
- Seed Savers Exchange, *Crop-Specific Seed Saving Guide*: https://shop.seedsavers.org/site/pdf/crop_chart.pdf

La fonte principale applicata ai dossier è il grafico specie-specifico Seed Savers Exchange, affiancato dal manuale Organic Seed Alliance per i principi generali. Le evidenze sono applicate a livello di specie e non certificano la singola cultivar. Alcuni valori sono intervalli indicativi; dove la guida non offre un dato specifico, il campo lo dichiara invece di inventare una distanza o una dimensione della popolazione. Le distanze variano secondo sistema d'impollinazione, paesaggio, simultaneità della fioritura, pressione dei pollinatori e obiettivo di purezza. Anche una distanza raccomandata non garantisce assenza di incroci.

## Interfaccia

`registro-riproduzione.md` mostra i campi esistenti e, separatamente, le quattro aree con fonte registrata. Ricerca e filtri permettono di individuare dossier con evidenze mancanti. Sono stati documentati 37 dossier appartenenti a specie per cui il riferimento consultato offre indicazioni utilizzabili; gli altri restano scoperti e visibili nel registro.

## Verifiche e limiti

I test controllano la presenza della pagina, dello schema, delle fonti metodologiche e del filtro. Il test non sostituisce la revisione botanica, l'esecuzione di Jekyll o un controllo browser.
