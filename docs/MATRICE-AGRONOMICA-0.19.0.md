# Soil Genesis 0.19.0 — Matrice agronomica specie/ospite

## Scopo e limiti

Questa versione aggiunge controlli fitosanitari condizionali al Piano parcelle. Non è un sistema diagnostico: una menzione nelle note può indicare un sospetto, un'osservazione o una diagnosi già verificata. Il programma non può distinguere queste possibilità senza conferma dell'utente.

Le regole si attivano soltanto quando il nome di una malattia è scritto nelle note di una coltura registrata o di un evento del Registro nella stessa parcella. Il controllo confronta la stagione della menzione con la stagione della coltura attuale e mostra il collegamento alla fonte utilizzata. Non interpreta automaticamente sintomi o immagini.

## Matrice delle regole attive

| Malattia menzionata | Ospiti considerati dal controllo | Intervallo indicativo usato | Fonte e cautela |
|---|---|---|---|
| *Phytophthora capsici* | Cucurbitaceae; pomodoro, melanzana, peperone e piante riconoscibili come fagioli | 3 anni | University of Minnesota Extension. Il patogeno ha un ampio intervallo di ospiti e può persistere nel suolo; la rotazione da sola può non bastare. |
| Fusariosi / *Fusarium* | Pomodoro, melanzana e peperone identificati dal nome comune o dallo slug | 5 anni come soglia di avviso conservativa | University of Minnesota Extension indica 3–5 anni o più per colture suscettibili. Specie e razze differiscono: confermare la diagnosi e non interpretare la famiglia come prova di suscettibilità. |
| *Alternaria solani* / early blight / alternariosi precoce | Pomodoro, patata e peperone identificati dal nome comune o dallo slug | 2 anni | University of Minnesota Extension raccomanda di ruotare lontano da pomodoro e colture correlate per almeno due anni. |
| Gummy stem blight / black rot delle cucurbitacee | Cucurbitaceae | 2 anni | University of Minnesota Extension raccomanda che passino almeno due anni prima di riportare cucurbitacee nella stessa parcella. |
| Maculatura angolare delle cucurbitacee / angular leaf spot | Cucurbitaceae | 2 anni | University of Minnesota Extension raccomanda almeno due anni prima di riportare cucurbitacee nella stessa parcella. |

**Interpretazione della soglia:** è un filtro per generare un avviso quando l'intervallo trascorso è inferiore a quello operativo della regola. Non dimostra che il rischio sia presente prima della soglia né che sia assente dopo. Nel caso del Fusarium, la fonte dice "3–5+ anni"; il valore di cinque anni è scelto per mantenere l'avviso attivo più a lungo, non perché sia un limite biologico universale.

## Evidenze generali

- **Zhang et al. (2025), Nature Communications**, *Crop rotations synergize yield, nutrition, and revenue: a meta-analysis*, DOI [10.1038/s41467-025-64567-9](https://doi.org/10.1038/s41467-025-64567-9). Meta-analisi di 3.663 osservazioni da prove di campo: gli effetti medi delle rotazioni sulla coltura successiva sono positivi, con vantaggi medi maggiori per le leguminose come precoltura rispetto alle non leguminose. Non fornisce una prescrizione per ogni specie in ogni orto.
- **Tamburini et al. (2020), Science Advances**, *Agricultural diversification promotes multiple ecosystem services without compromising yield*, DOI [10.1126/sciadv.aba1715](https://doi.org/10.1126/sciadv.aba1715). Sintesi di 98 meta-analisi: la diversificazione può sostenere biodiversità e diversi servizi ecosistemici, con risultati dipendenti dal contesto.
- **Li et al. (2023), PNAS**, *The productive performance of intercropping*, DOI [10.1073/pnas.2201886120](https://doi.org/10.1073/pnas.2201886120). Meta-analisi di 226 esperimenti: le consociazioni possono migliorare l'efficienza d'uso della terra per ottenere prodotti diversi, ma non garantiscono una resa maggiore della coltura singola più produttiva.

Queste meta-analisi peer-reviewed sostengono principi generali di rotazione e diversificazione. Gli intervalli fitosanitari della matrice provengono invece da **fonti universitarie di extension**, che traducono le raccomandazioni di gestione in indicazioni pratiche. Sono fonti autorevoli ma non equivalgono a singoli articoli peer-reviewed né garantiscono identici risultati in ogni regione.

## Fonti operative per malattie

1. University of Minnesota Extension, [Phytophthora](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/phytophthora).
2. University of Minnesota Extension, [Fusarium wilt](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/fusarium-wilt).
3. University of Minnesota Extension, [Early blight in tomato and potato](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/early-blight-in-tomato-and-potato).
4. University of Minnesota Extension, [Gummy stem blight and black rot](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/gummy-stem-blight-and-black-rot).
5. University of Minnesota Extension, [Angular leaf spot](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/angular-leaf-spot).
6. University of Minnesota Extension, [Managing plant diseases in the home garden](https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-problems/managing-plant-diseases-in-the-home-garden), per l'indicazione generale di 2–4 anni tra membri della stessa famiglia.

## Limiti noti

- I controlli per *Phytophthora capsici*, Alternaria e malattie delle cucurbitacee usano famiglie botaniche come proxy, non una determinazione di specie/cultivar o una diagnosi.
- Il controllo del Fusarium usa un insieme ristretto di ospiti nominati nella fonte, ma resta prudenziale: le razze del patogeno e la suscettibilità delle cultivar variano. Il valore non deve essere usato come piano di controllo fitosanitario autonomo.
- Il controllo cerca nomi di malattie scritti nelle note, non identifica automaticamente il patogeno. Una menzione non confermata può generare un avviso da verificare.
- Le infestanti ospiti, i residui, il drenaggio, la diffusione con acqua/attrezzi, le cultivar, il clima e la persistenza locale non sono ancora modellati come dati strutturati.
- Le colture perenni restano escluse dalla proposta di spostamento automatico.
- La finestra di tre anni per il confronto generico tra famiglie rimane una scelta operativa del programma; non è una regola universale di rotazione.
