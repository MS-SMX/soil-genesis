# Condizioni strutturate della parcella — 0.25.0

## Campi facoltativi

Il Piano parcelle può registrare quattro osservazioni per parcella e stagione:

- **Drenaggio:** adeguato senza ristagni osservati, scarso con ristagni osservati, variabile/da verificare, oppure non registrato.
- **Irrigazione:** al suolo/localizzata, soprachioma/a pioggia, mista, oppure non registrata.
- **Residui colturali:** rimossi/gestiti, residui sani lasciati in superficie, residui sospetti o infetti presenti, destinazione compost, oppure non registrati.
- **Stato fitosanitario:** nessun sintomo osservato, sintomi senza causa nota, problema sospetto, problema confermato da fonte competente, oppure non valutato.

## Uso nel sistema

I dati sono salvati nell'oggetto `conditions` del piano locale, esportati nel backup JSON e inclusi nel file `_data/plot-plantings.yml` preparato per la pubblicazione. Le vecchie registrazioni che non contengono `conditions` restano valide e vengono trattate come non registrate.

Quando esiste già una menzione fitosanitaria pertinente nello storico della stessa parcella, alcune condizioni possono aggiungere promemoria gestionali coerenti con la scheda. Non producono punteggi di rischio e non attivano una diagnosi. L'assenza di una condizione selezionata non viene interpretata come prova della sua assenza.

La scelta “Nessun sintomo osservato” descrive soltanto l'osservazione dell'utente nel momento della registrazione: non certifica che la parcella sia priva di patogeni. “Problema confermato” richiede una conferma da fonte competente; l'app non la verifica.

## Limiti

I valori sono osservazioni manuali, non misure strumentali. Non sono ancora collegati a sensori, analisi di laboratorio o a un archivio temporale separato delle condizioni: ogni piano rappresenta le condizioni registrate per quella specifica stagione. Il sistema non sovrascrive i dati storici con le condizioni dell'anno corrente.
