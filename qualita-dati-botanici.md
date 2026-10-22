---
layout: application
title: Qualità dei dati botanici
permalink: /qualita-dati-botanici/
---

<div class="botanical-quality-page" id="botanical-quality">
  <header class="botanical-quality-header">
    <p class="botanical-quality-kicker">SOIL GENESIS // DATA INTEGRITY</p>
    <h1>QUALITÀ DEI DATI BOTANICI</h1>
    <p>Individua i dossier che non riportano una famiglia botanica o un ciclo di vita utilizzabile. Questa pagina segnala campi incompleti: non corregge né completa automaticamente informazioni biologiche.</p>
  </header>
  <p class="botanical-quality-count"><a href="{{ '/registro-fonti-botaniche/' | relative_url }}">Apri anche il registro delle fonti botaniche ↗</a>: controlla fonte, valore dichiarato e data di verifica.</p>

  <section class="botanical-quality-summary" aria-label="Come usare il controllo">
    <article><strong>1</strong><h2>Apri il dossier</h2><p>Controlla il nome scientifico e la fonte disponibile prima di modificare i dati.</p></article>
    <article><strong>2</strong><h2>Verifica la fonte</h2><p>Preferisci floristiche, banche dati botaniche o fonti istituzionali. Il nome comune da solo può essere ambiguo.</p></article>
    <article><strong>3</strong><h2>Correggi il file</h2><p>Usa il collegamento di modifica su GitHub e salva la modifica nel repository. Il sito statico non può scrivere direttamente nei file.</p></article>
  </section>

  <section class="botanical-quality-controls" aria-label="Filtri">
    <label for="botanical-quality-search">Cerca per nome, nome scientifico o identificativo</label>
    <input type="search" id="botanical-quality-search" placeholder="Es. rucola, Brassica, SG-000001" autocomplete="off">
    <div class="botanical-quality-filter-row">
      <label><input type="checkbox" id="botanical-quality-family" checked> Famiglia botanica mancante</label>
      <label><input type="checkbox" id="botanical-quality-life" checked> Ciclo di vita mancante</label>
      <label><input type="checkbox" id="botanical-quality-all"> Includi dossier senza problemi rilevati</label>
    </div>
    <p id="botanical-quality-count" aria-live="polite" class="botanical-quality-count"></p>
  </section>

  {% assign collections_to_audit = site.seeds | concat: site.perennials | concat: site.spontaneous | sort_natural: "nome_comune" %}
  <section class="botanical-quality-list" id="botanical-quality-list" aria-label="Dossier da controllare">
    {% for plant in collections_to_audit %}
      {% assign family = plant.famiglia | default: plant.famiglia_botanica | strip %}
      {% assign family_normalized = family | downcase %}
      {% assign life = plant.ciclo_vita | default: plant.life | strip %}
      {% assign life_normalized = life | downcase %}
      {% assign family_missing = false %}
      {% assign life_missing = false %}
      {% if family == "" or family_normalized == "non classificata" or family_normalized == "non registrata" or family_normalized == "da verificare" or family_normalized == "sconosciuta" or family_normalized == "non specificata" %}{% assign family_missing = true %}{% endif %}
      {% if life == "" or life_normalized == "non registrato" or life_normalized == "non specificato" or life_normalized == "da verificare" or life_normalized == "sconosciuto" or life_normalized == "unknown" %}{% assign life_missing = true %}{% endif %}
      {% assign collection_path = plant.path | default: "" %}
      {% assign record_name = plant.nome_comune | default: plant.title | default: plant.name | default: plant.slug %}
      {% assign scientific_name = plant.nome_scientifico | default: plant.scientific_name | default: "" %}
      {% assign record_id = plant.sg_id | default: plant.id | default: plant.slug | default: plant.name %}
      {% assign record_url = plant.url | relative_url %}
      {% assign issue = false %}{% if family_missing or life_missing %}{% assign issue = true %}{% endif %}
        <article class="botanical-quality-card" data-family-missing="{{ family_missing }}" data-life-missing="{{ life_missing }}" data-issue="{{ issue }}" data-search="{{ record_name | append: ' ' | append: scientific_name | append: ' ' | append: record_id | downcase | escape }}">
          <div class="botanical-quality-card-head">
            <div><h2><a href="{{ record_url }}">{{ record_name | escape }}</a></h2>{% if scientific_name != "" %}<p class="botanical-quality-scientific"><em>{{ scientific_name | escape }}</em></p>{% endif %}</div>
            <span class="botanical-quality-id">{{ record_id | escape }}</span>
          </div>
          <div class="botanical-quality-fields">
            <p><strong>Famiglia botanica</strong><span class="{% if family_missing %}is-missing{% else %}is-present{% endif %}">{% if family_missing %}Da verificare{% else %}{{ family | escape }}{% endif %}</span></p>
            <p><strong>Ciclo di vita</strong><span class="{% if life_missing %}is-missing{% else %}is-present{% endif %}">{% if life_missing %}Da verificare{% else %}{{ life | escape }}{% endif %}</span></p>
          </div>
          <div class="botanical-quality-actions"><a href="{{ record_url }}">Apri dossier ↗</a>{% if collection_path != "" %}<a href="https://github.com/MS-SMX/soil-genesis/edit/main/{{ collection_path | remove_first: '/' }}" target="_blank" rel="noopener noreferrer">Modifica su GitHub ↗</a>{% endif %}</div>
        </article>
    {% endfor %}
    <p id="botanical-quality-no-results" class="botanical-quality-empty" hidden>Nessun dossier corrisponde ai filtri. Può essere una buona notizia, oppure hai disattivato tutti i criteri. Controlla i filtri, prima di festeggiare.</p>
  </section>

  <details class="botanical-quality-method">
    <summary>Metodo e limiti del controllo</summary>
    <ul>
      <li>Il controllo considera mancanti anche alcuni segnaposto espliciti come «da verificare» e «non classificata».</li>
      <li>Non valuta la correttezza scientifica di una famiglia o di un ciclo già compilato.</li>
      <li>Le categorie tassonomiche possono cambiare tra fonti e aggiornamenti; conserva una fonte verificabile nel dossier quando la correzione è significativa.</li>
      <li>La modifica diventa pubblica solo dopo il commit e la pubblicazione del repository.</li>
    </ul>
  </details>
</div>
<script src="{{ '/assets/js/botanical-quality.js' | relative_url }}" defer></script>
