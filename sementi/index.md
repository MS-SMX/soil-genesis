---
layout: default
title: Archivio sementi
---

{% include window.html
module="MOD-SEED-02"
title="ARCHIVIO SEMENTI"
content="Consulta l'archivio delle varietà conservate da Soil Genesis."
%}


<div class="seed-list">

{% for seed in site.seeds %}

<a class="seed-card"
href="{{ seed.url | relative_url }}">

<h3>{{ seed.nome_comune }}</h3>

<p><em>{{ seed.nome_scientifico }}</em></p>

<span>{{ seed.id }}</span>

</a>

{% endfor %}

</div>