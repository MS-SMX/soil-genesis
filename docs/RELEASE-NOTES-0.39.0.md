# Release notes — 0.39.0

## Piano parcelle collegato alle evidenze di riproduzione

- La selezione delle piante nel piano mostra le evidenze disponibili per impollinazione, isolamento/rischio d'incrocio, maturità del seme e dimensione della popolazione.
- Le bozze locali salvano uno snapshot delle evidenze, comprese fonti, URL, date e note.
- Le colture già salvate possono mostrare le evidenze snapshot accanto alla consociazione.
- L'esportazione per il repository conserva le evidenze in `_data/plot-plantings.yml` e include il nome scientifico.
- I valori mancanti restano espliciti; non sono state introdotte distanze o prescrizioni automatiche.
- Aggiunti test per il collegamento fra dossier, piano parcelle e esportazione.

## Verifiche

- Test Node, controllo sintattico JavaScript, validazione YAML e integrità ZIP.
- Build Jekyll e test browser non eseguiti: `bundle` non è disponibile nell'ambiente di lavoro.
