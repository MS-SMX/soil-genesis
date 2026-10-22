# Soil Genesis 0.13.0 · Diario per parcelle e rotazioni

Questa versione aggiunge la geolocalizzazione interna delle attività di campo e il registro annuale delle colture per parcella.

## Struttura delle posizioni

- Esagono 1 e 2: sette anelli da A a G, ciascuno diviso in sei settori da 1 a 6.
- Ogni esagono: sei porte per colture rampicanti.
- Mezzo esagono 1 e 2: cinque file, ognuna divisa in metà A e metà B.
- Quadrato centrale: settore sinistro, settore destro e Tunnel delle Liane.
- Filare classico: posizione unica senza suddivisioni artificiali.

## Diario e rotazioni

Gli eventi datati possono essere assegnati a una posizione. Il piano annuale registra invece la coltura di base di una posizione senza richiedere una data d'impianto. Le due strutture sono mantenute separate per non confondere una situazione stagionale con un evento storico.

L'esportazione per il push produce file Markdown in `_logs/` e il piano delle colture in `_data/plot-plantings.yml`. Il backup JSON comprende entrambi i registri locali.
