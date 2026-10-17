---
layout: default
title: Diario di rigenerazione
permalink: /diario-rigenerazione/
---

<div class="regen-page" id="regen-diary">
  <header class="regen-header">
    <div class="regen-kicker">SOIL GENESIS // FIELD OPERATIONS</div>
    <h1>DIARIO DI RIGENERAZIONE</h1>
    <p>Traccia semine, selezioni, raccolte e osservazioni. Ogni evento resta collegato all’accessione interessata, quando pertinente.</p>
  </header>

  <div class="regen-storage-note" role="note">
    <span class="regen-led" aria-hidden="true"></span>
    <span><strong>ARCHIVIO LOCALE</strong> · Le registrazioni vivono in questo browser, non sul server. Esporta periodicamente un backup JSON e conservalo anche altrove.</span>
  </div>

  <section class="regen-backup-panel" aria-labelledby="regen-backup-title">
    <div class="regen-section-heading">
      <span class="regen-index">00</span>
      <div>
        <h2 id="regen-backup-title">BACKUP / RIPRISTINO</h2>
        <p>Metti al sicuro il diario fuori da questo browser</p>
      </div>
    </div>
    <div class="regen-backup-actions">
      <button type="button" id="regen-export" class="regen-primary-button">ESPORTA BACKUP JSON</button>
      <button type="button" id="regen-import-trigger" class="regen-secondary-button">IMPORTA BACKUP JSON</button>
      <input type="file" id="regen-import-file" accept=".json,application/json" hidden>
    </div>
    <p class="regen-backup-help">L'esportazione crea un file con tutti gli eventi registrati. L'importazione aggiunge gli eventi del backup senza cancellare quelli già presenti e ignora i duplicati con lo stesso identificativo.</p>
    <p id="regen-backup-feedback" class="regen-feedback" aria-live="polite"></p>
  </section>

  <section class="regen-form-panel" aria-labelledby="regen-form-title">
    <div class="regen-section-heading">
      <span class="regen-index">01</span>
      <div>
        <h2 id="regen-form-title">REGISTRA UN EVENTO</h2>
        <p>Annotazione rapida dal campo</p>
      </div>
    </div>

    <form id="regen-form" class="regen-form">
      <label>
        <span>Data *</span>
        <input type="date" id="regen-date" name="date" required>
      </label>
      <label>
        <span>Categoria *</span>
        <select id="regen-category" name="category" required>
          <option value="Semina">Semina</option>
          <option value="Germinazione">Germinazione</option>
          <option value="Trapianto">Trapianto</option>
          <option value="Crescita">Crescita / sviluppo</option>
          <option value="Fioritura">Fioritura</option>
          <option value="Impollinazione">Impollinazione</option>
          <option value="Selezione">Selezione</option>
          <option value="Raccolta">Raccolta</option>
          <option value="Estrazione">Estrazione del seme</option>
          <option value="Essiccazione">Essiccazione</option>
          <option value="Conservazione">Conservazione</option>
          <option value="Rigenerazione">Rigenerazione / rinnovo</option>
          <option value="Criticità">Criticità / perdita</option>
          <option value="Osservazione">Osservazione</option>
          <option value="Altro">Altro</option>
        </select>
      </label>
      <label class="regen-field-wide">
        <span>Accessione collegata</span>
        <select id="regen-seed" name="seed">
          <option value="">Nessuna accessione specifica</option>
          {% assign regen_seeds = site.seeds | sort_natural: "nome_comune" %}
          {% for seed in regen_seeds %}
            <option value="{{ seed.slug | escape }}">{{ seed.nome_comune | default: seed.title | escape }}{% if seed.nome_scientifico %} · {{ seed.nome_scientifico | escape }}{% endif %}</option>
          {% endfor %}
        </select>
      </label>
      <label class="regen-field-wide">
        <span>Osservazioni / risultato *</span>
        <textarea id="regen-notes" name="notes" rows="4" placeholder="Cosa è stato fatto? In quali condizioni? Qual è stato l'esito?" required></textarea>
      </label>
      <div class="regen-form-actions regen-field-wide">
        <button type="submit" class="regen-primary-button">+ REGISTRA EVENTO</button>
        <span id="regen-form-feedback" class="regen-feedback" aria-live="polite"></span>
      </div>
    </form>
  </section>

  <section class="regen-history-panel" aria-labelledby="regen-history-title">
    <div class="regen-section-heading">
      <span class="regen-index">02</span>
      <div>
        <h2 id="regen-history-title">CRONOLOGIA</h2>
        <p id="regen-count">Nessun evento registrato</p>
      </div>
    </div>

    <div class="regen-filters" aria-label="Filtri cronologia">
      <label>
        <span>Cerca nel diario</span>
        <input type="search" id="regen-search" placeholder="Nota, accessione, categoria…">
      </label>
      <label>
        <span>Categoria</span>
        <select id="regen-filter-category">
          <option value="">Tutte le categorie</option>
          <option>Semina</option><option>Germinazione</option><option>Trapianto</option><option>Crescita</option><option>Fioritura</option><option>Impollinazione</option><option>Selezione</option><option>Raccolta</option><option>Estrazione</option><option>Essiccazione</option><option>Conservazione</option><option>Rigenerazione</option><option>Criticità</option><option>Osservazione</option><option>Altro</option>
        </select>
      </label>
      <label>
        <span>Accessione</span>
        <select id="regen-filter-seed">
          <option value="">Tutte le accessioni</option>
          {% for seed in regen_seeds %}
            <option value="{{ seed.slug | escape }}">{{ seed.nome_comune | default: seed.title | escape }}</option>
          {% endfor %}
        </select>
      </label>
      <button type="button" id="regen-reset-filters" class="regen-secondary-button">AZZERA FILTRI</button>
    </div>

    <div id="regen-events" class="regen-events" aria-live="polite"></div>
    <div id="regen-empty" class="regen-empty" hidden>
      <span class="regen-empty-mark">∅</span>
      <strong>NESSUN EVENTO CORRISPONDENTE</strong>
      <p>Registra un evento o modifica i filtri.</p>
    </div>
  </section>
</div>

<script src="{{ '/assets/js/regeneration-diary.js' | relative_url }}" defer></script>
