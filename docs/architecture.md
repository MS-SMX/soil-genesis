\# Soil Genesis

\## Architecture



\### Filosofia



Soil Genesis non è un semplice catalogo di sementi.



È un archivio digitale dedicato alla conservazione,

alla documentazione e alla diffusione di sementi libere

attraverso l'agricoltura rigenerativa.



Ogni varietà è rappresentata da un Dossier.



\---



\# Principi



1\. Una informazione esiste una sola volta.



2\. I dati sono separati dalla presentazione.



3\. Tutti i moduli sono indipendenti.



4\. Ogni nuova varietà deve poter essere aggiunta senza modificare il codice.



5\. Il sito deve funzionare integralmente su GitHub Pages.



\---



\# Struttura



\_seeds/

&#x20;   una scheda per varietà



\_data/

&#x20;   dati condivisi



assets/

&#x20;   css

&#x20;   js

&#x20;   images



\_includes/

&#x20;   widget e componenti



\_layouts/

&#x20;   layout Jekyll



\---



\# Dossier



Ogni dossier è composto da moduli.



Header



Identità



Coltivazione



Ecologia



Relazioni



Galleria



Cronologia



Bibliografia



Ricette



Passaporto



\---



\# Convenzioni



Slug sempre in minuscolo.



snake\_case per tutte le chiavi YAML.



Un solo ID permanente.



Le relazioni utilizzano sempre gli slug.



\---



\# Obiettivo



Aggiungere una nuova varietà deve richiedere esclusivamente:



\- una scheda in \_seeds

\- eventuali immagini

\- eventuali file in \_data



Nessuna modifica al codice.



\---



\# Roadmap 1.0



☐ Header definitivo



☐ Widget Engine



☐ Relation Engine



☐ Dossier Engine



☐ Explorer



☐ Passport



☐ QR Code



☐ Ricerca completa



☐ Responsive



☐ Test finale



Ogni nuova funzionalità deve soddisfare almeno uno di questi requisiti:



• rende più semplice documentare una varietà;



• rende più semplice esplorare l'archivio;



• rende più semplice mantenere il codice.

