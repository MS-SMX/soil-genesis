# Qualità dei dati botanici · 0.30.0

## Scopo

La pagina `/qualita-dati-botanici/` individua i dossier delle collezioni `seeds`, `perennials` e `spontaneous` in cui la famiglia botanica o il ciclo di vita sono vuoti o contengono alcuni segnaposto espliciti. Non modifica i dossier e non inferisce valori botanici mancanti.

## Flusso di correzione

1. Aprire il dossier e controllare nome scientifico e informazioni disponibili.
2. Verificare la classificazione usando una fonte botanica affidabile.
3. Usare il collegamento di modifica GitHub per intervenire sul file della collezione.
4. Salvare la modifica nel repository e attendere la pubblicazione del sito.

La pagina mostra soltanto dossier con almeno un campo da verificare all'apertura; i filtri permettono di cercare per nome o ID, distinguere i due campi e includere anche i dossier senza problemi rilevati.

## Limiti

- Un campo compilato non è necessariamente corretto: questo è un controllo di completezza, non una verifica tassonomica.
- Nomi comuni ambigui non sono sufficienti per assegnare famiglia o ciclo di vita.
- I valori mancanti non vengono sostituiti automaticamente.
- I collegamenti GitHub puntano al ramo `main`; verificare il ramo di lavoro prima di salvare se il repository cambia configurazione.
- Il sito statico non scrive direttamente nei file del repository; la modifica richiede un'azione GitHub e una pubblicazione.
