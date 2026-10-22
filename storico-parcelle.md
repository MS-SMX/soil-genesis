---
layout: default
title: Storico agronomico delle parcelle
permalink: /storico-parcelle/
---

<div class="regen-page parcel-history-page" id="parcel-history">
  <header class="regen-header">
    <div class="regen-kicker">SOIL GENESIS // AGRONOMIC MEMORY</div>
    <h1>STORICO PARCELLE</h1>
    <p>Una cronologia unificata di colture, operazioni e condizioni osservate. Le stagioni colturali non hanno una data precisa se questa non è stata registrata; le transizioni sono confronti descrittivi, non valutazioni automatiche della rotazione.</p>
  </header>
  <div class="regen-storage-note" role="note"><span class="regen-led" aria-hidden="true"></span><span><strong>MEMORIA DEL TERRENO</strong> · I dati pubblicati arrivano dal repository; le bozze locali sono visibili solo in questo browser. Per renderle condivise, esporta e fai push.</span></div>
  <section class="regen-history-panel">
    <div class="regen-filters parcel-history-filters">
      <label><span>Parcella</span><select id="parcel-history-filter"><option value="">Tutte le parcelle</option></select></label>
      <label><span>Anno / stagione dal</span><input type="number" id="parcel-history-from" min="2000" max="2100" placeholder="es. 2024"></label>
      <label><span>Anno / stagione al</span><input type="number" id="parcel-history-to" min="2000" max="2100" placeholder="es. 2026"></label>
      <label><span>Cerca coltura, osservazione o nota</span><input type="search" id="parcel-history-search" placeholder="Coltura, condizione, operazione, nota…"></label>
      <button type="button" class="regen-secondary-button" id="parcel-history-reset">AZZERA FILTRI</button>
    </div>
    <p id="parcel-history-summary" class="regen-backup-help" aria-live="polite"></p>
    <section class="parcel-rotation-context" aria-labelledby="parcel-rotation-context-title">
      <div class="regen-subsection-heading"><h2 id="parcel-rotation-context-title">CONTESTO DELLA ROTAZIONE</h2><p>Famiglie botaniche registrate e osservazioni pertinenti nella stessa parcella</p></div>
      <p class="regen-backup-help">Questa lettura incrocia i piani stagionali con le osservazioni disponibili. Una famiglia ripetuta è un segnale da valutare, non una diagnosi; un campo non registrato non equivale ad assenza.</p>
      <div id="parcel-rotation-context-results" class="parcel-rotation-context-results" aria-live="polite"></div>
    </section>
    <div id="parcel-history-timeline" class="parcel-history-timeline"></div>
    <div id="parcel-history-empty" class="regen-empty" hidden><span class="regen-empty-mark">∅</span><strong>NESSUNA REGISTRAZIONE</strong><p>Questa parcella non ha ancora uno storico corrispondente ai filtri.</p></div>
  </section>
  <script type="application/json" id="parcel-history-published-plantings">{% assign history_plantings = site.data['plot-plantings'].plantings %}{% if history_plantings %}{{ history_plantings | jsonify }}{% else %}[]{% endif %}</script>
  <script type="application/json" id="parcel-history-published-conditions">{% assign condition_history_data = site.data['parcel-condition-history'] %}{% assign history_observations = condition_history_data.observations %}{% if history_observations %}{{ history_observations | jsonify }}{% else %}[]{% endif %}</script>
  <script type="application/json" id="parcel-history-published-events">
  [
  {% assign history_logs = site.logs | where: "type", "field" | sort: "date" %}
  {% for entry in history_logs %}
    {"id":{{ entry.event_id | default: entry.slug | jsonify }},"date":{{ entry.date | date: "%Y-%m-%d" | jsonify }},"category":{{ entry.category | default: "Evento" | jsonify }},"title":{{ entry.title | jsonify }},"parcelId":{{ entry.parcel_id | default: "" | jsonify }},"parcelLabel":{{ entry.parcel_label | default: "" | jsonify }},"seedName":{{ entry.seed_name | default: "Evento generale" | jsonify }},"notes":{{ entry.content | strip_html | jsonify }},"url":{{ entry.url | relative_url | jsonify }}}
    {% unless forloop.last %},{% endunless %}
  {% endfor %}
  ]
  </script>
</div>
<script src="{{ '/assets/js/parcel-history.js' | relative_url }}" defer></script>
