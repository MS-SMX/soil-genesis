# Release notes · 0.28.0

- Integrate nella cronologia agronomica le osservazioni pubblicate e le bozze locali delle condizioni delle parcelle.
- Aggiunta una voce descrittiva di transizione quando due stagioni registrate mostrano colture diverse nella stessa parcella.
- Estesi ricerca, conteggi e filtri della cronologia alle osservazioni delle condizioni.
- Resi espliciti i limiti delle transizioni derivate: non sono date osservate e non certificano la qualità della rotazione.
- Documentati origine dei dati, deduplicazione per ID e limiti interpretativi.

## Verifiche
- `node --check assets/js/parcel-history.js`.
- Suite Node `tests/*.test.mjs`.
- Integrità ZIP.
- Build Jekyll e verifica browser non eseguite in questo ambiente.
