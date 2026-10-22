# Contesto delle rotazioni nello storico · 0.29.0

## Scopo
La pagina `storico-parcelle.md` aggiunge una vista sintetica che incrocia i piani colturali registrati con le osservazioni datate delle condizioni della stessa parcella.

## Regole
- Il confronto considera piani registrati nell'intervallo scelto e confronta le famiglie botaniche note della stagione più recente con quelle dei tre anni precedenti registrati.
- Non inferisce una famiglia botanica se il dato manca. In assenza di famiglie, segnala che il confronto non è disponibile.
- Le piante perenni esplicitamente contrassegnate come tali sono escluse dal confronto annuale.
- Le osservazioni fitosanitarie vengono associate soltanto alla stessa parcella e all'intervallo temporale selezionato.
- Lo stato sintomatico o sospetto è riportato come osservazione registrata; non viene usato per diagnosticare un patogeno.
- La ripetizione di una famiglia è un indicatore orientativo, non un giudizio universale sulla qualità della rotazione.
- La presenza di un'osservazione non dimostra che una pratica abbia causato una variazione successiva.

## Origine dei dati
I piani pubblicati provengono da `_data/plot-plantings.yml`; le bozze del piano e le osservazioni locali provengono dalle chiavi `localStorage` già usate dal Diario di rigenerazione. Le osservazioni pubblicate provengono da `_data/parcel-condition-history.yml`.

## Limiti e compatibilità
La vista non modifica le registrazioni originali e non genera nuove osservazioni. I campi vuoti rimangono sconosciuti, non negativi. Il comportamento deve essere verificato nel browser e con dati reali prima di considerarlo validato end-to-end.
