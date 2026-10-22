# Soil Genesis · Changelog

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
