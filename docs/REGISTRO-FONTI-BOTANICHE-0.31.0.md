# Registro fonti botaniche — 0.31.0

## Scopo

`registro-fonti-botaniche.md` controlla la tracciabilità dei valori di famiglia botanica e ciclo di vita nelle collezioni `seeds`, `perennials` e `spontaneous`. Il registro non assegna valori, non effettua ricerche automatiche e non certifica l'affidabilità delle fonti.

## Schema del front matter

Le fonti sono annotate per singolo campo nel dossier:

```yaml
fonti_botaniche:
  famiglia:
    valore: "Fabaceae"
    fonte: "Nome dell'ente o della risorsa consultata"
    url: "https://esempio.org/pagina-consultata"
    data_verifica: "2026-10-22"
  ciclo_vita:
    valore: "annuale"
    fonte: "Nome dell'ente o della risorsa consultata"
    url: "https://esempio.org/pagina-consultata"
    data_verifica: "2026-10-22"
```

I valori qui sopra sono un esempio di struttura, non una fonte reale da copiare. Sostituire ogni valore con quello effettivamente riportato nella fonte consultata. Usare una data ISO `AAAA-MM-GG`.

## Regole del controllo

- Una fonte è considerata strutturalmente completa solo se ha valore, fonte/titolo, URL HTTP(S) e data di verifica.
- Il valore riportato dalla fonte viene confrontato testualmente, senza distinzione tra maiuscole e minuscole, con il campo nel dossier.
- Le differenze testuali sono soltanto richieste di revisione: possono derivare da sinonimi, ranghi tassonomici o traduzioni e non dimostrano automaticamente un errore scientifico.
- Il registro non valuta autorevolezza, data di aggiornamento della fonte o coerenza biologica del contenuto.
- Famiglia e ciclo di vita richiedono fonti distinte se la fonte consultata non supporta entrambe le affermazioni.
- Nessuna classificazione viene compilata automaticamente e nessuna modifica viene scritta dal sito statico.
