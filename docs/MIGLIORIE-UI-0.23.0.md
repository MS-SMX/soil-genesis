# Organizzazione UI 0.23.0

## Gerarchia visiva
1. Il riepilogo di parcella, coltura e stato rimane in primo piano.
2. Gli avvisi fitosanitari pertinenti rimangono espansi e leggibili.
3. Le informazioni di dettaglio della rotazione sono espandibili.
4. Le schede fitosanitarie compatibili con una coltura sono nascoste finché l'utente non le richiede.
5. La libreria completa e la base scientifica sono chiuse per impostazione predefinita.

## Interazione
I link “Schede fitosanitarie compatibili” puntano al profilo esatto. Il gestore apre la libreria e il contenitore della base scientifica, apre il profilo e porta la visualizzazione alla scheda selezionata. Tutti i pannelli usano l'elemento HTML nativo `details/summary`, mantenendo l'interazione da tastiera e senza dipendenze JavaScript aggiuntive.
