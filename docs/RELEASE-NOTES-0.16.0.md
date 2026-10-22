# Soil Genesis 0.16.0 — Storico agronomico e navigazione Gestione

## Modifiche

- Corretto Mezzo esagono 1: ora contiene quattro file intere, senza suddivisione A/B.
- Aggiunta una migrazione locale degli identificativi precedenti delle mezze file del Mezzo esagono 1; le colture che ricadevano nella stessa fila e stagione vengono riunite mantenendo le piante e le note.
- Spostati Registro eventi, Piano parcelle, Custode e Mappa miceliale sotto la nuova voce di navigazione **Gestione**.
- Aggiunta la pagina **Storico parcelle**, che unisce colture di base ed eventi in una cronologia filtrabile per parcella, intervallo di anni e testo.
- Lo storico distingue le bozze locali dalle registrazioni pubblicate e riduce i duplicati quando un dato locale è già presente nel repository.
- Rafforzato il CSS delle checkbox del Piano parcelle per mantenere dimensioni compatte anche in presenza di regole globali.

## Verifiche

- Controllo sintattico JavaScript eseguito sui moduli del Diario e dello Storico.
- File YAML del piano pubblicato letto correttamente da Ruby/Psych.
- Build completa Jekyll non eseguita in questo ambiente.
