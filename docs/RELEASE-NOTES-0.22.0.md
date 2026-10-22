# Soil Genesis 0.22.0 — Schede fitosanitarie collegate alle colture

## Cosa cambia

- Le voci del Piano parcelle mostrano le schede fitosanitarie compatibili con le colture ospiti registrate.
- Il pannello di lettura delle rotazioni ripete i collegamenti contestuali accanto alla valutazione della parcella.
- Ogni collegamento identifica le piante registrate che corrispondono agli ospiti indicati dalla regola e presenta una misura preventiva tratta dalla relativa scheda.
- Selezionando il collegamento, la scheda completa viene aperta nella libreria fitosanitaria.
- La corrispondenza usa le famiglie botaniche e i termini ospite delle regole già documentate, evitando di mantenere una seconda lista di ospiti potenzialmente divergente.

## Interpretazione e limiti

La compatibilità botanica non dimostra che un patogeno sia presente nella parcella. Le schede vengono proposte come riferimenti pertinenti alla coltura, mentre gli avvisi fitosanitari storici continuano ad attivarsi solo quando la malattia è stata menzionata nello storico della stessa parcella. Le corrispondenze per nome sono euristiche e possono non riconoscere sinonimi o nomi comuni non registrati; famiglie e intervalli vanno verificati nelle schede botaniche e nelle fonti citate.

## Verifiche

- `node --check assets/js/regeneration-diary.js`: superato.
- `node --test tests/*.test.mjs`: 79 superati, 0 falliti. La suite copre altri moduli e non verifica direttamente il nuovo rendering del Diario.
- Controlli statici sui sette identificativi delle schede, collegamenti contestuali e apertura delle schede: superati.
- Integrità ZIP: superata. Build Jekyll completa e verifica browser: non eseguite in questo ambiente.
