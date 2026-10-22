# Soil Genesis 0.21.0 — Schede fitosanitarie strutturate

## Cosa cambia

Il pannello di lettura delle rotazioni include ora una libreria di sette schede apribili. Ogni scheda separa:

- persistenza del patogeno;
- vie di diffusione;
- condizioni che favoriscono la malattia;
- intervallo di rotazione riportato dalla fonte;
- misure complementari alla rotazione;
- fonti universitarie consultabili.

Le schede sono disponibili anche prima di registrare colture per la stagione selezionata. Le regole di allerta già presenti non sono state sostituite e continuano a dipendere da una menzione esplicita della malattia nello storico della parcella.

## Limiti e contesto

Le indicazioni sono riassunti di fonti universitarie di extension e IPM, prevalentemente statunitensi. Non costituiscono prescrizioni universali per il clima italiano. In particolare, intervallo di rotazione e persistenza del patogeno sono concetti distinti: superare il primo non dimostra che il secondo sia terminato. Per sospetti seri o decisioni pluriennali, confermare la diagnosi e consultare un servizio fitosanitario locale.

## Verifiche

- `node --check assets/js/regeneration-diary.js`: superato.
- `node --test tests/*.test.mjs`: 79 test superati, 0 falliti. La suite non verifica direttamente i nuovi testi fitopatologici.
- Build Jekyll completa e test browser: non eseguiti in questo ambiente.
