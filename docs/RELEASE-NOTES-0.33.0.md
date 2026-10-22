# Release notes — 0.33.0

## Fonti botaniche applicate

- Estese le fonti da 14 a 22 dossier, includendo cetriolo, zucchina, carota, cima di rapa, tre varietà di *Beta vulgaris* e cipolla.
- Documentate fonti Kew Plants of the World Online e Utah State University Extension.
- Aggiunta una normalizzazione limitata di sinonimi familiari (`Umbrelliferae`/`Umbelliferae`/`Apiaceae` e `Alliaceae`/`Amaryllidaceae`) per ridurre falsi disallineamenti nel registro.
- Nessun campo del dossier è stato sovrascritto automaticamente; le forme storiche restano visibili per eventuale revisione.
- Aggiornati test e documentazione.

## Verifiche

- Test Node: verificare con `node --test tests/*.test.mjs`.
- Validazione YAML dei front matter: verificare con Ruby/Psych.
- Build Jekyll e test browser: non eseguiti nell'ambiente di lavoro se `bundle` non è disponibile.
