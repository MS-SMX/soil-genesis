## 0.40.0 — Registro lotti e germinazione
- Introdotto un registro locale per lotti fisici di semi e prove di germinazione ripetibili.
- Percentuale di germinazione calcolata solo sul campione testato; note esplicite sui limiti interpretativi.
- Backup/import JSON ed esportazione YAML + Markdown per revisione e versionamento manuale.

## 0.39.0 — Evidenze riproduttive nel piano parcelle
- Il piano mostra le fonti disponibili su impollinazione, isolamento, maturità del seme e dimensione della popolazione mentre si selezionano le piante.
- Gli snapshot delle evidenze vengono conservati nei piani locali ed esportati in `_data/plot-plantings.yml`.
- I campi mancanti restano espliciti; nessuna prescrizione di isolamento o compatibilità viene dedotta automaticamente.
- Aggiunti test per rendering, link e persistenza delle fonti.

## 0.32.0 — Fonti botaniche applicate ai dossier

- Registrate fonti per famiglia botanica e ciclo di vita in 14 dossier appartenenti a cinque taxa già presenti.
- Usate fonti Kew Plants of the World Online e University of Maryland Extension, con data di verifica 2026-10-22.
- Aggiunta documentazione delle fonti e dei limiti interpretativi.
- Nessuna classificazione nuova dedotta automaticamente e nessun valore principale del dossier sovrascritto.

## 0.28.0 — Storico agronomico unificato
- La cronologia delle parcelle riunisce piani colturali, eventi e osservazioni delle condizioni.
- Le transizioni tra stagioni sono mostrate come confronti descrittivi, senza inferire date o causalità.

## 0.27.0 — Lettura temporale delle condizioni
- Aggiunto un riepilogo storico per parcella che confronta le ultime osservazioni disponibili senza confondere variazione e causalità.
- I dati mancanti sono mostrati esplicitamente e non vengono interpretati come assenza.
- Aggiunti test statici e documentazione dei limiti interpretativi.

## v4.12.0 — Confronto esplicito delle testimonianze

- Dopo aver raccolto le informazioni di Mara ed Elio, è possibile confrontarle durante una conversazione con uno dei due.
- Il confronto costa 5 minuti, viene registrato nel taccuino con provenienza mista e compare nel registro eventi.
- Ogni contatto consente il confronto una sola volta; lo stato è persistente e compatibile con i salvataggi precedenti.
- Il testo esplicita che indizi compatibili non dimostrano automaticamente una causa comune.

## v4.11.0 — Primo dossier investigativo giocabile

- Aggiunto il dossier “Tracce verso nord” nel taccuino, con tre tappe che si aggiornano in base a informazioni e scoperte realmente registrate.
- Il percorso collega la testimonianza di Mara a Biancavilla, il punto d’interesse sul Percorso 1 e la testimonianza di Elio.
- La conclusione distingue la convergenza degli indizi dalla certezza: conferma passaggi recenti compatibili, ma non identifica persone o destinazione.
- Gli esami diretti dei punti d’interesse registrano ora esplicitamente la provenienza della fonte.
- Nessun reset dei salvataggi: il dossier deriva dagli stati già persistenti nel browser.

## v4.10.0
- Corretto il bootstrap della schermata centrale: dopo il primo render del motore viene ripristinata la vista di gioco e selezionata esplicitamente la scheda LUOGO.
- La transizione iniziale map -> game forza lo stesso aggiornamento di stato che prima avveniva solo cliccando manualmente una scheda.

## v4.9.0
- Aggiunto bootstrap indipendente per rimontare le quattro aree UI anche se lo script precedente si interrompe.
- Ripristinato un gestore isolato per archiviare, mostrare ed eliminare ipotesi personali.
- Aggiunta una regola CSS finale per forzare la griglia desktop dopo le vecchie regole sovrapposte.

# Changelog

## v4.8.0 — Ripristino dell'inizializzazione UI e del laboratorio ipotesi

