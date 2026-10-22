# Matrice fitosanitaria 0.24.0 — corrispondenze e contesto

## Obiettivo

Rendere trasparente il motivo per cui una scheda fitosanitaria viene proposta e collegare alcune misure preventive alle condizioni esplicitamente annotate nella parcella, senza creare una diagnosi automatica.

## Livelli di corrispondenza ospite

- **Famiglia botanica:** la famiglia registrata coincide con una famiglia ospite configurata per la regola. È una corrispondenza più strutturata, ma può comunque essere troppo ampia per una specie o una forma speciale del patogeno.
- **Nome o identificativo:** il nome comune, lo slug o il nome scientifico contiene un termine configurato come ospite. È una corrispondenza da verificare sulla specie effettiva e sulla fonte.
- Le piante registrate come perenni sono escluse dai collegamenti che hanno funzione di rotazione annuale.
- Una corrispondenza botanica non dimostra che il patogeno sia presente nella parcella.

## Promemoria contestuali

Il sistema controlla solo le note del piano della parcella corrente. Quando trova termini espliciti relativi a ristagni, drenaggio, irrigazione soprachioma, residui infetti o movimento di suolo, mostra una misura da verificare per i profili pertinenti.

I promemoria:
- non assegnano punteggi di rischio;
- non deducono condizioni non annotate;
- non confermano la presenza di un patogeno;
- non sostituiscono diagnosi, analisi del suolo o indicazioni fitosanitarie locali.

L'elenco dei termini è intenzionalmente conservativo: se una condizione non è stata registrata con parole riconosciute, il sistema non la considera assente, semplicemente non dispone di una nota utilizzabile.

## Limiti e fonti

Le fonti fitosanitarie restano quelle già elencate nelle schede della versione 0.21.0 e nella matrice 0.22.0. Questa release modifica il modo di spiegare le corrispondenze e contestualizzare le misure, non amplia le soglie agronomiche né dichiara nuove validazioni scientifiche.
