# Project Exodus v4.12.0

La v4.12.0 permette di confrontare esplicitamente le testimonianze di Mara ed Elio dopo aver raccolto entrambe. Il confronto viene registrato nel taccuino come fonte mista, richiede 5 minuti e non trasforma la compatibilità degli indizi in una conferma. La possibilità è persistente e non si ripete per lo stesso contatto.


La v4.3.0 corregge il difetto che impediva ai contenitori delle tre colonne di occupare le aree dichiarate nella griglia CSS. Ora profilo/azioni, scena centrale, pannelli contestuali e registro sono assegnati esplicitamente alle rispettive aree. Il motore di gioco e i salvataggi non sono stati modificati.


La v4.0.0 aggiunge al laboratorio di ipotesi un quadro d'insieme con conteggio di ipotesi, personaggi citati, eventi collegati, fonti riutilizzate e contraddizioni annotate. Quando una fonte è collegata a più ipotesi, il gioco segnala che questo riutilizzo non equivale a una conferma indipendente. Il riepilogo è solo organizzativo e non modifica il mondo simulato.

## v3.9.0 — Provenienza delle fonti

- Le osservazioni ambientali vengono classificate come osservazioni dirette; gli esiti di tracce come eventi/esiti; le informazioni e gli incontri con personaggi registrano il nome del contatto e il contesto.
- Le fonti collegate alle ipotesi mostrano provenienza, personaggio quando disponibile e contesto; gli stessi metadati sono inclusi nell’esportazione TXT.
- Le voci precedenti senza metadati restano compatibili e vengono indicate come non classificate.
- La provenienza documenta come è stata raccolta un’informazione, ma non ne garantisce la veridicità e non modifica il mondo simulato.

## v3.8.0 — Natura delle affermazioni

- Ogni ipotesi può essere classificata come osservazione diretta, testimonianza ricevuta, deduzione personale o fonte mista/non chiarita.
- La classificazione è visibile nella scheda e nell'esportazione TXT.
- Le ipotesi create nelle versioni precedenti restano compatibili e vengono mostrate come fonti miste/non chiarite se prive della nuova informazione.
- La classificazione non misura automaticamente l'attendibilità e non modifica il mondo simulato.

## v3.6.0 — Fonti collegate alle ipotesi

Le ipotesi possono citare osservazioni già registrate nel taccuino. Le fonti vengono mostrate nella scheda e incluse nell’esportazione TXT quando sono ancora disponibili. È un collegamento documentale personale, non una verifica automatica.

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

## v3.3.0 — Deduzioni personali
Il taccuino include un laboratorio per registrare ipotesi, indicare gli indizi e i dubbi che le motivano, associarle a una località e rivalutarle nel tempo. Le ipotesi sono appunti privati persistenti: non alterano automaticamente condizioni, incontri o spostamenti del mondo simulato. Sono incluse nell'esportazione testuale del taccuino.

# Project Exodus v3.7.0

## Novità v3.2.0
Le annotazioni sulla mappa sono promemoria personali e non cambiano il mondo, le probabilità o la disponibilità dei viaggi. Puoi aggiungere note testuali ai percorsi, cercare nel taccuino ed esportare indizi e promemoria in un file TXT.

## Nota sulle versioni precedenti
Nella v3.1.0 le annotazioni erano collegate alle probabilità e ai blocchi di viaggio. Questo comportamento è stato rimosso nella v3.2.0: le annotazioni sono esclusivamente promemoria personali e non alterano il mondo di gioco.


## Novità v3.0.0
La scena centrale include ora i punti d'interesse della località come controlli operativi. Esaminare un punto dal feed locale o dal pannello Punti d'interesse produce lo stesso risultato e registra la scoperta nel taccuino e nel registro eventi. I punti già esaminati vengono mostrati come registrati. Il feed resta un placeholder illustrato, non un ambiente liberamente esplorabile.

## v2.8.0 — Interfaccia

La schermata principale usa una griglia a tre colonne: profilo, luogo e spostamenti a sinistra; scena centrale con schede **LUOGO / MAPPA / TACCUINO RAPIDO**; pannelli contestuali a destra; registro nella fascia inferiore. La scheda iniziale è LUOGO. Su schermi stretti i pannelli si dispongono in colonna.

# Project Exodus

## Novità v2.7.0
- Rifinitura visiva del terminale: contrasto, gerarchia dei pannelli, schede e stati di focus più leggibili.
- Le annotazioni cartografiche persistono nel browser. Un percorso segnato come **interrotto** disabilita i viaggi che lo attraversano; le altre annotazioni restano promemoria.
- La schermata LUOGO/MAPPA/TACCUINO resta alternabile.

# Project Exodus v2.7.0

