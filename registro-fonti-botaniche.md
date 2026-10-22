---
layout: application
title: Registro fonti botaniche
permalink: /registro-fonti-botaniche/
---

<div class="botanical-quality-page botanical-source-page" id="botanical-source-registry">
  <header class="botanical-quality-header">
    <p class="botanical-quality-kicker">SOIL GENESIS // EVIDENCE REGISTER</p>
    <h1>REGISTRO FONTI BOTANICHE</h1>
    <p>Controlla se famiglia botanica e ciclo di vita hanno una fonte tracciabile. Un campo compilato non è automaticamente verificato: qui contano il valore supportato, la fonte consultabile e la data della verifica.</p>
  </header>

  <section class="botanical-quality-summary" aria-label="Regole del registro">
    <article><strong>01</strong><h2>Una fonte per ogni affermazione</h2><p>Registra separatamente la fonte della famiglia botanica e quella del ciclo di vita quando non sono sostenute dalla stessa fonte.</p></article>
    <article><strong>02</strong><h2>Valore verificato</h2><p>Il valore riportato dalla fonte deve corrispondere al valore presente nel dossier. Se non coincide, la scheda richiede una revisione.</p></article>
    <article><strong>03</strong><h2>Traccia la verifica</h2><p>Inserisci titolo o ente, URL e data di consultazione. Non attribuire una fonte a un dato che non hai controllato.</p></article>
  </section>

  <section class="botanical-quality-controls" aria-label="Filtri del registro">
    <label for="botanical-source-search">Cerca nome, nome scientifico o identificativo</label>
    <input type="search" id="botanical-source-search" placeholder="Es. cece, Cicer arietinum, SG-000001" autocomplete="off">
    <div class="botanical-quality-filter-row">
      <label><input type="checkbox" id="botanical-source-family" checked> Famiglia senza fonte completa</label>
      <label><input type="checkbox" id="botanical-source-life" checked> Ciclo di vita senza fonte completa</label>
      <label><input type="checkbox" id="botanical-source-mismatch" checked> Valore da riconciliare</label>
      <label><input type="checkbox" id="botanical-source-all"> Includi dossier senza problemi rilevati</label>
    </div>
    <p id="botanical-source-count" aria-live="polite" class="botanical-quality-count"></p>
  </section>

  {% assign collections_to_audit = site.seeds | concat: site.perennials | concat: site.spontaneous | sort_natural: "nome_comune" %}
  <section class="botanical-quality-list" id="botanical-source-list" aria-label="Registro delle fonti per dossier">
    {% for plant in collections_to_audit %}
      {% assign family = plant.famiglia | default: plant.famiglia_botanica | strip %}
      {% assign life = plant.ciclo_vita | default: plant.life | strip %}
      {% assign family_source = plant.fonti_botaniche.famiglia %}
      {% assign life_source = plant.fonti_botaniche.ciclo_vita %}
      {% assign family_source_name = family_source.fonte | default: family_source.titolo | default: "" | strip %}
      {% assign life_source_name = life_source.fonte | default: life_source.titolo | default: "" | strip %}
      {% assign family_source_url = family_source.url | default: "" | strip %}
      {% assign life_source_url = life_source.url | default: "" | strip %}
      {% assign family_source_date = family_source.data_verifica | default: "" | strip %}
      {% assign life_source_date = life_source.data_verifica | default: "" | strip %}
      {% assign family_source_value = family_source.valore | default: "" | strip %}
      {% assign life_source_value = life_source.valore | default: "" | strip %}
      {% assign family_complete = false %}{% assign family_incomplete = true %}{% if family_source_name != "" and family_source_url contains "http" and family_source_date != "" and family_source_value != "" %}{% assign family_complete = true %}{% assign family_incomplete = false %}{% endif %}
      {% assign life_complete = false %}{% assign life_incomplete = true %}{% if life_source_name != "" and life_source_url contains "http" and life_source_date != "" and life_source_value != "" %}{% assign life_complete = true %}{% assign life_incomplete = false %}{% endif %}
      {% assign family_mismatch = false %}{% if family_source_value != "" and family != "" %}{% assign family_value_normalized = family | downcase | strip %}{% assign family_source_normalized = family_source_value | downcase | strip %}{% if family_value_normalized == "umbrelliferae" or family_value_normalized == "umbelliferae" %}{% assign family_value_normalized = "apiaceae" %}{% endif %}{% if family_source_normalized == "umbrelliferae" or family_source_normalized == "umbelliferae" %}{% assign family_source_normalized = "apiaceae" %}{% endif %}{% if family_value_normalized == "alliaceae" %}{% assign family_value_normalized = "amaryllidaceae" %}{% endif %}{% if family_source_normalized == "alliaceae" %}{% assign family_source_normalized = "amaryllidaceae" %}{% endif %}{% if family_value_normalized != family_source_normalized %}{% assign family_mismatch = true %}{% endif %}{% endif %}
      {% assign life_mismatch = false %}{% if life_source_value != "" and life != "" %}{% assign life_value_normalized = life | downcase | strip %}{% assign life_source_normalized = life_source_value | downcase | strip %}{% if life_value_normalized != life_source_normalized %}{% unless life_source_normalized contains life_value_normalized %}{% assign life_mismatch = true %}{% endunless %}{% endif %}{% endif %}
      {% assign issue = false %}{% unless family_complete and life_complete %}{% assign issue = true %}{% endunless %}{% if family_mismatch or life_mismatch %}{% assign issue = true %}{% endif %}
      {% assign record_name = plant.nome_comune | default: plant.title | default: plant.name | default: plant.slug %}
      {% assign scientific_name = plant.nome_scientifico | default: plant.scientific_name | default: "" %}
      {% assign record_id = plant.sg_id | default: plant.id | default: plant.slug | default: plant.name %}
      {% assign record_url = plant.url | relative_url %}
      {% assign collection_path = plant.path | default: "" %}
      <article class="botanical-quality-card botanical-source-card" data-family-incomplete="{{ family_incomplete }}" data-life-incomplete="{{ life_incomplete }}" data-family-mismatch="{{ family_mismatch }}" data-life-mismatch="{{ life_mismatch }}" data-issue="{{ issue }}" data-search="{{ record_name | append: ' ' | append: scientific_name | append: ' ' | append: record_id | downcase | escape }}">
        <div class="botanical-quality-card-head">
          <div><h2><a href="{{ record_url }}">{{ record_name | escape }}</a></h2>{% if scientific_name != "" %}<p class="botanical-quality-scientific"><em>{{ scientific_name | escape }}</em></p>{% endif %}</div>
          <span class="botanical-quality-id">{{ record_id | escape }}</span>
        </div>
        <div class="botanical-quality-fields botanical-source-fields">
          <div class="botanical-source-claim">
            <p><strong>Famiglia nel dossier</strong><span>{{ family | default: "Non registrata" | escape }}</span></p>
            <p><strong>Fonte</strong><span class="{% if family_complete %}is-present{% else %}is-missing{% endif %}">{% if family_complete %}{{ family_source_name | escape }}{% else %}Fonte incompleta o assente{% endif %}</span></p>
            {% if family_source_value != "" %}<p><strong>Valore dichiarato dalla fonte</strong><span class="{% if family_mismatch %}is-missing{% else %}is-present{% endif %}">{{ family_source_value | escape }}{% if family_mismatch %} · da riconciliare{% endif %}</span></p>{% endif %}
            {% if family_source_url != "" %}<p><strong>Riferimento</strong><span><a href="{{ family_source_url | escape }}" target="_blank" rel="noopener noreferrer">Apri fonte ↗</a>{% if family_source_date != "" %} · verificata {{ family_source_date | escape }}{% endif %}</span></p>{% endif %}
          </div>
          <div class="botanical-source-claim">
            <p><strong>Ciclo di vita nel dossier</strong><span>{{ life | default: "Non registrato" | escape }}</span></p>
            <p><strong>Fonte</strong><span class="{% if life_complete %}is-present{% else %}is-missing{% endif %}">{% if life_complete %}{{ life_source_name | escape }}{% else %}Fonte incompleta o assente{% endif %}</span></p>
            {% if life_source_value != "" %}<p><strong>Valore dichiarato dalla fonte</strong><span class="{% if life_mismatch %}is-missing{% else %}is-present{% endif %}">{{ life_source_value | escape }}{% if life_mismatch %} · da riconciliare{% endif %}</span></p>{% endif %}
            {% if life_source_url != "" %}<p><strong>Riferimento</strong><span><a href="{{ life_source_url | escape }}" target="_blank" rel="noopener noreferrer">Apri fonte ↗</a>{% if life_source_date != "" %} · verificata {{ life_source_date | escape }}{% endif %}</span></p>{% endif %}
          </div>
        </div>
        <div class="botanical-quality-actions"><a href="{{ record_url }}">Apri dossier ↗</a>{% if collection_path != "" %}<a href="https://github.com/MS-SMX/soil-genesis/edit/main/{{ collection_path | remove_first: '/' }}" target="_blank" rel="noopener noreferrer">Modifica su GitHub ↗</a>{% endif %}</div>
      </article>
    {% endfor %}
    <p id="botanical-source-empty" class="botanical-quality-empty" hidden>Nessun dossier corrisponde ai filtri attivi.</p>
  </section>

  <details class="botanical-quality-method">
    <summary>Formato dei dati e metodo</summary>
    <p>Nel front matter di ogni dossier, registra le fonti per singolo campo. Esempio di struttura da compilare soltanto dopo aver verificato la fonte:</p>
    <pre><code>fonti_botaniche:
  famiglia:
    valore: "valore riportato dalla fonte"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"
  ciclo_vita:
    valore: "valore riportato dalla fonte"
    fonte: "ente o titolo"
    url: "https://..."
    data_verifica: "AAAA-MM-GG"</code></pre>
    <ul>
      <li>Il registro controlla la presenza dei metadati e confronta il valore con quello del dossier. Se la fonte dichiara esplicitamente alternative (per esempio «annuale o biennale»), un valore del dossier che coincide con una delle alternative non è segnalato come discordante. Non verifica automaticamente l'affidabilità della fonte.</li>
      <li>Sinonimi tassonomici o differenze di nomenclatura possono produrre una discrepanza testuale che richiede revisione umana.</li>
      <li>Non copiare una fonte da un campo all'altro senza verificare che sostenga entrambe le affermazioni.</li>
    </ul>
  </details>
</div>
<script src="{{ '/assets/js/botanical-source-registry.js' | relative_url }}" defer></script>
