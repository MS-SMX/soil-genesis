# Matrice fitosanitaria 0.22.0

## Collegamento coltura-scheda

Le schede fitosanitarie sono collegate alle colture registrate nel Piano parcelle e nel pannello delle rotazioni tramite gli stessi identificativi delle regole `diseaseRotationRules` in `assets/js/regeneration-diary.js`.

| Scheda | Corrispondenza attuale | Limite principale |
|---|---|---|
| *Phytophthora capsici* | Famiglia Cucurbitaceae; termini per pomodoro, melanzana e peperone; legumi del genere *Phaseolus* riconosciuti dai nomi comuni/slug | Non tutte le cultivar o specie ospiti sono rappresentate da una famiglia botanica sufficientemente precisa |
| Fusariosi vascolare | Termini ospite per pomodoro, melanzana e peperone | Il genere *Fusarium* comprende specie e forme speciali con intervalli d'ospite diversi; il profilo è orientativo e la diagnosi va confermata |
| Alternaria / early blight | Termini per pomodoro, patata e peperone | Non equivale a una previsione di infezione e non copre tutte le specie di *Alternaria* |
| Gummy stem blight / black rot | Famiglia Cucurbitaceae | Gli ospiti spontanei e le differenze fra specie non sono automaticamente censiti |
| Maculatura angolare delle cucurbitacee | Famiglia Cucurbitaceae | La qualità del seme e le condizioni di bagnatura non sono deducibili dalla sola coltura registrata |
| Ernia del cavolo / clubroot | Famiglia Brassicaceae e termini comuni registrati | Le infestanti ospiti possono mantenere il patogeno anche quando non sono nel piano colture |
| Marciume bianco degli Allium | Famiglie Alliaceae/Amaryllidaceae e termini comuni per gli Allium | La corrispondenza non rileva contaminazione del suolo né conferma la presenza degli sclerozi |

## Comportamento dell'interfaccia

- Il Piano parcelle mostra le schede che corrispondono alle colture registrate.
- Ogni corrispondenza indica il nome della pianta ospite rilevata e una misura preventiva dalla scheda.
- Il collegamento apre la scheda completa nella libreria della pagina.
- L'interfaccia esplicita che compatibilità botanica non significa presenza del patogeno.
- Le segnalazioni storiche restano distinte dai collegamenti informativi: una scheda può essere pertinente anche se non è stata registrata alcuna malattia nella parcella.

## Limiti

La corrispondenza usa famiglie botaniche, nomi comuni e slug, non un motore tassonomico completo. Non sono dedotte diagnosi, infezioni attive, pressione d'inoculo o efficacia di una misura. Prima di prendere decisioni agronomiche pluriennali, verificare il patogeno e consultare fonti fitosanitarie locali.
