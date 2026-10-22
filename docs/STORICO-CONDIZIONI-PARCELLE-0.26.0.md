# Storico temporale delle condizioni delle parcelle — 0.26.0

## Modello
Ogni osservazione contiene `id`, `parcelId`, `date`, `conditions`, `notes` e `createdAt`. `conditions` è parziale: include solo i campi che l'utente ha selezionato in modo esplicito. Un campo omesso non significa che la condizione sia assente.

## Separazione dal piano colturale
Il piano continua a descrivere la coltura associata a una parcella per una stagione e mantiene un riepilogo corrente delle condizioni. Lo storico raccoglie invece osservazioni ripetute con data propria. Modificare il piano non riscrive le osservazioni; aggiungere un'osservazione non modifica il piano.

## Backup e pubblicazione
Il backup JSON include `conditionObservations`; l'importazione valida le osservazioni e le unisce per ID, ignorando duplicati. Il pacchetto di pubblicazione contiene `_data/parcel-condition-history.yml`, con data, identificativo e nome della parcella, condizioni dichiarate e note. La pubblicazione è manuale: preparare il pacchetto non esegue commit né push.

## Interpretazione
La cronologia documenta ciò che è stato osservato e dichiarato. Non è una serie di misure strumentali, non verifica l'identità di chi inserisce i dati, non deduce l'assenza di problemi e non costituisce diagnosi fitosanitaria. Le osservazioni precedenti restano separate finché l'utente non elimina esplicitamente la singola voce.
