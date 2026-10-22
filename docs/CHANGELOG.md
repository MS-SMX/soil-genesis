## 0.40.0 — 2026-10-22

- Aggiunto il Registro lotti seme con identificativi univoci, origine, quantità, stato e luogo di conservazione.
- Aggiunta la registrazione di prove di germinazione con campione, conteggio, percentuale calcolata, durata, temperatura, metodo e note.
- Aggiunti backup JSON, importazione con controllo dei record, esportazione per lotto e pacchetto YAML/Markdown da revisionare prima del commit.
- I dati restano locali nel browser fino all'esportazione; nessun push remoto automatico.
- Aggiunti test per campi, persistenza locale, validazione del conteggio e formati di esportazione.

## 0.38.0 — 2026-10-22

- Aggiunto il Registro riproduzione per auditare le evidenze su impollinazione, isolamento, maturità del seme e popolazione.
- Distinti i dati già presenti dalle fonti specifiche effettivamente registrate.
- Aggiunti ricerca, filtri, fonti metodologiche e schema documentato `fonti_riproduzione`.
- Aggiunte evidenze riproduttive a livello di specie in 37 dossier; i valori restano indicativi e con limiti espliciti.

## 0.37.0 — 2026-10-22

- Estese le fonti botaniche applicate da 49 a 59 dossier.
- Aggiunte fonti per specie ornamentali, aromatiche e colture minori.
- Documentate la sinonimia del carciofo e le alternative esplicite dei cicli annuale/biennale e annuale/subarbusto.
- Corrette le due grafie `Heliantus annuus` in `Helianthus annuus`, con tracciabilità nelle note di rilascio.
- Aggiornati test e documentazione del registro.

## 0.36.0 — 2026-10-22

- Estese le fonti botaniche applicate da 41 a 49 dossier.
- Documentati cipollotto Ishikura, alchechengio peruviano, arachide, asparago, menta coreana, kiwano, spinacio e tomatillo.
- Corretta e documentata la grafia scientifica del kiwano (*Cucumis metuliferus*).
- Aggiornati test e documentazione del registro.

## 0.35.0 — Estensione delle fonti botaniche

- Fonti applicate a 41 dossier per famiglia botanica e ciclo di vita.
- Estensione a porro, cavoli, meloni, lattuga, rucola coltivata, zucca moscata e pisello.
- Sinonimia tassonomica del pisello documentata senza modifica automatica del dossier.
- Differenze nei cicli di vita mantenute visibili per revisione.

## 0.34.0 — Fonti botaniche e alternative esplicite

- Esteso il registro da 22 a 31 dossier, aggiungendo fonti per angurie, sedani, ravanello, finocchio, aneto, prezzemolo e coriandolo.
- Il confronto del ciclo di vita accetta un valore del dossier quando corrisponde a una delle alternative esplicitamente elencate dalla fonte.
- La discrepanza sul ciclo del finocchio e la sinonimia tassonomica del ravanello sono documentate senza riscrivere automaticamente i dossier.
- Aggiornati test automatici e documentazione del registro.

## 0.33.0 — Fonti botaniche estese

- Estese le fonti a 22 dossier per undici taxa complessivi, includendo colture importanti per rotazioni e conservazione dei semi.
- Documentati i casi in cui la famiglia botanica riportata nel dossier usa sinonimi storici o grafie non standard.
- Il registro riconosce alcune equivalenze familiari note senza modificare automaticamente i dossier.
- Aggiunti test e documentazione delle fonti e dei limiti interpretativi.

## 0.32.0 — Fonti botaniche applicate ai dossier

- Registrate fonti per famiglia botanica e ciclo di vita in 14 dossier appartenenti a cinque taxa già presenti.
- Usate fonti Kew Plants of the World Online e University of Maryland Extension, con data di verifica 2026-10-22.
- Aggiunta documentazione delle fonti e dei limiti interpretativi.
- Nessuna classificazione nuova dedotta automaticamente e nessun valore principale del dossier sovrascritto.

## 0.31.0 — Registro delle fonti botaniche

- Aggiunta una vista per registrare e controllare le fonti di famiglia botanica e ciclo di vita separatamente.
- Verificati presenza di fonte, URL, data e valore dichiarato; segnalate le discrepanze testuali per revisione manuale.
- Aggiunti ricerca, filtri, collegamenti ai dossier e documentazione dello schema YAML.
- Nessuna fonte o classificazione viene inventata o applicata automaticamente.

## 0.29.0 — Contesto delle rotazioni nello storico

- Aggiunta una vista che incrocia i piani colturali con le osservazioni della stessa parcella.
- Evidenzia famiglie botaniche ripetute solo quando le famiglie sono registrate esplicitamente.
- Distingue osservazioni fitosanitarie, confronti descrittivi e dati mancanti.
- Aggiunti test e documentazione dedicati.

