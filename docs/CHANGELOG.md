# Soil Genesis · Changelog

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
