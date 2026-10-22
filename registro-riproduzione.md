---
layout: application
title: Registro riproduzione e conservazione
permalink: /registro-riproduzione/
---

<link rel="stylesheet" href="{{ '/assets/css/pages/seed-reproduction-registry.css' | relative_url }}">
<div class="reproduction-registry" id="reproduction-registry">
  <header class="reproduction-header">
    <p class="reproduction-kicker">SOIL GENESIS // SEED CONSERVATION</p>
    <h1>REGISTRO RIPRODUZIONE</h1>
    <p>Una distanza di isolamento non è una proprietà universale della cultivar: dipende da specie, impollinazione, ambiente e obiettivo di conservazione. Questa vista separa i dati presenti dalle evidenze documentate e rende visibili i campi da verificare.</p>
  </header>
  <section class="reproduction-summary" aria-label="Principi">
    <article><strong>01</strong><h2>Impollinazione</h2><p>Autogamia, insetti e vento comportano rischi diversi. La stessa specie può comunque mostrare variabilità.</p></article>
    <article><strong>02</strong><h2>Isolamento</h2><p>Distanze indicative non sono garanzie assolute. Barriere, fioritura simultanea e cultivar compatibili cambiano il rischio.</p></article>
    <article><strong>03</strong><h2>Maturità del seme</h2><p>Il momento di raccolta per mangiare la pianta può precedere quello necessario per ottenere seme maturo.</p></article>
  </section>
  {% assign records = site.seeds | concat: site.perennials | concat: site.spontaneous | sort_natural: "nome_comune" %}
  {% assign total = records.size %}
  {% assign documented = 0 %}
  {% for plant in records %}{% if plant.fonti_riproduzione %}{% assign documented = documented | plus: 1 %}{% endif %}{% endfor %}
  <section class="reproduction-controls" aria-label="Filtri dossier">
    <label for="reproduction-search">Cerca dossier, specie o ID</label>
    <input type="search" id="reproduction-search" placeholder="Es. pomodoro, Cucurbita pepo, SG-000001" autocomplete="off">
    <div class="reproduction-filters">
      <label><input type="checkbox" id="reproduction-missing" checked> Mostra dossier senza evidenze di riproduzione</label>
      <label><input type="checkbox" id="reproduction-documented"> Solo dossier con almeno una fonte di riproduzione</label>
    </div>
    <p class="reproduction-count" id="reproduction-count" aria-live="polite">{{ total }} dossier · {{ documented }} con almeno una fonte di riproduzione</p>
  </section>
  <section class="reproduction-list" id="reproduction-list" aria-label="Dossier e dati riproduttivi">
    {% for plant in records %}
      {% assign evidence = plant.fonti_riproduzione %}
      {% assign pollination = evidence.impollinazione %}
      {% assign isolation = evidence.isolamento %}
      {% assign harvest = evidence.maturita_seme %}
      {% assign population = evidence.popolazione %}
      {% assign record_name = plant.nome_comune | default: plant.title | default: plant.slug %}
      {% assign scientific_name = plant.nome_scientifico | default: plant.scientific_name | default: "" %}
      {% assign record_id = plant.sg_id | default: plant.id | default: plant.slug %}
      {% assign evidence_count = 0 %}
      {% if pollination.url and pollination.valore %}{% assign evidence_count = evidence_count | plus: 1 %}{% endif %}
      {% if isolation.url and isolation.valore %}{% assign evidence_count = evidence_count | plus: 1 %}{% endif %}
      {% if harvest.url and harvest.valore %}{% assign evidence_count = evidence_count | plus: 1 %}{% endif %}
      {% if population.url and population.valore %}{% assign evidence_count = evidence_count | plus: 1 %}{% endif %}
      <article class="reproduction-card" data-documented="{% if evidence_count > 0 %}true{% else %}false{% endif %}" data-search="{{ record_name | append: ' ' | append: scientific_name | append: ' ' | append: record_id | downcase | escape }}">
        <header><div><h2><a href="{{ plant.url | relative_url }}">{{ record_name | escape }}</a></h2>{% if scientific_name != "" %}<p><em>{{ scientific_name | escape }}</em></p>{% endif %}</div><span class="reproduction-id">{{ record_id | escape }}</span></header>
        <p class="reproduction-existing"><strong>Dati già presenti:</strong> impollinazione {{ plant.impollinazione | default: "non registrata" | escape }} · isolamento {{ plant.distanza_isolamento | default: "non registrato" | escape }} · raccolta seme {% if plant.periodo_raccolta_seme %}{{ plant.periodo_raccolta_seme | join: ", " }}{% else %}non registrata{% endif %} · quantità {{ plant.quantita_consigliata | default: "non registrata" | escape }}</p>
        <div class="reproduction-evidence-grid">
          {% for item in "impollinazione,isolamento,maturita_seme,popolazione" | split: "," %}
            {% assign item_evidence = evidence[item] %}
            <div class="reproduction-evidence {% if item_evidence.url and item_evidence.valore %}has-evidence{% else %}no-evidence{% endif %}">
              {% case item %}{% when "impollinazione" %}<h3>Impollinazione e sistema riproduttivo</h3>{% when "isolamento" %}<h3>Isolamento e rischio d'incrocio</h3>{% when "maturita_seme" %}<h3>Maturità e raccolta del seme</h3>{% when "popolazione" %}<h3>Dimensione della popolazione</h3>{% endcase %}
              {% if item_evidence.valore %}<p>{{ item_evidence.valore | escape }}</p>{% else %}<p>Fonte specifica non registrata</p>{% endif %}
              {% if item_evidence.note %}<p class="reproduction-note">{{ item_evidence.note | escape }}</p>{% endif %}
              {% if item_evidence.url %}<p><a href="{{ item_evidence.url | escape }}" target="_blank" rel="noopener noreferrer">{{ item_evidence.fonte | default: "Apri fonte" | escape }} ↗</a>{% if item_evidence.data_verifica %}<small>Verificata {{ item_evidence.data_verifica | escape }}</small>{% endif %}</p>{% endif %}
            </div>
          {% endfor %}
        </div>
        <footer><span>{{ evidence_count }}/4 aree con fonte</span><a href="{{ plant.url | relative_url }}">Apri dossier ↗</a></footer>
      </article>
    {% endfor %}
    <p class="reproduction-empty" id="reproduction-empty" hidden>Nessun dossier corrisponde ai filtri attivi.</p>
  </section>
  <details class="reproduction-method"><summary>Metodo, fonti generali e limiti</summary>
    <ul>
      <li><a href="https://seedalliance.org/publications/seed-saving-guide/" target="_blank" rel="noopener noreferrer">Organic Seed Alliance — A Seed Saving Guide for Gardeners and Farmers</a>: principi di impollinazione, isolamento, dimensione della popolazione e maturità del seme.</li>
      <li><a href="https://seedsavers.org/learn/isolation-methods/" target="_blank" rel="noopener noreferrer">Seed Savers Exchange — Isolation Methods</a>: isolamento per distanza, tempo e barriere; esempi di impollinazione manuale.</li>
      <li><a href="https://shop.seedsavers.org/site/pdf/crop_chart.pdf" target="_blank" rel="noopener noreferrer">Seed Savers Exchange — Crop-Specific Seed Saving Guide</a>: tabella per specie su impollinazione, distanze, popolazione e maturità del seme.</li>
      <li>Le distanze sono raccomandazioni di gestione, non confini biologici certi. Il vento, i pollinatori, la morfologia del luogo, le varietà vicine e l'obiettivo di purezza influenzano il risultato.</li>
      <li>Una fonte generale spiega il metodo ma non costituisce prova specifica per ogni cultivar. I campi senza fonte specifica restano dichiaratamente da verificare.</li>
      <li>Non usare un seme ottenuto da un incrocio incerto come materiale di conservazione stabile senza registrare il rischio e una verifica nelle generazioni successive.</li>
    </ul>
    <p>Schema opzionale per un dossier, da compilare solo dopo aver controllato la fonte:</p>
    <pre><code>fonti_riproduzione:
  impollinazione:
    valore: "sistema riproduttivo e vettore documentati"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"
    note: "limiti o condizioni"
  isolamento:
    valore: "distanza e/o metodo, con unità"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"
    note: "rischio residuo"
  maturita_seme:
    valore: "criterio osservabile di maturità"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"
  popolazione:
    valore: "numero di piante e obiettivo genetico"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"</code></pre>
  </details>
</div>
<script src="{{ '/assets/js/seed-reproduction-registry.js' | relative_url }}" defer></script>