- Corretto un errore JavaScript: gli handler di ricerca e filtro usavano `render` prima della sua inizializzazione (`const`), interrompendo l'intero script UI.
- Ora il laboratorio delle ipotesi registra gli handler dopo la definizione di `render`; invio del modulo, ricerca e filtri possono essere inizializzati.
- Lo stesso errore impediva al codice successivo di montare le aree `.layout-left`, `.layout-center`, `.layout-right` e `.layout-bottom`, lasciando pannelli come inventario e deposito nella posizione HTML originale.
- Nessuna modifica alle chiavi o ai dati salvati; versione basata su v4.7.0.
- Test automatici e controlli sintattici eseguiti. La verifica visiva browser resta non confermata.

## v4.7.0 — Inizializzazione stabile della schermata

- Dopo il primo render asincrono del motore, la vista attiva viene riapplicata su due frame di rendering, quando il DOM dinamico è stato popolato.
- Viene emesso un evento `resize` per aggiornare i componenti che dipendono dalle dimensioni del contenitore.
- Correzione mirata al problema per cui passare a un'altra scheda e tornare alla schermata principale forzava il layout corretto.
- Nessuna modifica al motore di gioco, alle meccaniche o alle chiavi di salvataggio.


## v4.5.0 — Ricostruzione deterministica della schermata

- Sostituito il vecchio controllo del layout, che spostava gli elementi soltanto quando erano figli diretti di `.screen`, con una ricostruzione esplicita delle quattro aree.
- La scena del luogo è la vista centrale predefinita; la mappa resta accessibile con la scheda dedicata.
- Inventario e deposito restano nella vista Zaino / Personaggio.
- Il registro eventi rimane in basso con altezza limitata e scorrimento interno.
- Motore, meccaniche e chiavi di salvataggio invariati.
- Test automatici e controlli sintattici eseguiti; verifica visiva automatizzata tentata ma non completata.


- Rimossi dalla griglia di gioco gli elementi introduttivi legacy che venivano auto-posizionati e spostavano le aree nominate.
- Rafforzate le assegnazioni esplicite delle aree `menu`, `left`, `center`, `right`, `bottom` e `footer`.
- Nella schermata principale profilo e inventario sono riservati alla vista `Zaino / Personaggio`; il centro resta dedicato alla scena/mappa.
- Registro eventi con altezza limitata e scorrimento interno.
- Nessuna modifica al motore, alle meccaniche o alle chiavi di salvataggio.

## v4.3.0 — Correzione effettiva della griglia

- Corretto il difetto strutturale: i contenitori `.layout-left`, `.layout-center`, `.layout-right` e `.layout-bottom` non avevano `grid-area` esplicite e venivano quindi collocati in righe automatiche, impilando i pannelli.
- Assegnate esplicitamente le aree `left`, `center`, `right` e `bottom`, mantenendo la scena centrale dominante su desktop e il riordino responsive.
- Nessuna modifica al motore, ai salvataggi o alle regole del mondo.
- Test automatici e controlli sintattici eseguiti; test visivo browser non eseguito.

## v4.3.0 — Ripristino del layout principale

- Consolidata la griglia di gioco in un unico blocco CSS finale, con tre colonne stabili su desktop, pannelli contestuali riordinati su tablet e impilamento su mobile.
- Ripristinati vincoli espliciti di larghezza/min-width per evitare che mappe, testi lunghi e strumenti del laboratorio allarghino o sovrappongano i pannelli.
- La mappa/scena centrale resta l'area dominante; profilo, posizione e azioni restano a sinistra, contesto e contatti a destra, registro in basso.
- Nessuna modifica al motore, ai salvataggi o alle regole del mondo.
- Verifiche automatiche e sintattiche eseguite; nessuna verifica visiva browser dichiarata.

## v4.1.0
- Added searchable and filterable hypothesis list.
- Automatically refresh linked source options when notebook entries are added.
- Improved responsive investigation UI.

## v4.0.0 — Quadro d'insieme investigativo

