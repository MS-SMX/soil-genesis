---
layout: default
title: Famiglie Botaniche
---

{% include window.html
module="MOD-TAX-01"
title="FAMIGLIE BOTANICHE"
content="Navigazione tassonomica dell'archivio."
%}

<div class="family-grid">

{% assign famiglie = site.seeds | group_by:"famiglia" %}

{% for famiglia in famiglie %}

<div class="family-card">

<h2>

{{ famiglia.name }}

</h2>

<p>

{{ famiglia.items.size }} varietà

</p>

</div>

{% endfor %}

</div>