---
layout: default
title: Home
---

{% capture hero %}

<div class="home-hero">

<div class="home-kicker">

NODE IT-074

</div>

<h1>

SOIL GENESIS

</h1>

<div class="home-subtitle">

Accesso eseguito, custode #034
</div>

<p>

× Sistema dedicato al recupero,
alla conservazione e alla diffusione gratuita
di sementi libere attraverso la tecnica 
dell'agricoltura rigenerativa. Leggere le FAQ per ulteriori informazioni.
</p>

</div>

{% endcapture %}

{% include window-home.html

content=hero

%}
<div class="home-bottom">

{% include home/recent.html %}

{% include home/monthly-operations.html %}
</div>