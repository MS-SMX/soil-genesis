# Lettura temporale delle condizioni — 0.27.0

Il riepilogo confronta osservazioni pubblicate e bozze locali, deduplicando gli identificativi già presenti nel dataset pubblicato. Considera solo osservazioni datate entro l'anno selezionato e, se attivo, il filtro della parcella.

Per ciascuna parcella e ciascun campo (drenaggio, irrigazione, residui, stato fitosanitario), mostra l'ultimo valore valido registrato e lo confronta con il precedente valore non vuoto dello stesso campo. Non richiede che tutte le condizioni siano state rilevate a ogni visita: le lacune rimangono esplicite.

## Interpretazione
- **Cambiamento registrato** significa soltanto che due osservazioni riportano valori diversi.
- **Invariato** significa che i due valori registrati coincidono; non prova che la condizione sia rimasta costante tra le date.
- **Una sola osservazione** non permette un confronto temporale.
- **Nessun dato** significa che il campo non è stato registrato nel periodo considerato, non che la condizione sia assente.

Il riepilogo non attribuisce causalità a pratiche agronomiche, non stima probabilità di malattia e non costituisce diagnosi. Per interpretazioni causali servono disegno di osservazione adeguato, misure comparabili, contesto meteorologico e agronomico e, ove pertinente, diagnosi confermata.
