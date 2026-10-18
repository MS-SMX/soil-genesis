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
    <span><strong>BOZZA LOCALE</strong> · Le nuove registrazioni vivono in questo browser finché non le esporti e aggiungi i file al repository. Il backup JSON serve invece a conservare o trasferire i dati locali.</span>
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
      <button type="button" id="regen-publish-export" class="regen-primary-button">PREPARA FILE PER IL PUSH</button>
      <button type="button" id="regen-export" class="regen-secondary-button">ESPORTA BACKUP JSON</button>
      <button type="button" id="regen-import-trigger" class="regen-secondary-button">IMPORTA BACKUP JSON</button>
      <input type="file" id="regen-import-file" accept=".json,application/json" hidden>
    </div>
    <p class="regen-backup-help">Per pubblicare: prepara il pacchetto ZIP, estrai i file Markdown nella cartella <code>_logs/</code> del repository, poi esegui commit e push. Gli eventi già esportati vengono rigenerati con lo stesso nome file; il push effettivo resta manuale. Il backup JSON è indipendente e serve al ripristino locale.</p>
    <p id="regen-backup-feedback" class="regen-feedback" aria-live="polite"></p>
  </section>

  <section class="regen-history-panel regen-published-panel" aria-labelledby="regen-published-title">
    <div class="regen-section-heading">
      <span class="regen-index">00B</span>
      <div>
        <h2 id="regen-published-title">REGISTRAZIONI PUBBLICATE</h2>
        <p>Eventi versionati nel repository e visibili a tutti</p>
      </div>
    </div>
    <div class="regen-events regen-published-events">
      {% assign published_field_logs = site.logs | where: "type", "field" | sort: "date" | reverse %}
      {% for entry in published_field_logs %}
        <article class="regen-event regen-published-event">
          <div class="regen-event-date"><time datetime="{{ entry.date | date: '%Y-%m-%d' }}">{{ entry.date | date: "%d %b %Y" }}</time></div>
          <div class="regen-event-body">
            <div class="regen-event-meta"><span class="regen-category-tag">{{ entry.category | escape }}</span><span class="regen-event-seed">{% if entry.seed_slug %}<a href="{{ '/sementi/' | append: entry.seed_slug | append: '/' | relative_url }}">{{ entry.seed_name | default: entry.seed_slug | escape }}</a>{% else %}Evento generale{% endif %}</span></div>
            <p><a href="{{ entry.url | relative_url }}">{{ entry.title | escape }} ↗</a></p>
          </div>
        </article>
      {% else %}
        <p class="regen-backup-help">Nessuna registrazione pubblicata dal Diario per ora.</p>
      {% endfor %}
    </div>
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
