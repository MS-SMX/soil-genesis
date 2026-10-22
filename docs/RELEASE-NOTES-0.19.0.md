# Soil Genesis 0.19.0 — Matrice agronomica specie/ospite

- Aggiunte regole fitosanitarie condizionali per *Phytophthora capsici*, Fusarium, Alternaria/early blight e due malattie delle cucurbitacee.
- Le regole si attivano solo se la malattia è menzionata nelle note del piano o in un evento registrato nella stessa parcella; le segnalazioni non vengono presentate come diagnosi.
- Ogni avviso specifico include un link alla fonte universitaria di extension utilizzata.
- Corrette le opzioni delle piante nel Diario di rigenerazione per esporre famiglia botanica e ciclo di vita, come già previsto nel Piano parcelle. Questo permette al confronto di usare i metadati delle piante in entrambe le pagine.
- Mantenuti distinti gli studi peer-reviewed sugli effetti generali della diversificazione dalle fonti operative di extension sugli intervalli per singole malattie.
- Documentati ospiti, intervalli usati, limiti e fonti in `docs/MATRICE-AGRONOMICA-0.19.0.md`.

Verifiche: `node --check` superato per `assets/js/regeneration-diary.js`; controlli statici sui link, metadati Liquid e integrità ZIP superati. Build Jekyll e verifica nel browser da eseguire dopo il push.
- La matrice legge anche gli eventi fitosanitari già pubblicati nel repository, non soltanto le bozze locali, e conserva la distinzione tra menzione registrata e diagnosi confermata.
