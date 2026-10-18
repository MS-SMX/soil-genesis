---
layout: default
title: Field Log
permalink: /log/field-log/
---
<div class="log-page">
  <header class="log-header"><div class="log-kicker">SOIL GENESIS // FIELD RECORDS</div><h1>FIELD LOG</h1><p>Registrazioni del Diario pubblicate nel repository. Le bozze locali non sono visibili qui finché non vengono aggiunte e pubblicate.</p></header>
  <section class="log-grid">
    {% assign entries = site.logs | where: "type", "field" | sort: "date" | reverse %}
    {% for entry in entries %}
      <a class="log-row blog-row" href="{{ entry.url | relative_url }}"><div class="log-row-main"><div class="log-row-meta"><span>FIELD LOG // {{ entry.date | date: "%d.%m.%Y" }}</span><span>{{ entry.category | escape }}</span></div><h2>{{ entry.title | escape }}</h2><p>{{ entry.description | default: entry.content | strip_html | truncate: 180 | escape }}</p></div><span class="log-row-action">APRI ↗</span></a>
    {% else %}
      <p>Nessuna registrazione pubblicata.</p>
    {% endfor %}
  </section>
</div>