## 0.28.0 — Storico agronomico unificato
- Integrate nella cronologia le osservazioni pubblicate e locali delle condizioni della parcella.
- Aggiunte transizioni descrittive tra colture registrate in stagioni diverse della stessa parcella.
- Estesi ricerca, conteggi e filtri; chiarito che le transizioni non costituiscono valutazioni della qualità della rotazione.

## 0.27.0 — Lettura temporale delle condizioni
- Aggiunto un riepilogo per parcella che confronta le ultime due osservazioni disponibili per drenaggio, irrigazione, residui e stato fitosanitario.
- Distinti cambiamenti registrati, valori invariati, singole osservazioni e dati mancanti.
- Il confronto considera le osservazioni fino all'anno selezionato e rispetta il filtro della parcella.
- Esplicitato che il confronto è descrittivo e non attribuisce causalità né diagnosi.

## 0.26.0 — Storico temporale delle condizioni
- Aggiunto un registro datato delle condizioni osservate per parcella, separato dal piano colturale annuale.
- Le osservazioni parziali si aggiungono senza sovrascrivere dati precedenti; supportati backup JSON e pubblicazione in `_data/parcel-condition-history.yml`.
- Aggiunti controlli di validazione e documentazione sui limiti interpretativi.

## 0.25.0 — Condizioni strutturate della parcella
- Aggiunti campi opzionali per drenaggio, irrigazione, residui colturali e stato fitosanitario.
- Mostrato un riepilogo compatto delle condizioni registrate e collegati i valori ai promemoria gestionali pertinenti.
- Estesi backup JSON e pacchetto YAML pubblicabile mantenendo compatibilità con le registrazioni precedenti.
- Aggiunti test statici e documentazione sui limiti dei dati osservativi.

## 0.24.0 — Corrispondenze fitosanitarie trasparenti
- Distinti i match per famiglia botanica da quelli basati su nome o slug, con istruzioni per verificare la specie.
- Escluse le piante perenni dai collegamenti fitosanitari usati per ragionare sulla rotazione annuale.
- Aggiunti promemoria di gestione attivati soltanto da condizioni esplicitamente annotate nelle note della parcella.
- Documentazione: `docs/MATRICE-FITOSANITARIA-0.24.0.md` e `docs/RELEASE-NOTES-0.24.0.md`.

## 0.23.0 — Interfaccia fitosanitaria compatta
- Schede fitosanitarie, fonti e dettagli secondari chiusi per impostazione predefinita.
- Riepiloghi delle rotazioni più sintetici, con avvisi fitosanitari rilevanti mantenuti visibili.
- Link contestuali che aprono il profilo corretto e portano alla relativa scheda.
- Aggiunta la documentazione `docs/MIGLIORIE-UI-0.23.0.md` e le note `docs/RELEASE-NOTES-0.23.0.md`.

# Soil Genesis · Changelog

## 0.22.0 — Schede fitosanitarie collegate alle colture

### Aggiunto
- Collegate le schede fitosanitarie alle colture ospiti presenti nel Piano parcelle e nel pannello di lettura delle rotazioni.
- Ogni corrispondenza indica la pianta registrata e una misura preventiva tratta dalla scheda completa.
- I collegamenti aprono la scheda pertinente nella libreria e chiariscono che la compatibilità botanica non dimostra la presenza del patogeno.
- Aggiunta la documentazione `docs/MATRICE-FITOSANITARIA-0.22.0.md`.

### Limiti noti
- La corrispondenza usa famiglie, nomi comuni e slug; può non riconoscere sinonimi o nomi non registrati. Non diagnostica malattie e non sostituisce la verifica delle fonti locali.
- Build Jekyll completa e verifica nel browser non eseguite in questo ambiente.

---

## 0.21.0 — Schede fitosanitarie strutturate

### Aggiunto
- Inserita una libreria consultabile di sette schede: Phytophthora capsici, Fusarium wilt del pomodoro, Alternaria/early blight, gummy stem blight/black rot delle cucurbitacee, maculatura angolare, clubroot e marciume bianco degli Allium.
- Ogni scheda distingue persistenza, vie di diffusione, condizioni favorevoli, intervallo di rotazione indicato dalla fonte e misure complementari.
- Aggiunti collegamenti diretti a fonti universitarie di extension e IPM; le schede sono consultabili anche quando non è ancora stato registrato un piano per la stagione selezionata.
- Aggiunta la matrice documentale `docs/MATRICE-FITOSANITARIA-0.21.0.md`.

