# Release notes — 0.40.0

## Registro lotti e prove di germinazione

- Nuova pagina `lotti-seme.md`, accessibile dal menu **GESTIONE → LOTTI / GERMINAZIONE**.
- Ogni lotto conserva identificativo, dossier collegato, origine, data, quantità e unità, stato, conservazione e note.
- Ogni lotto può contenere più prove: data, semi testati, semi germinati, percentuale calcolata, durata, temperatura, metodo e osservazioni.
- Validazione: il conteggio dei germinati deve essere un intero compreso fra zero e il numero di semi testati.
- Backup JSON, importazione per ID, esportazione di un singolo lotto e pacchetto `seed-lots.yml` + riepilogo Markdown.
- Aggiunta la sezione dei lotti pubblicati che legge `_data/seed-lots.yml`; il registro pubblico parte vuoto e mostra solo dati versionati nel repository.
- I dati sono locali al browser fino all'esportazione. Non è implementato alcun push automatico a GitHub.
- Le prove descrivono soltanto il campione e le condizioni osservate; non certificano la vitalità dell'intero lotto né la qualità genetica.

## Verifiche

- Eseguire `node --test tests/*.test.mjs`.
- Eseguire `node --check assets/js/seed-lots.js`.
- Validare il front matter YAML dei dossier.
- Build Jekyll e test browser non eseguiti in questo ambiente perché `bundle` non è disponibile.