- Il laboratorio mostra un riepilogo aggiornato di ipotesi, personaggi citati nelle fonti collegate, eventi collegati, fonti riutilizzate e conflitti annotati.
- Segnala quando la stessa fonte viene collegata a più ipotesi, chiarendo che il riutilizzo non costituisce una conferma indipendente.
- Il riepilogo è derivato dai dati già presenti nel taccuino e non introduce nuove informazioni o effetti sul mondo.
- Compatibilità mantenuta con i salvataggi precedenti; nessuna migrazione richiesta.

## v3.9.0 — Provenienza delle fonti

- Le osservazioni ambientali vengono classificate come osservazioni dirette; gli esiti di tracce come eventi/esiti; le informazioni e gli incontri con personaggi registrano il nome del contatto e il contesto.
- Le fonti collegate alle ipotesi mostrano provenienza, personaggio quando disponibile e contesto; gli stessi metadati sono inclusi nell’esportazione TXT.
- Le voci precedenti senza metadati restano compatibili e vengono indicate come non classificate.
- La provenienza documenta come è stata raccolta un’informazione, ma non ne garantisce la veridicità e non modifica il mondo simulato.

## v3.8.0 — Registro delle contraddizioni

- Ogni ipotesi può contenere una nota dedicata alle versioni incompatibili, ai conflitti tra fonti e alle verifiche ancora necessarie.
- La nota può essere aggiornata o svuotata senza eliminare l'ipotesi o le sue relazioni.
- Contraddizioni e verifiche necessarie sono visibili nella scheda ed entrano nell'esportazione TXT.
- Nessuna risoluzione automatica: il gioco non sceglie quale fonte sia vera e queste note non modificano il mondo simulato.
- Compatibilità mantenuta con i salvataggi precedenti.

## v3.7.0 — Natura delle affermazioni

- Ogni ipotesi può essere classificata come osservazione diretta, testimonianza ricevuta, deduzione personale o fonte mista/non chiarita.
- La classificazione è visibile nella scheda e nell'esportazione TXT.
- Le ipotesi create nelle versioni precedenti restano compatibili e vengono mostrate come fonti miste/non chiarite se prive della nuova informazione.
- La classificazione non misura automaticamente l'attendibilità e non modifica il mondo simulato.

## v3.6.0 — Fonti collegate alle ipotesi

- Le ipotesi possono citare una o più osservazioni già registrate nel taccuino di campo.
- Le fonti collegate sono mostrate nelle schede delle ipotesi con titolo, categoria e località; se una voce del taccuino viene rimossa, il riferimento non viene mostrato come fonte ancora disponibile.
- L'esportazione TXT riporta i dettagli delle fonti ancora presenti, oltre alle relazioni tra ipotesi.
- Le fonti sono riferimenti manuali del giocatore: non verificano le conclusioni e non modificano il mondo simulato.
- Compatibilità mantenuta con le ipotesi salvate nelle versioni precedenti.

## v3.5.0 — Rete di ipotesi

- Le ipotesi personali possono essere collegate tra loro come relazione che sostiene, contraddice o conferma indipendentemente un'altra ipotesi.
- Le relazioni sono visibili nelle schede, persistono in localStorage e vengono incluse nell'esportazione del taccuino.
- I collegamenti verso ipotesi eliminate non vengono mostrati né esportati; i vecchi salvataggi restano compatibili.
- Le relazioni sono interpretazioni del giocatore: non verificano automaticamente le ipotesi e non modificano il mondo simulato.

## v3.4.0 — Fiducia personale e revisione delle ipotesi

- Aggiunta una scala di fiducia soggettiva (0–100%) per ogni ipotesi; è una valutazione del giocatore, non una probabilità simulata né un fatto del mondo.
- Le ipotesi esistenti senza valore esplicito vengono mostrate al 50%, senza migrazioni distruttive.
- È possibile modificare le note di un'ipotesi già archiviata e aggiornare la fiducia in seguito a nuovi indizi.
- L'esportazione del taccuino include la fiducia personale.
- Rifiniture CRT per barre di fiducia, controlli e stati di revisione.
- Nessun effetto delle deduzioni sulle regole del mondo.