### Limiti noti
- Le schede sono sintesi informative, non strumenti diagnostici. Le raccomandazioni provengono soprattutto da fonti universitarie statunitensi e vanno adattate al contesto locale italiano.
- I 79 test esistenti coprono altri moduli e non verificano direttamente i contenuti fitopatologici appena aggiunti; sono stati controllati sintassi JavaScript e collegamenti alle fonti.
- Build Jekyll completa e verifica nel browser non eseguite in questo ambiente.

---

## 0.20.0 — Regole fitosanitarie per Brassicaceae e Allium

### Aggiunto
- Aggiunta una regola condizionale per clubroot / ernia del cavolo, con intervallo operativo di sette anni quando la malattia è menzionata nello storico della parcella.
- Aggiunta una regola per il marciume bianco degli Allium. L'avviso resta attivo anche oltre dieci anni perché gli sclerozi possono sopravvivere per decenni e la rotazione da sola è limitata.
- Aggiunti link alle fonti universitarie di extension e documentazione dei limiti nel file `docs/MATRICE-AGRONOMICA-0.20.0.md`.

### Limiti noti
- I controlli sono condizionali alle note e non diagnosticano malattie. Le soglie sono contestuali e non garantiscono assenza del patogeno.
- Build Jekyll completa e test browser da eseguire nell'ambiente di sviluppo con le dipendenze del progetto.

---

## 0.15.0 — Checkbox compatte e lettura delle rotazioni

### Modificato
- Ridimensionate le checkbox del selettore piante nel Piano parcelle: 14 × 14 px, senza ereditare altezza e larghezza dei campi testuali.

### Aggiunto
- Pannello “Lettura delle rotazioni” che confronta per parcella le stagioni registrate, incluse le colture pubblicate nel repository e le bozze locali.
- Le piante selezionate conservano la famiglia botanica quando disponibile; il pannello segnala la ripetizione di una famiglia tra l'ultima stagione registrata e quella selezionata.
- Le famiglie mancanti vengono indicate come da verificare; il sistema non inventa classificazioni né propone prescrizioni assolute.

### Limiti noti
- Le segnalazioni sono controlli preliminari: non valutano patogeni, fabbisogni, fertilità, consociazioni incompatibili o durata delle perenni.
- Il confronto usa il piano stagionale, non deduce una coltura dal solo testo degli eventi. Per uno storico utile, registrare le colture per parcella e stagione.
- La build Jekyll completa deve essere verificata nell'ambiente di sviluppo con Bundler e le dipendenze del progetto.

---

## 0.13.0 · Diario per parcelle e rotazioni

### Aggiunto

- Selettore strutturato delle 120 posizioni: settori A1–G6 per entrambi gli esagoni, sei porte rampicanti per esagono, cinque file divise in due metà per ciascun mezzo esagono, due settori del quadrato centrale, Tunnel delle Liane e filare classico.
- Ogni evento locale può essere associato a una parcella; la posizione compare nella cronologia e nei file Markdown pubblicati.
- Piano annuale delle colture per parcella, senza data d'impianto obbligatoria, salvato separatamente dagli eventi datati.
- Il pacchetto per il push contiene sia gli eventi sotto `_logs/` sia il piano sotto `_data/plot-plantings.yml`.
- Backup JSON esteso per includere anche le colture di base; importazione non distruttiva per eventi e piani.
- La ricerca e il filtro per parcella agiscono anche sulle registrazioni pubblicate e sul piano pubblicato.

### Limiti noti

- Il diario e il piano non sono sincronizzati automaticamente tra dispositivi: vanno esportati e pubblicati tramite Git.
- La build Jekyll completa deve essere verificata nell'ambiente di sviluppo con Bundler e le dipendenze del progetto.


## 0.10.0 · Diario portatile

### Aggiunto

- Esportazione di tutti gli eventi del Diario di rigenerazione in un file JSON con versione e data di esportazione.
- Importazione di backup JSON compatibili.
- Validazione minima dei dati importati e segnalazione degli errori.
- Unione non distruttiva: gli eventi già presenti vengono mantenuti e gli identificativi duplicati ignorati.

### Modificato

- Avviso del Diario più esplicito: i dati sono locali al browser e il backup va conservato anche altrove.
- Documentazione aggiornata alla versione 0.10.0.

### Limiti noti

- Il diario resta locale al browser. Esportazione/importazione non crea sincronizzazione tra utenti o dispositivi.
- La build Jekyll completa deve essere verificata nell'ambiente di sviluppo con Bundler e le dipendenze del progetto.


## 0.14.0 — Consociazioni e pagine separate
- Separati Registro eventi e Piano parcelle in due pagine con navigazione dedicata.
- Le colture del piano si selezionano dall’archivio sementi e dalla collezione Perenni, anche in gruppi di consociazione.
- Rimossi dal menu eventi crescita, fioritura, impollinazione, selezione, estrazione, essiccazione, rigenerazione e criticità.
- Gli eventi possono collegarsi a sementi o piante perenni.
