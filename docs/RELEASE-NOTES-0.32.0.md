# Release notes — Soil Genesis 0.32.0

## Registro fonti botaniche applicato a dossier reali

- Aggiunti metadati `fonti_botaniche.famiglia` e `fonti_botaniche.ciclo_vita` a 14 dossier di cinque taxa già presenti nell'archivio.
- Fonti utilizzate: Plants of the World Online di Royal Botanic Gardens, Kew e University of Maryland Extension per il ciclo colturale del pomodoro.
- Data di verifica registrata: 2026-10-22.
- Aggiunta documentazione con elenco dei dossier interessati, URL, limiti tassonomici e distinzione fra ciclo biologico e pratica colturale.
- Nessun campo botanico principale è stato riscritto; i valori documentati corrispondono a quelli già presenti nei dossier.

## Verifiche

- Sintassi JavaScript: da verificare con `node --check` sugli script modificati; questo rilascio modifica soprattutto front matter e documentazione.
- Test Node: eseguire `node --test tests/*.test.mjs`.
- YAML/front matter: eseguire i controlli disponibili prima della pubblicazione.
- Build Jekyll e prova browser non sono incluse se `bundle exec jekyll build` non è disponibile.