## v3.3.0
- Aggiunto un laboratorio di deduzioni personali nel taccuino: ipotesi, indizi/dubbi associati, località e valutazione.
- Le ipotesi possono essere aggiornate (aperta, plausibile, debole, scartata) o eliminate; il registro è persistente e tollera dati locali corrotti.
- Le deduzioni vengono incluse nell'esportazione del taccuino.
- Chiarita nell'interfaccia la separazione tra ipotesi personali e fatti del mondo: archiviare o rivalutare una deduzione non modifica la simulazione.
- Migliorati i pannelli del taccuino con stili responsive in palette terminale decadente.

# Changelog

## v3.2.0
- Corrette le annotazioni cartografiche: sono esclusivamente promemoria personali e non bloccano viaggi né alterano probabilità o condizioni del mondo.
- Aggiunto un campo persistente per note testuali associate ai percorsi, separato dallo stato visuale.
- Aggiunta la ricerca testuale nel taccuino, su titolo, categoria, luogo e contenuto.
- Aggiunta l'esportazione del taccuino e dei promemoria cartografici in un file TXT locale.
- Rifiniti i segnali grafici delle annotazioni e la gerarchia dei controlli del taccuino.

## v3.1.0 — Prima implementazione delle annotazioni operative (superata in v3.2.0)
- Le annotazioni personali PERICOLOSO e DA VERIFICARE modificano ora le probabilità di eventi e avvistamenti durante i viaggi che attraversano il percorso annotato.
- I collegamenti di viaggio mostrano lo stato annotato, così il rischio è leggibile prima della partenza.
- Il percorso INTERROTTO continua a bloccare il viaggio finché l'utente non aggiorna la propria annotazione.
- Rifiniture visive localizzate per feed della scena, punti d'interesse e avvisi cartografici; nessuna modifica alla griglia stabilizzata.
- Aggiunti test automatici per le probabilità configurabili di eventi e avvistamenti.


## v3.0.0 — Feed locale interattivo
- I punti d'interesse reali della località corrente compaiono anche sotto la scena centrale come controlli interattivi.
- Ogni punto può essere esaminato dal feed o dal pannello tradizionale: entrambi richiamano la stessa azione e condividono costi, persistenza e registro.
- Gli elementi già esaminati sono marcati come registrati e non possono essere completati una seconda volta.
- Rifinita la scena con una cornice CRT, righe di scansione e controlli in stile terminale verde petrolio.
- Nessun reset dei salvataggi e nessuna modifica al formato dei dati esistenti.

## v2.9.1 — Correzione strutturale del layout

- Corretto il difetto che causava la sovrapposizione dei pannelli: la scena centrale era un elemento Grid esteso su più righe `min-content`, che poteva debordare sulle colonne laterali.
- Introdotti contenitori reali separati per colonna sinistra, area centrale, colonna destra e registro inferiore.
- Conservati i selettori funzionali e gli ID usati dal motore per non interrompere azioni, viaggi, salvataggi e registro.
- Sistemata la disposizione responsiva per desktop, tablet e mobile.

## v2.8.0 — Ricostruzione del layout

- Rifatta la griglia desktop con tre colonne e area centrale dominante.
- La schermata principale apre la scheda LUOGO; MAPPA e TACCUINO RAPIDO sono alternabili.
- Pannelli laterali compatti e registro in fascia inferiore.
- Layout responsive per schermi intermedi e mobili.
- Motore, dati e sistema di salvataggio esistenti mantenuti.

# Changelog

## v2.7.0
- Rifinita l'estetica CRT sporca con una gerarchia visiva più leggibile e stati di focus accessibili.
- Le annotazioni `interrotto` disabilitano i viaggi che attraversano un percorso annotato come bloccato.
- I collegamenti bloccati sono segnalati anche nella lista degli spostamenti della mappa.

