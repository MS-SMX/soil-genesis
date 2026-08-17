---
layout: ground-flora
title: Flora Perenne
description: Alberi, arbusti, piccoli frutti e altre piante perenni presenti nel terreno Soil Genesis.
permalink: /sementi/perenni/
---

<section class="flora-grid">

    {% for plant in site.perennials %}

        <article class="flora-card">

            <a
                href="{{ plant.url | relative_url }}"
                class="flora-card-link">

               <div class="flora-image">

    {% if plant.immagine %}

        <img
            src="{{ '/assets/images/perennials/' | append: plant.immagine | relative_url }}"
            alt="{{ plant.nome_comune }}"
            loading="lazy">

    {% else %}

        <div class="flora-placeholder">
            IMAGE PENDING
        </div>

    {% endif %}

</div>


                <div class="flora-card-body">

                    <div class="flora-meta">

                        <span>
                            {{ plant.resident_id }}
                        </span>

                        {% if plant.tipo %}

                            <span>
                                {{ plant.tipo | join: " · " }}
                            </span>

                        {% endif %}

                    </div>


                    <h2>
                        {{ plant.nome_comune }}
                    </h2>


                    {% if plant.nome_scientifico %}

                        <div class="flora-scientific">

                            {{ plant.nome_scientifico }}

                        </div>

                    {% endif %}


                    {% if plant.famiglia %}

                        <div class="flora-family">

                            🌿 {{ plant.famiglia }}

                        </div>

                    {% endif %}


                    {% if plant.anno_impianto %}

                        <div class="flora-year">

                            IMPIANTO
                            {{ plant.anno_impianto }}

                        </div>

                    {% endif %}

                </div>

            </a>

        </article>

    {% endfor %}

</section>