---
layout: default

title: Archivio sementi
---

<div class="window">

<div class="window-header">

<span class="window-title">

SEED ARCHIVE

</span>

</div>

<div class="window-content">

<input
id="searchBox"
type="text"
placeholder="Cerca una varietà...">

<ul class="seed-list">

{% assign ordered = site.seeds | sort:"nome" %}

{% for seed in ordered %}

<li>

<a href="{{ seed.url | relative_url }}">

{{ seed.nome }}

</a>

</li>

{% endfor %}

</ul>

</div>

</div>