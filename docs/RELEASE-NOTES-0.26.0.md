# Release notes — 0.26.0

## Storico temporale delle condizioni
- Aggiunta una registrazione indipendente e datata delle condizioni di ogni parcella.
- Ogni osservazione conserva soltanto i campi esplicitamente selezionati e può includere una nota.
- Le osservazioni vengono aggiunte alla cronologia; non modificano il piano colturale stagionale né le osservazioni precedenti.
- Aggiunti visualizzazione filtrata per anno selezionato e parcella, distinzione tra bozze locali e osservazioni pubblicate, eliminazione puntuale con conferma e backup JSON.
- Il pacchetto di pubblicazione genera `_data/parcel-condition-history.yml` accanto al piano delle colture e ai log.
- L'importazione dei backup unisce le osservazioni tramite ID e ignora i duplicati. I vecchi backup restano compatibili.

## Limiti
Le osservazioni sono inserimenti manuali. La data è quella dichiarata dall'utente, non verificata dal sistema. La cronologia non deduce trend né diagnostica patogeni. La build Jekyll e il controllo browser devono essere eseguiti in un ambiente con le dipendenze del progetto.
