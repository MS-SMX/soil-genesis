# Integrazione delle evidenze riproduttive nel piano parcelle — 0.39.0

## Scopo

Il piano parcelle mostra ora le evidenze di riproduzione già registrate nel dossier selezionato. La pagina non deduce dati botanici nuovi e non applica automaticamente distanze d'isolamento o compatibilità.

## Comportamento

- La selezione di una pianta mostra le quattro aree: impollinazione, isolamento/rischio d'incrocio, maturità e raccolta, dimensione della popolazione.
- Ogni valore può mostrare fonte, collegamento, data di verifica e note.
- I dati vengono salvati come snapshot nella bozza locale del piano, così il riferimento resta leggibile anche se il dossier cambia in seguito.
- La vista del piano salvato mostra le evidenze conservate nello snapshot.
- L'esportazione per la pubblicazione include le evidenze nel file `_data/plot-plantings.yml`, insieme a nome scientifico, famiglia e ciclo di vita.
- Le fonti mancanti sono indicate esplicitamente. I dati a livello di specie non certificano automaticamente la cultivar.
- I collegamenti sono generati solo per URL HTTP(S) e il testo esterno viene escapato prima del rendering.

## Limiti

Questa funzione supporta la pianificazione e la verifica manuale. Non calcola automaticamente la distanza di isolamento, non identifica tutte le coppie di cultivar compatibili e non garantisce la purezza genetica. La decisione di rigenerare una varietà deve considerare la fonte specifica, il contesto locale e l'obiettivo di conservazione.

## Verifiche

Test Node, controllo sintattico JavaScript e validazione YAML dei dossier. Build Jekyll e test browser non eseguiti se `bundle` non è disponibile.
