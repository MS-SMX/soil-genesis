---
layout: default
title: Mappa miceliale
permalink: /mappa-miceliale/
---

<div class="mycelium-map-page" id="sg-mycelium-map">
  <header class="mycelium-map-header">
    <div class="mycelium-kicker">SOIL GENESIS // RELATION NETWORK</div>
    <h1>MAPPA MICELIALE</h1>
    <p>Una vista relazionale dell’archivio: ogni nodo è un’accessione, ogni nucleo una famiglia botanica. I collegamenti indicano una classificazione condivisa, non una parentela genetica dimostrata.</p>
  </header>

  <section class="mycelium-map-controls" aria-label="Filtri della mappa">
    <label><span>RICERCA</span><input id="mycelium-search" type="search" placeholder="Nome comune o scientifico…" autocomplete="off"></label>
    <label><span>FAMIGLIA BOTANICA</span><select id="mycelium-family"><option value="">Tutte le famiglie</option></select></label>
    <button type="button" id="mycelium-reset">RESET VISTA</button>
  </section>

  <div class="mycelium-map-layout">
    <section class="mycelium-graph-panel" aria-label="Grafo delle famiglie e delle accessioni">
      <div class="mycelium-graph-topline"><span><i class="mycelium-live-dot"></i> RETE ARCHIVIO</span><span id="mycelium-visible-count">CARICAMENTO…</span></div>
      <svg id="mycelium-svg" viewBox="0 0 1400 1080" role="img" aria-label="Mappa delle relazioni tra famiglie botaniche e accessioni"></svg>
      <div class="mycelium-legend"><span><i class="legend-hub"></i> Famiglia botanica</span><span><i class="legend-node"></i> Accessione</span><span><i class="legend-selected"></i> Selezionata</span></div>
    </section>

    <aside class="mycelium-inspector" aria-live="polite" id="mycelium-inspector">
      <div class="mycelium-inspector-kicker">NODE INSPECTOR // 00</div>
      <h2 id="mycelium-inspector-title">SELEZIONA UN NODO</h2>
      <p id="mycelium-inspector-copy">Seleziona un nucleo familiare per filtrare la rete oppure un nodo per aprire i dati dell’accessione.</p>
      <div id="mycelium-inspector-data" class="mycelium-inspector-data"></div>
      <a id="mycelium-open-dossier" class="mycelium-open-dossier" href="#" hidden>APRI DOSSIER ↗</a>
    </aside>
  </div>
  <p class="mycelium-map-footnote">La mappa usa i metadati già presenti nei dossier. Un collegamento per famiglia non implica compatibilità d’incrocio, discendenza comune a livello varietale o scambio documentato tra custodi.</p>
</div>

<script>
window.SG_MYceliumSeeds = [
{% assign relation_seeds = site.seeds | sort_natural: "nome_comune" %}
{% for seed in relation_seeds %}
  {"name": {{ seed.nome_comune | default: seed.title | jsonify }}, "scientific": {{ seed.nome_scientifico | default: "" | jsonify }}, "slug": {{ seed.slug | default: seed.name | jsonify }}, "url": {{ seed.url | relative_url | jsonify }}, "family": {{ seed.famiglia | default: "non classificata" | downcase | jsonify }}, "life": {{ seed.ciclo_vita | default: "non registrato" | jsonify }}, "status": {{ seed.stato_conservazione | default: "non registrato" | jsonify }}}
  {% unless forloop.last %},{% endunless %}
{% endfor %}
];
</script>
<script src="{{ '/assets/js/mycelium-map.js' | relative_url }}" defer></script>