## Interfaccia operativa e cartografia annotabile
- Nuove schede centrali: Mappa, Luogo e Taccuino rapido.
- Scena locale stilizzata e descrizione sincronizzata con la località caricata. La scena è un placeholder visivo, non una fotografia né un ambiente già esplorabile.
- Annotazioni personali dei percorsi: libero, interrotto, pericoloso, da verificare. Si cambia stato con doppio clic o clic destro sui nodi dei percorsi; per i percorsi non ancora implementati è disponibile anche il clic singolo.
- Note operative salvate nel browser.
- Le annotazioni non bloccano ancora il sistema di viaggio: sono promemoria dell'utente e non alterano le regole del mondo.

# Project Exodus v2.5.0 — mappa interattiva e navigazione

## Novità v2.5.0

- La selezione di una località sulla mappa usa direttamente i collegamenti disponibili, senza dipendere dai controlli nascosti della schermata principale.
- I nodi indicano in modo accessibile la posizione corrente, le destinazioni raggiungibili e quelle non ancora implementate.
- Corretto il doppio indicatore grafico sulla posizione corrente.

## Novità v2.4.0

- Menu a viste: Schermata, Mappa di Kanto, Zaino / Personaggio, Taccuino e Registro.
- Registro compatto con le ultime attività nella schermata principale e vista dedicata per consultare gli eventi precedenti.
- Mappa schematica interattiva con città e percorsi ufficiali come riferimenti. Solo i collegamenti già implementati nei dati del mondo sono percorribili; le località grigie sono segnaposto per il lavoro futuro.
- Indizi originali ed esiti del loro inseguimento vengono salvati separatamente nel taccuino. I filtri distinguono indizi, contatti, informazioni, luoghi e deduzioni.
- Raggruppamento delle azioni e dei sistemi per ridurre la dispersione visiva.

# Project Exodus

Prototipo browser-based di un RPG survival testuale ambientato in un mondo Pokémon collassato.

## Avvio locale
Apri la cartella con VS Code e avvia `index.html` tramite un server locale, ad esempio l'estensione Live Server. I moduli JavaScript e i dati JSON richiedono un server HTTP; l'apertura diretta con `file://` non è supportata.

## Funzioni attuali
- Orologio reale e orologio del mondo.
- Profilo del personaggio con salute, energia, fame e sete.
- Viaggi tra località con durata esplicita e ritrovamenti occasionali legati alla località raggiunta.
- Riposo ed esplorazione.
- Raccolta di risorse, inventario e oggetti consumabili.
- Salvataggio locale di profilo, posizione, inventario, risorse già raccolte e registro eventi.
- Registro degli ultimi 30 eventi persistente tra ricaricamenti e riavvii.
- Inventario con peso per oggetto e capacità massima di 12 kg; la raccolta viene bloccata se il carico supera il limite.
- Depositi persistenti separati per località, con comandi per depositare e ritirare oggetti rispettando la capacità dello zaino.
- Fame e sete diminuiscono durante le azioni che fanno avanzare il tempo di gioco.

## Inventario

Ogni oggetto ha un peso indicativo. La capacità iniziale è di 12 kg; il peso totale è visibile nell’inventario. Se una risorsa supera la capacità residua, non viene raccolta e la fonte resta disponibile per un tentativo successivo.

## Salvataggi
Il prototipo usa `localStorage` del browser. I dati restano sul browser e sul dispositivo in uso; non sono ancora sincronizzati con un server.

- Oggetti medici utilizzabili per recuperare salute.
- Bende recuperabili sul Percorso 1 e kit di primo soccorso a Smeraldopoli.
- Lesioni persistenti: la privazione prolungata a salute critica può causare debilitazione.
- Le lesioni vengono salvate, trattate con bende o kit e recuperate gradualmente con il riposo, se fame e sete non sono critiche.

## Eventi e ritrovamenti durante i viaggi
Durante gli spostamenti può apparire un evento narrativo. Inoltre, con una probabilità del 20%, puoi trovare una piccola risorsa (bacche selvatiche oppure erbe spontanee). Il ritrovamento viene aggiunto all’inventario solo se resta spazio entro il limite di peso; altrimenti viene registrato come occasione persa. I ritrovamenti non consumano energia aggiuntiva e non cambiano la durata del viaggio.

## Avvistamenti ambientali
Durante alcuni viaggi (probabilità del 25%) puoi notare tracce, rumori o Pokémon selvatici. Gli avvistamenti variano in base alla località e sono solo descrittivi: non avviano combattimenti, non aggiungono oggetti e non modificano le statistiche.

## Versione
v2.5.0


## v0.3.0 — Conseguenze della fame e della sete

Quando sazietà o idratazione raggiungono zero, il personaggio inizia a perdere salute dopo un intervallo di tempo trascorso in quella condizione. La disidratazione provoca danni più rapidamente della fame. I contatori vengono salvati e ripristinati; mangiare o bere interrompe il relativo accumulo di danni. Le penalità si applicano al tempo di gioco consumato da azioni e viaggi, non al tempo reale trascorso con la pagina chiusa.


## v0.8.0

