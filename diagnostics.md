---
layout: application
title: Diagnostics
permalink: /diagnostics/
---

# Diagnostics

<table class="sg-table">

<tr>

<td>Totale dossier</td>

<td>{{ site.seeds.size }}</td>

</tr>

<tr>

<td>Senza provenienza</td>

<td>

{% assign count = 0 %}

{% for seed in site.seeds %}

{% unless seed.provenienza %}

{% assign count = count | plus: 1 %}

{% endunless %}

{% endfor %}

{{ count }}

</td>

</tr>

<tr>

<td>Senza immagini</td>

<td>

{% assign count = 0 %}

{% for seed in site.seeds %}

{% unless seed.immagini %}

{% assign count = count | plus: 1 %}

{% endunless %}

{% endfor %}

{{ count }}

</td>

</tr>

</table>

<h2>Controllo campi obbligatori</h2>

<table class="sg-table">

<tr>

<th>Dossier</th>

<th>Problemi</th>

</tr>

{% assign required = site.data.core.schema.required %}

{% for seed in site.seeds %}

{% assign missing = "" %}

{% for field in required %}

{% unless seed[field] %}

{% assign missing = missing | append: field | append: ", " %}

{% endunless %}

{% endfor %}

<tr>

<td>

<a href="{{ seed.url | relative_url }}">

{{ seed.nome_comune }}

</a>

</td>

<td>

{% if missing == "" %}

✅ Completo

{% else %}

⚠ {{ missing }}

{% endif %}

</td>

</tr>

{% endfor %}

</table>

<h2>ID duplicati</h2>

{% assign ids = "" | split: "" %}

<ul>

{% for seed in site.seeds %}

{% if ids contains seed.id %}

<li>

⚠ {{ seed.id }}

</li>

{% else %}

{% assign ids = ids | push: seed.id %}

{% endif %}

{% endfor %}

</ul>

<h2>Cover mancanti</h2>

<ul>

{% for seed in site.seeds %}

{% unless seed.cover %}

<li>

{{ seed.nome_comune }}

</li>

{% endunless %}

{% endfor %}

</ul>