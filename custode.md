---
layout: default
title: Modalità Custode
permalink: /custode/
---

<div class="custodian-page" id="custodian-dashboard">
  <header class="custodian-header">
    <div class="custodian-kicker">SOIL GENESIS // OPERATIONS CONSOLE</div>
    <h1>MODALITÀ CUSTODE</h1>
    <p>Una vista operativa per individuare schede da completare, accessioni da rigenerare e attività stagionali. Il pannello segnala priorità: non modifica automaticamente i dossier.</p>
  </header>

  <div class="custodian-notice" role="note">
    <span class="custodian-led" aria-hidden="true"></span>
    <span><strong>VISTA OPERATIVA PUBBLICA</strong> · Soil Genesis è un sito statico: questa pagina non è un'area privata né un sistema di autenticazione. Le informazioni mostrate derivano dai dossier pubblicati.</span>
  </div>

  <section class="custodian-summary" aria-label="Riepilogo operativo">
    <article class="custodian-metric"><span>ACCESSIONI</span><strong id="custodian-total">—</strong><small>nell'archivio</small></article>
    <article class="custodian-metric custodian-metric-alert"><span>DA COMPLETARE</span><strong id="custodian-incomplete">—</strong><small>campi o fonti mancanti</small></article>
    <article class="custodian-metric custodian-metric-alert"><span>DA RIVEDERE</span><strong id="custodian-review">—</strong><small>riproduzione non recente</small></article>
    <article class="custodian-metric"><span>OPERAZIONI ORA</span><strong id="custodian-seasonal">—</strong><small>semina o raccolta previste</small></article>
  </section>

  <section class="custodian-panel" aria-labelledby="custodian-season-title">
    <div class="custodian-section-title"><span>01</span><div><h2 id="custodian-season-title">FINESTRA STAGIONALE</h2><p id="custodian-season-label">Operazioni previste nel mese corrente</p></div></div>
    <div id="custodian-season-list" class="custodian-season-list"></div>
  </section>

  <section class="custodian-panel" aria-labelledby="custodian-work-title">
    <div class="custodian-section-title"><span>02</span><div><h2 id="custodian-work-title">CODA OPERATIVA</h2><p>Priorità suggerite in base ai dati presenti nei dossier</p></div></div>
    <div class="custodian-controls">
      <label><span>Cerca accessione</span><input type="search" id="custodian-search" placeholder="Nome, famiglia, criticità…"></label>
      <label><span>Priorità</span><select id="custodian-filter"><option value="all">Tutte</option><option value="urgent">Urgenti</option><option value="incomplete">Schede incomplete</option><option value="reproduction">Da rigenerare / verificare</option><option value="images">Immagini mancanti</option><option value="sources">Fonti mancanti</option></select></label>
      <button type="button" id="custodian-reset" class="custodian-button">AZZERA FILTRI</button>
    </div>
    <p id="custodian-result-count" class="custodian-result-count" aria-live="polite"></p>
    <div id="custodian-work-list" class="custodian-work-list"></div>
    <div id="custodian-no-results" class="custodian-empty" hidden>Nessuna accessione corrisponde ai filtri.</div>
  </section>

  <script type="application/json" id="custodian-seed-data">
  [
  {% assign custodian_seeds = site.seeds | sort_natural: "nome_comune" %}
  {% for seed in custodian_seeds %}
    {% assign image_count = seed.immagini.size | default: 0 %}
    {% assign bibliography_count = seed.bibliografia.size | default: 0 %}
    {% assign sow_direct = seed.periodo_semina_diretta | join: "," %}
    {% assign sow_seedling = seed.periodo_semina_semenzaio | join: "," %}
    {% assign harvest_months = seed.periodo_raccolta_seme | join: "," %}
    {
      "slug": {{ seed.slug | default: seed.name | jsonify }},
      "name": {{ seed.nome_comune | default: seed.title | jsonify }},
      "scientific": {{ seed.nome_scientifico | default: "" | jsonify }},
      "family": {{ seed.famiglia | default: "" | jsonify }},
      "url": {{ seed.url | relative_url | jsonify }},
      "status": {{ seed.stato_conservazione | default: "" | jsonify }},
      "lastYear": {{ seed.ultimo_anno_riproduzione | default: "" | jsonify }},
      "imageCount": {{ image_count | jsonify }},
      "hasSources": {% if seed.fonti != nil and seed.fonti != empty or bibliography_count > 0 %}true{% else %}false{% endif %},
      "hasSowingNotes": {% if seed.istruzioni_semina != nil and seed.istruzioni_semina != empty %}true{% else %}false{% endif %},
      "hasCultivationNotes": {% if seed.istruzioni_coltivazione != nil and seed.istruzioni_coltivazione != empty %}true{% else %}false{% endif %},
      "hasIdentity": {% if seed.nome_comune != nil and seed.nome_comune != empty and seed.nome_scientifico != nil and seed.nome_scientifico != empty and seed.famiglia != nil and seed.famiglia != empty %}true{% else %}false{% endif %},
      "sowDirect": {{ sow_direct | jsonify }},
      "sowSeedling": {{ sow_seedling | jsonify }},
      "harvestMonths": {{ harvest_months | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
  ]
  </script>
</div>

<script src="{{ '/assets/js/custodian.js' | relative_url }}" defer></script>
