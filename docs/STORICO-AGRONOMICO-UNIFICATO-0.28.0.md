# Storico agronomico unificato · 0.28.0

## Scopo
La pagina `storico-parcelle.md` raccoglie in un'unica cronologia i piani colturali stagionali, gli eventi datati e le osservazioni datate delle condizioni della parcella.

## Origine dei dati
- Piani pubblicati: `_data/plot-plantings.yml`.
- Eventi pubblicati: collezione Jekyll `_logs/` con `type: field`.
- Osservazioni pubblicate: `_data/parcel-condition-history.yml`, campo `observations`.
- Bozze locali: `localStorage`, nelle chiavi del diario, del piano e delle osservazioni. Restano visibili soltanto nel browser corrente finché non vengono esportate e pubblicate.

Le osservazioni pubblicate e locali sono unite tramite ID. La stessa osservazione non viene duplicata se è presente in entrambe le origini.

## Transizioni tra stagioni
Quando sono registrati piani per almeno due stagioni distinte della stessa parcella, la pagina può mostrare una voce sintetica che confronta le colture registrate. La transizione è un riepilogo derivato dai piani, non un evento osservato in una data specifica e non una valutazione automatica della qualità della rotazione. Non inferisce famiglie botaniche, patogeni, causalità o raccomandazioni fitosanitarie.

## Date e filtri
Le osservazioni e gli eventi mantengono le date registrate. I piani colturali senza data restano etichettati per stagione; non viene inventata una data. Il filtro per anno usa la stagione per i piani e l'anno della data per gli eventi e le osservazioni.

## Limiti
Le osservazioni descrivono ciò che è stato registrato, non tutto ciò che è accaduto nella parcella. Un campo mancante non equivale a una condizione assente. La pagina non costituisce una diagnosi fitosanitaria né dimostra causalità tra pratiche e cambiamenti osservati.