# Changelog

## v2.6.0 - Interfaccia operativa
- Aggiunte le viste centrali Mappa, Luogo e Taccuino rapido.
- Aggiunta una scena locale provvisoria in stile terminale/CRT, sincronizzata con il nome e la descrizione della località corrente.
- Aggiunte annotazioni cartografiche persistenti per i percorsi: libero, interrotto, pericoloso e da verificare.
- Aggiunto un taccuino rapido con note personali salvate nel browser.
- Chiarito che le annotazioni sono promemoria e non modificano ancora il sistema di navigazione simulato.

# Changelog

## v2.5.0 — Mappa interattiva e navigazione
- I nodi della mappa avviano gli spostamenti attraverso i collegamenti mostrati nella vista mappa, invece di cercare pulsanti nella schermata principale nascosta.
- Aggiunti nomi accessibili che distinguono posizione attuale, destinazioni disponibili e luoghi non raggiungibili.
- Corretto il doppio indicatore sulla posizione corrente.

## v2.4.0 — Schermata essenziale e navigazione leggibile
- Rimossi dalla schermata principale i pannelli completi di profilo, inventario e taccuino: restano nelle rispettive viste.
- Raggruppati gli elementi contestuali in sezioni richiudibili; incontri e contatti aprono automaticamente il proprio pannello quando diventano rilevanti.
- Aggiunta una striscia compatta per salute, energia, fame e sete.
- Spostamenti portati vicino alla posizione corrente e visualizzati con freccia, direzione cardinale e durata.
- Mappa di Kanto ridisegnata come schema nostalgico ispirato alle mappe dei giochi classici; usa nomi ufficiali e distingue località implementate da quelle ancora bloccate.
- Registro eventi compatto e ancorato al fondo anche su schermi piccoli.


## v2.3.0 - Interfaccia organizzata

- Introdotto un menu a viste: Schermata, Mappa di Kanto, Zaino / Personaggio, Taccuino e Registro.
- Registro eventi compatto e sempre visibile nella schermata principale; vista dedicata per consultare gli eventi precedenti.
- Aggiunta una mappa schematica interattiva con posizione attuale lampeggiante e collegamenti direzionali; solo i collegamenti già supportati dal mondo di gioco sono percorribili.
- Raggruppate le azioni e le informazioni contestuali per ridurre il disordine visivo.
- Aggiunti filtri al taccuino per distinguere indizi, contatti, informazioni, luoghi, deduzioni e osservazioni generali.
- Le tracce esaminate e i relativi esiti vengono conservati separatamente nel taccuino.

# Changelog

## v2.2.0
- Le informazioni di Mara possono sbloccare un punto d'interesse aggiuntivo sul Percorso 1.
- Le informazioni di Elio possono sbloccare un controllo del giunto di alimentazione a Smeraldopoli.
- I punti investigativi emergono dal contesto dei contatti e si integrano con la persistenza delle scoperte.
- Aggiunti test per lo sblocco condizionale e la compatibilità con progressi già salvati.

## v2.1.0
- I contatti ricordano quante conversazioni sono già avvenute e modificano le risposte successive.
- Le informazioni di Elio e Nives cambiano in base agli indizi già raccolti, collegando sentiero, recinzione e pannello intermittente senza trasformare ipotesi in certezze.
- I dialoghi contestuali e le informazioni ottenute continuano a usare il registro persistente già esistente.
- Test aggiunti per memoria delle conversazioni e collegamenti tra indizi.

## v2.0.0
- Rework della schermata: larghezza maggiore, pannelli raggruppati, statistiche compatte e gerarchia visiva più chiara.
- Contatto locale sempre individuabile nelle tre località principali, senza dover aspettare un incontro casuale.
- Primo avvicinamento e ritorno ai contatti persistenti; registrazione della data d'incontro e annotazione nel taccuino.
- Compatibilità con i contatti salvati dalle versioni precedenti.
- Test aggiunti per disponibilità e persistenza dei contatti.

