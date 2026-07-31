---
layout: application
title: Famiglie botaniche
---

# Famiglie botaniche

Breve testo introduttivo...

{% assign families = site.seeds | group_by: "famiglia" | sort: "name" %}

<div class="family-grid">

{% for family in families %}

<div class="family-card">

## {{ family.name | capitalize }}

**{{ family.items.size }} varietà**

<ul>

{% for seed in family.items %}

<li>

<a href="{{ seed.url | relative_url }}">

{{ seed.nome_comune }}

</a>

</li>

{% endfor %}

</ul>

</div>

{% endfor %}

</div>