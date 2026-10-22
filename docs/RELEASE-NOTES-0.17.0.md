# Soil Genesis 0.17.0 — Rotazioni più consapevoli

## Novità

- Il selettore delle piante trasferisce nel piano anche famiglia botanica e ciclo di vita.
- L'esportazione per la pubblicazione salva famiglia e ciclo di vita in ogni pianta della consociazione, così i dati non dipendono solo dai metadati correnti dell'archivio.
- Il controllo delle rotazioni considera le famiglie di tutte le piante annuali e biennali selezionate, normalizzando maiuscole, minuscole e accenti.
- La lettura agronomica controlla le famiglie ripetute nello storico registrato degli ultimi tre anni, se i dati disponibili lo consentono.
- Le piante perenni sono riconosciute e separate dal controllo della rotazione annuale: non vengono trattate come colture da rimuovere automaticamente.
- Se mancano famiglia botanica o ciclo di vita, il sistema lo segnala esplicitamente invece di inventare dati.
- Le note della pagina chiariscono che gli avvisi sono orientativi e non sostituiscono una valutazione di patogeni, fertilità, consociazioni e condizioni locali.

## Compatibilità

- La chiave di archiviazione locale resta `soil-genesis:plot-plantings:v1`; i dati esistenti continuano a essere letti.
- I piani già pubblicati senza `family` o `life` continuano a funzionare: il sistema prova a recuperare i metadati dalle schede correnti dell'archivio e segnala i dati non disponibili.
- Non sono stati modificati il modello delle parcelle, il Registro eventi, lo Storico parcelle, il Custode o la Mappa miceliale.

## Verifiche

- `node --check assets/js/regeneration-diary.js`: superato.
- Integrità dell'archivio ZIP: verificata dopo la creazione.
- Build completa Jekyll e test in browser: non eseguiti in questo ambiente, perché le dipendenze del progetto non sono disponibili.