## v1.8.0 — Taccuino di campo e incontri contestuali

- Aggiunto un taccuino persistente che conserva fino a 40 osservazioni recenti nel browser.
- I punti d'interesse esaminati generano un'annotazione consultabile anche dopo viaggi e ricaricamenti.
- Le scelte sugli avvistamenti producono esiti contestuali diversi per tracce umane, Pokémon e segnali ambientali.
- Gli esiti degli incontri vengono salvati nel taccuino con località, categoria e orario del mondo.
- Il taccuino evita duplicati identici e gestisce in sicurezza dati assenti o corrotti.
- Nessun combattimento forzato e nessuna penalità casuale introdotta.

## v1.5.0 - Esplorazione attiva

- Aggiunta l'azione "Esamina i dintorni": richiede 10 minuti e 3 energia e produce un indizio contestuale alla località.
- Aggiunta la scelta di seguire una traccia (20 minuti e 5 energia) oppure ignorarla.
- Alcune tracce possono portare a risorse, sempre nel rispetto della capacità dell'inventario.
- Gli esiti vengono aggiunti al registro eventi persistente.
- Interfaccia dedicata con descrizione della traccia e controlli accessibili.
- Nessun combattimento, danno casuale o cambio di formato dei salvataggi.

## v1.4.0 - Avvistamenti ambientali

- Aggiunti avvistamenti non ostili durante una parte dei viaggi: tracce, rumori e Pokémon selvatici osservati a distanza.
- Le descrizioni variano in base alla località raggiunta.
- Gli avvistamenti non modificano statistiche, inventario o durata dei viaggi e non avviano combattimenti.
- Aggiunti test deterministici per probabilità, risultati e input non validi.

## v1.3.0 - Ritrovamenti legati alla località

- I ritrovamenti durante i viaggi dipendono dalla località raggiunta.
- Le aree rurali privilegiano bacche ed erbe spontanee; Smeraldopoli può offrire materiali medici o conserve.
- Probabilità invariata al 20%; peso massimo e gestione inventario restano invariati.
- Nessuna penalità aggiuntiva e nessuna modifica al formato dei salvataggi.

# Changelog

## v1.2.0 - Ritrovamenti durante i viaggi
- Aggiunta una probabilità del 20% di trovare bacche selvatiche o erbe spontanee durante un viaggio.
- Le risorse trovate entrano nell’inventario solo se il peso rimane entro il limite di 12 kg.
- Se lo zaino è pieno, l’occasione viene registrata senza aggiungere oggetti né applicare penalità.
- I ritrovamenti sono registrati nella cronologia persistente e non consumano energia extra né allungano il viaggio.
- Aggiunti test deterministici per probabilità, risultati e convalida del generatore casuale.


## v1.1.0 - Eventi narrativi durante i viaggi
- Una parte dei viaggi può generare un evento narrativo registrato nella cronologia.
- Gli eventi descrivono tracce umane, accampamenti abbandonati, rumori distanti e ostacoli minori.
- Gli eventi non modificano salute, inventario o durata del viaggio: questa prima iterazione aggiunge atmosfera senza introdurre penalità casuali non bilanciate.
- Aggiunto un modulo separato con probabilità ed eventi testabili in modo deterministico.


## v1.0.0 - Prima versione di riferimento
- Consolidata la base giocabile: profilo, bisogni, viaggi, azioni, raccolta, inventario con peso, cure, lesioni, registro eventi e depositi locali.
- Aggiornate le versioni mostrate nell'interfaccia e nei messaggi di avvio.
- Documentati i limiti attuali e una procedura di verifica manuale dopo l'installazione.
- Nessuna nuova meccanica di gioco: questa release congela la base per rendere più chiari test e prossimi sviluppi.

