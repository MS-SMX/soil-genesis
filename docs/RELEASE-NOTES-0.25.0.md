# Release notes — Soil Genesis 0.25.0

- Aggiunti quattro campi facoltativi e ripiegati nel Piano parcelle: drenaggio, tipo di irrigazione, gestione dei residui e stato fitosanitario osservato.
- Le condizioni vengono visualizzate in un riepilogo compatto per ogni piano che contiene valori registrati.
- Le condizioni strutturate possono generare promemoria gestionali solo in presenza di una regola fitosanitaria già pertinente allo storico della parcella.
- Backup JSON e importazione conservano i campi; il pacchetto di pubblicazione li esporta in `_data/plot-plantings.yml`.
- Le registrazioni precedenti senza condizioni restano compatibili.
- Aggiunti test statici per il form, la persistenza, l'esportazione e i promemoria contestuali.

## Verifiche

La suite Node e `node --check` sono stati eseguiti. La build Jekyll e la verifica nel browser devono ancora essere eseguite in un ambiente con dipendenze Ruby/Jekyll disponibili.
