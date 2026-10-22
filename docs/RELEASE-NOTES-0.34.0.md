# Release notes — 0.34.0

## Estensione delle fonti botaniche

- Estese le fonti da 22 a 31 dossier con sette taxa aggiuntivi: *Citrullus lanatus*, *Apium graveolens*, *Raphanus raphanistrum* subsp. *sativus*, *Foeniculum vulgare*, *Anethum graveolens*, *Petroselinum crispum* e *Coriandrum sativum*.
- Registrate fonti Kew separate per famiglia e ciclo di vita, mantenendo le fonti legate ai taxa effettivamente trattati.
- Il confronto del ciclo di vita riconosce i valori compatibili con alternative esplicite dichiarate dalla fonte.
- La discordanza del ciclo del finocchio e la sinonimia tassonomica del ravanello restano visibili nella documentazione; nessun campo originale è stato modificato automaticamente.
- Aggiornati test e documentazione.

## Verifiche

- Test Node e validazione YAML front matter eseguiti sul pacchetto.
- Build Jekyll e test browser non eseguiti: `bundle` non è disponibile nell'ambiente di lavoro.