- Puoi abbandonare una singola unità o tutte le unità di un oggetto dall'inventario.
- L'operazione aggiorna subito il peso e viene registrata nel registro eventi.
- Gli oggetti abbandonati sono persi definitivamente in questa versione: non esiste ancora un sistema di recupero o deposito a terra.


### Esplorazione attiva (v1.7.0)
- Esamina i dintorni: 10 minuti e 3 energia.
- Segui una traccia: 20 minuti e 5 energia.
- Le tracce variano in base alla località; alcuni esiti possono offrire una risorsa.
- Le scelte e i risultati sono registrati nella cronologia.


### Esplorazione e punti d'interesse (v1.7.0)

Le località iniziali contengono punti d'interesse narrativi che possono essere esaminati pagando tempo ed energia. Le scoperte completate e gli indizi in sospeso sono salvati nel browser e restano associati alla località: lasciare una zona non cancella il lavoro fatto. I punti d'interesse non assegnano ricompense automatiche quando non sono giustificate dalla scena; forniscono informazioni e memoria del territorio.


### Taccuino di campo (v2.0.0)
- Le scoperte dei punti d'interesse e gli esiti degli avvistamenti vengono conservati nel taccuino del browser.
- Le annotazioni riportano località, categoria e orario; il taccuino mantiene le 40 più recenti.
- Osservare, avvicinarsi e ritirarsi producono resoconti diversi in base al tipo di presenza.
- Il sistema resta osservativo: non avvia combattimenti né infligge danni arbitrari.


### v2.0.0: contatti locali

Gli avvicinamenti a tracce umane possono sbloccare un contatto locale nelle tre aree principali. È possibile scambiare qualche parola o chiedere informazioni; le informazioni ottenute vengono salvate nel taccuino e il registro dei contatti persiste nel browser.


### v2.1.0: memoria sociale e indizi collegati

I personaggi ricordano le conversazioni già avvenute e possono rispondere in modo diverso al ritorno del giocatore. Alcune informazioni si arricchiscono quando sono già stati raccolti indizi da altri contatti: le tracce sul sentiero, la recinzione aperta e il pannello intermittente possono suggerire un collegamento, senza presentarlo come una certezza. Lo stato resta salvato nel browser e non richiede di azzerare i progressi.


### v2.2.0: indizi che cambiano l'esplorazione
- Le informazioni ottenute da Mara possono far emergere una pista aggiuntiva sul Percorso 1.
- Le informazioni di Elio permettono di esaminare il giunto di alimentazione del pannello a Smeraldopoli.
- I nuovi punti d'interesse sono persistenti e compaiono solo dopo aver raccolto l'informazione che li rende riconoscibili.
- Le scoperte aggiungono conferme circoscritte, non risolvono automaticamente il mistero.

## Interfaccia v2.5.0
La schermata principale mostra soltanto posizione, azioni, collegamenti, stato sintetico e contesto locale richiudibile. Profilo completo, inventario, taccuino e registro esteso si consultano dalle rispettive schede. La mappa di Kanto è uno schema nostalgico provvisorio: le destinazioni non ancora implementate sono riferimenti geografici e non possono essere selezionate.


## v4.4.0: layout principale

Questa versione corregge la griglia di gioco nascondendo gli elementi introduttivi legacy che venivano auto-posizionati come celle implicite. Le colonne e le aree principali hanno assegnazioni esplicite; profilo e inventario restano nella vista dedicata al personaggio.

## v4.5.0 — Ricostruzione deterministica della schermata

- Ricostruita la disposizione dei pannelli con spostamento esplicito dei nodi, senza dipendere dal genitore HTML precedente.
- La schermata iniziale mostra la scena del luogo nel pannello centrale; la mappa resta disponibile nella scheda MAPPA.
- Inventario e deposito sono esclusi dalla schermata principale e mostrati nella vista Zaino / Personaggio.
- Il registro resta in una fascia inferiore con scorrimento interno.
- Conservati motore, meccaniche e salvataggi.

### v4.6.0: layout ricostruito
La struttura delle aree di gioco viene montata in un bootstrap autonomo prima degli script degli eventi. Questo rende il posizionamento dei pannelli indipendente dalla riuscita degli handler successivi e consolida la vista desktop a tre colonne. Inventario e deposito sono consultabili nella scheda Zaino / Personaggio. Motore e salvataggi non sono stati modificati.


## v4.11.0 — Primo dossier investigativo giocabile

- Aggiunto il dossier “Tracce verso nord” nel taccuino, con tre tappe che si aggiornano in base a informazioni e scoperte realmente registrate.
- Il percorso collega la testimonianza di Mara a Biancavilla, il punto d’interesse sul Percorso 1 e la testimonianza di Elio.
- La conclusione distingue la convergenza degli indizi dalla certezza: conferma passaggi recenti compatibili, ma non identifica persone o destinazione.
- Gli esami diretti dei punti d’interesse registrano ora esplicitamente la provenienza della fonte.
- Nessun reset dei salvataggi: il dossier deriva dagli stati già persistenti nel browser.