## v0.9.0 - Depositi locali
- Aggiunto un deposito separato per ogni località, persistente tra riavvii e ricaricamenti.
- È possibile depositare una unità o tutte le unità di un oggetto.
- È possibile ritirare una unità o tutte le unità se il peso disponibile lo consente.
- Le operazioni sono registrate nel registro eventi; gli oggetti depositati non pesano sull'inventario trasportato.
- Dati del deposito convalidati al caricamento.

## v0.8.0 - Gestione dell'inventario
- Aggiunti i comandi per abbandonare una singola unità o tutte le unità di un oggetto.
- Il peso viene ricalcolato immediatamente dopo l'abbandono.
- Le operazioni sono registrate nel registro eventi persistente.
- Gli oggetti abbandonati non sono recuperabili in questa versione.

## v0.7.0 - Peso dell’inventario
- Ogni oggetto ha un peso indicativo in chilogrammi.
- Aggiunta una capacità massima di 12 kg, mostrata nell’inventario.
- La raccolta viene rifiutata se supererebbe il limite; la risorsa resta disponibile.
- I vecchi salvataggi restano compatibili: il peso viene calcolato dai contenuti già salvati.

# Changelog

## v1.2.0 - Ritrovamenti durante i viaggi
- Aggiunta una probabilità del 20% di trovare bacche selvatiche o erbe spontanee durante un viaggio.
- Le risorse trovate entrano nell’inventario solo se il peso rimane entro il limite di 12 kg.
- Se lo zaino è pieno, l’occasione viene registrata senza aggiungere oggetti né applicare penalità.
- I ritrovamenti sono registrati nella cronologia persistente e non consumano energia extra né allungano il viaggio.
- Aggiunti test deterministici per probabilità, risultati e convalida del generatore casuale.


## v0.6.0 - Registro eventi persistente
- Il registro conserva gli ultimi 30 eventi in `localStorage`, anche dopo un ricaricamento o un riavvio.
- I messaggi più vecchi vengono eliminati automaticamente quando si supera il limite.
- I dati salvati vengono convalidati al caricamento; un registro danneggiato viene ignorato senza bloccare l’avvio.
- Aggiunti test per ripristino, limite massimo e dati non validi.


## v0.5.0 - Condizioni fisiche persistenti
- Aggiunto uno stato persistente delle lesioni, salvato insieme al personaggio.
- La privazione prolungata che porta la salute a livelli critici può provocare debilitazione fisica.
- Le bende trattano un livello di lesione; il kit di primo soccorso ne tratta due.
- Il riposo accumula tempo di recupero: un livello di lesione guarisce dopo 12 ore di riposo in condizioni stabili.
- Fame o sete critiche impediscono il recupero delle lesioni; il registro eventi comunica l'insorgenza e il recupero.

## v0.4.0 - Recupero medico
- Aggiunti oggetti medici: bende pulite (+15 salute) e kit di primo soccorso (+35 salute).
- Il sistema di utilizzo oggetti applica e mostra anche il recupero della salute.
- Aggiunte bende recuperabili sul Percorso 1 e un kit in un ambulatorio abbandonato a Smeraldopoli.
- L'uso di un oggetto che non può migliorare nessuna statistica non consuma l'oggetto.


## v0.3.0 - Conseguenze dei bisogni critici
- Fame e sete a zero ora causano danni alla salute dopo un intervallo di tempo di gioco.
- La disidratazione causa danni più rapidamente della fame.
- I contatori dei danni residui vengono salvati e ripristinati.
- Mangiare o bere interrompe il relativo accumulo di danni.
- Il registro eventi comunica i danni subiti e la salute rimanente.
- I danni non portano la salute sotto zero.


## v0.2.0 - Bisogni di sopravvivenza
- Aggiunti i valori di fame e sete alla scheda del personaggio.
- Il tempo impiegato da viaggi, riposo, esplorazione e raccolta riduce fame e sete.
- Gli intervalli di consumo vengono salvati, così le azioni brevi si sommano correttamente.
- Conserve, acqua e bacche hanno effetti distinti e visibili.
- Aggiunti avvisi nel registro quando fame o sete diventano critiche o raggiungono zero.
- I salvataggi precedenti sono compatibili: i nuovi valori partono da 100/100.

