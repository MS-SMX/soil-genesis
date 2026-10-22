---
layout: default
title: Piano parcelle e rotazioni
permalink: /piano-parcelle/
---

<div class="regen-page regen-plan-page" id="regen-diary">
  {% assign regen_seeds = site.seeds | sort_natural: "nome_comune" %}
  {% assign regen_perennials = site.perennials | sort_natural: "nome_comune" %}
  <header class="regen-header">
    <div class="regen-kicker">SOIL GENESIS // FIELD OPERATIONS</div>
    <h1>PIANO PARCELLE / ROTAZIONI</h1>
    <p>Organizza le colture presenti per stagione, unisci le consociazioni e prepara la base per le rotazioni future.</p>
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
        <p>Eventi versionati nel repository e visibili a tutti; la parcella viene mostrata quando registrata</p>
      </div>
    </div>
    <div class="regen-events regen-published-events">
      {% assign published_field_logs = site.logs | where: "type", "field" | sort: "date" | reverse %}
      {% for entry in published_field_logs %}
        <article class="regen-event regen-published-event" data-parcel="{{ entry.parcel_id | escape }}" data-category="{{ entry.category | escape }}" data-search="{{ entry.title | append: entry.seed_name | append: entry.parcel_label | append: entry.content | strip_html | escape }}" data-seed="{% if entry.perennial_slug %}perennial:{{ entry.perennial_slug | escape }}{% elsif entry.seed_slug %}seed:{{ entry.seed_slug | escape }}{% endif %}">
          <div class="regen-event-date"><time datetime="{{ entry.date | date: '%Y-%m-%d' }}">{{ entry.date | date: "%d %b %Y" }}</time></div>
          <div class="regen-event-body">
            <div class="regen-event-meta"><span class="regen-category-tag">{{ entry.category | escape }}</span>{% if entry.parcel_label %}<span class="regen-event-parcel">{{ entry.parcel_label | escape }}</span>{% endif %}<span class="regen-event-seed">{% if entry.seed_slug %}<a href="{{ '/sementi/' | append: entry.seed_slug | append: '/' | relative_url }}">{{ entry.seed_name | default: entry.seed_slug | escape }}</a>{% else %}Evento generale{% endif %}</span></div>
            <p><a href="{{ entry.url | relative_url }}">{{ entry.title | escape }} ↗</a></p>
          </div>
        </article>
      {% else %}
        <p class="regen-backup-help">Nessuna registrazione pubblicata dal Diario per ora.</p>
      {% endfor %}
    </div>
  </section>

  <section class="regen-plan-panel regen-history-panel" aria-labelledby="regen-plan-title">
    <div class="regen-section-heading">
      <span class="regen-index">00C</span>
      <div>
        <h2 id="regen-plan-title">PIANO PARCELLE / BASE ROTAZIONI</h2>
        <p>Registra le colture presenti quest'anno anche senza una data d'impianto. Queste voci sono una base agronomica, non eventi datati.</p>
      </div>
    </div>
    <form id="regen-plan-form" class="regen-form">
      <label>
        <span>Stagione *</span>
        <input type="number" id="regen-plan-season" min="2000" max="2100" required>
      </label>
      <label>
        <span>Parcella / punto *</span>
        <select id="regen-plan-parcel" required><option value="">Seleziona una parcella</option></select>
      </label>
      <fieldset class="regen-field-wide regen-plant-picker">
        <legend>Piante della consociazione *</legend>
        <p class="regen-backup-help">Seleziona una o più piante dall'archivio sementi e dalle perenni. Le selezioni verranno unite sotto un'unica voce della parcella.</p>
        <input type="search" id="regen-plan-plant-search" placeholder="Filtra per nome…" aria-label="Cerca piante nell'archivio">
        <div id="regen-plan-plant-options" class="regen-plant-options">
          <div class="regen-plant-group"><strong>ARCHIVIO SEMENTI</strong>
            {% for plant in regen_seeds %}<label><input type="checkbox" class="regen-plan-plant" value="seed:{{ plant.slug | escape }}" data-plant-type="seed" data-plant-slug="{{ plant.slug | escape }}" data-plant-label="{{ plant.nome_comune | default: plant.title | escape }}" data-plant-family="{{ plant.famiglia | default: plant.famiglia_botanica | default: '' | escape }}"> <span>{{ plant.nome_comune | default: plant.title | escape }}{% if plant.nome_scientifico %} <small>{{ plant.nome_scientifico | escape }}</small>{% endif %}</span></label>{% endfor %}
          </div>
          <div class="regen-plant-group"><strong>PIANTE PERENNI</strong>
            {% for plant in regen_perennials %}<label><input type="checkbox" class="regen-plan-plant" value="perennial:{{ plant.slug | escape }}" data-plant-type="perennial" data-plant-slug="{{ plant.slug | escape }}" data-plant-label="{{ plant.nome_comune | default: plant.title | escape }}" data-plant-family="{{ plant.famiglia | default: plant.famiglia_botanica | default: '' | escape }}"> <span>{{ plant.nome_comune | default: plant.title | escape }}{% if plant.nome_scientifico %} <small>{{ plant.nome_scientifico | escape }}</small>{% endif %}</span></label>{% endfor %}
          </div>
        </div>
      </fieldset>
      <label class="regen-field-wide">
        <span>Note utili per la rotazione</span>
        <textarea id="regen-plan-notes" rows="2" placeholder="Famiglia botanica, consociazione, fertilità, osservazioni…"></textarea>
      </label>
      <div class="regen-form-actions regen-field-wide">
        <button type="submit" class="regen-primary-button">+ SALVA COLTURA DI BASE</button>
        <span id="regen-plan-feedback" class="regen-feedback" aria-live="polite"></span>
      </div>
    </form>
    <div class="regen-plan-tools">
      <label><span>Mostra stagione</span><input type="number" id="regen-plan-view-season" min="2000" max="2100"></label>
      <label><span>Cerca coltura o parcella</span><input type="search" id="regen-plan-search" placeholder="Coltura, settore, note…"></label>
    </div>
    <div id="regen-plan-list" class="regen-plan-list"></div>
    <p class="regen-backup-help">Ogni voce identifica la coltura di una parcella per una stagione, senza inventare una data. Per la pubblicazione, il pacchetto include il piano in <code>_data/plot-plantings.yml</code>, oltre agli eventi datati in <code>_logs/</code>.</p>
    <section class="regen-rotation-panel" aria-labelledby="regen-rotation-title">
      <div class="regen-section-heading">
        <span class="regen-index">03</span>
        <div><h2 id="regen-rotation-title">LETTURA DELLE ROTAZIONI</h2><p>Confronto tra stagioni registrate per la stessa parcella, usando le famiglie botaniche disponibili</p></div>
      </div>
      <p class="regen-backup-help">Le segnalazioni sono promemoria, non prescrizioni: non considerano automaticamente fertilità, patogeni, durata delle colture perenni o condizioni locali. Le famiglie mancanti restano “da verificare”, senza essere indovinate.</p>
      <div id="regen-rotation-list" class="regen-rotation-list"><p class="regen-backup-help">Lettura delle rotazioni in preparazione…</p></div>
    </section>
    <div class="regen-section-heading regen-published-plan-heading">
      <span class="regen-index">PUB</span>
      <div><h2>PIANO PUBBLICATO</h2><p>Colture di base già versionate nel repository</p></div>
    </div>
    <div class="regen-plan-list regen-published-plan-list">
      {% assign plot_plantings_data = site.data['plot-plantings'] %}
      {% assign published_plantings = plot_plantings_data.plantings %}
      <script type="application/json" id="regen-published-plantings">{{ published_plantings | jsonify }}</script>
      {% for planting in published_plantings %}
        <article class="regen-plan-item" data-parcel="{{ planting.parcel_id | escape }}" data-season="{{ planting.season }}">
          <div><span class="regen-plan-season">STAGIONE {{ planting.season }}</span><h3>{{ planting.parcel_label | escape }}</h3><p class="regen-plan-crop">{{ planting.crop | escape }}</p>{% if planting.notes %}<p>{{ planting.notes | escape }}</p>{% endif %}<p class="regen-plan-no-date">Coltura di base · data non registrata</p></div>
        </article>
      {% else %}
        <p class="regen-backup-help">Nessun piano parcelle pubblicato.</p>
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
          <option value="Raccolta">Raccolta</option>
          <option value="Conservazione">Conservazione</option>
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
            <option value="seed:{{ seed.slug | escape }}">{{ seed.nome_comune | default: seed.title | escape }}{% if seed.nome_scientifico %} · {{ seed.nome_scientifico | escape }}{% endif %}</option>
          {% endfor %}
          {% assign regen_perennials = site.perennials | sort_natural: "nome_comune" %}
          {% for plant in regen_perennials %}
            <option value="perennial:{{ plant.slug | escape }}">PERENNE · {{ plant.nome_comune | default: plant.title | escape }}{% if plant.nome_scientifico %} · {{ plant.nome_scientifico | escape }}{% endif %}</option>
          {% endfor %}
        </select>
      </label>
      <label class="regen-field-wide">
        <span>Parcella / punto preciso</span>
        <select id="regen-parcel" name="parcel">
          <option value="">Nessuna parcella specifica</option>
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
          <option>Semina</option><option>Germinazione</option><option>Trapianto</option><option>Raccolta</option><option>Conservazione</option><option>Osservazione</option><option>Altro</option>
        </select>
      </label>
      <label>
        <span>Accessione</span>
        <select id="regen-filter-seed">
          <option value="">Tutte le accessioni</option>
          {% for seed in regen_seeds %}
            <option value="seed:{{ seed.slug | escape }}">{{ seed.nome_comune | default: seed.title | escape }}</option>
          {% endfor %}
          {% for plant in site.perennials %}
            <option value="perennial:{{ plant.slug | escape }}">PERENNE · {{ plant.nome_comune | default: plant.title | escape }}</option>
          {% endfor %}
        </select>
      </label>
      <label>
        <span>Parcella</span>
        <select id="regen-filter-parcel"><option value="">Tutte le parcelle</option></select>
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
