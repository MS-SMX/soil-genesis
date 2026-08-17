---
layout: ground-flora
title: Flora Spontanea
description: Specie che il terreno ospita spontaneamente, senza essere state introdotte nel percorso Soil Genesis.
permalink: /sementi/spontanee/
---

<section class="flora-grid">

    {% for plant in site.spontaneous %}

        <article class="flora-card spontaneous-card">

            <a
                href="{{ plant.url | relative_url }}"
                class="flora-card-link">

             <div class="flora-image">

    {% if plant.immagine %}

        <img
            src="{{ '/assets/images/spontaneous/' | append: plant.immagine | relative_url }}"
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

                        {% if plant.abbondanza %}

                            <span>
                                {{ plant.abbondanza }}
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


                    {% if plant.habitat %}

                        <div class="flora-habitat">

                            {{ plant.habitat | join: " · " }}

                        </div>

                    {% endif %}

                </div>

            </a>

        </article>

    {% endfor %}

</section>