## v0.1.0 - Stabilità del prototipo
- Corretti i percorsi dei moduli JavaScript per hosting case-sensitive.
- Collegata Smeraldopoli al Percorso 1 con un viaggio esplicito di quattro ore.
- Uniformato il meteo di Smeraldopoli al formato previsto dall'interfaccia.
- Aggiunto un controllo di stato all'azione di raccolta risorse.
- Rimosso il vecchio duplicato non utilizzato `assets/Player.js`.
- Aggiornata la documentazione dell'architettura.


## v1.6.0

- Aggiunta una rete iniziale di punti d'interesse contestuali a Biancavilla, Percorso 1 e Smeraldopoli.
- I punti d'interesse si esaminano con costi di tempo ed energia; una volta registrati non si ripetono e restano salvati nel browser.
- Gli indizi individuati durante l'osservazione ora vengono salvati per località e ripristinati quando si rientra nella zona, anche dopo aver ricaricato la pagina.
- Aggiunta una sezione dedicata ai punti d'interesse con schede responsive e stato di completamento.
- Nuovi test automatici per la persistenza degli indizi e delle scoperte.


## v1.7.0

- Gli avvistamenti durante i viaggi diventano incontri contestuali con una scelta esplicita del giocatore.
- Aggiunte tre risposte: osservare da lontano, avvicinarsi con cautela oppure ritirarsi.
- Le scelte comportano costi distinti di tempo ed energia; ritirarsi non impone penalità artificiali.
- Gli incontri non avviano combattimenti automatici e vengono registrati nel registro eventi.
- La scheda dell'incontro è contestuale e scompare dopo la risoluzione.


## v2.0.0

- Aggiunto un registro persistente di contatti umani per Biancavilla, Percorso 1 e Smeraldopoli.
- Avvicinarsi a una traccia umana può stabilire un contatto locale coerente con la zona.
- Aggiunte interazioni distinte: conversazione breve e richiesta di informazioni.
- Le informazioni raccolte vengono registrate nel taccuino e non possono essere richieste ripetutamente allo stesso contatto.
- Aggiunti test per persistenza, dati corrotti e unicità delle informazioni condivise.

## v2.9.0
- Ricostruita la griglia desktop con aree CSS esplicite e classi assegnate dal DOM, evitando posizionamenti fragili basati su `nth-of-type`.
- Ripristinata una gerarchia coerente a tre colonne: profilo, luogo e azioni a sinistra; scena/mappa/taccuino al centro; contesto locale a destra.
- Ridotti i conflitti tra le regole CSS accumulate nelle versioni precedenti e aggiunti breakpoint dedicati a tablet e mobile.
- Aggiornata l'identità visiva del terminale e il numero di build.

## v4.6.0
- Ricostruito il montaggio del layout in uno script indipendente, eseguito prima degli handler dell'interfaccia.
- I pannelli hanno contenitori DOM reali prima che la logica di visualizzazione inizi, evitando che un errore in uno script successivo lasci inventario e deposito dispersi nella schermata.
- Consolidata la griglia desktop a tre colonne con scena centrale, pannelli contestuali a destra e registro in basso; layout a due colonne e mobile sotto breakpoint.
- Inventario e deposito restano accessibili dalla vista Zaino / Personaggio.
- Nessuna modifica al motore di gioco o alle chiavi di salvataggio.

## 0.30.0 · Qualità dei dati botanici

- Nuova pagina di controllo per famiglia botanica e ciclo di vita mancanti nei dossier di semi, perenni e spontanee.
- Ricerca e filtri per rendere più rapida la revisione dei dati incompleti.
- Collegamenti ai dossier e all'editor GitHub, con spiegazione del flusso di correzione.
- Nessun completamento automatico dei dati biologici sconosciuti.
