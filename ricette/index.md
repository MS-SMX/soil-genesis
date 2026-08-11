---
layout: default
title: Ricette
permalink: /ricette/
---

<div class="recipes-page">

    <header class="recipes-header">

        <div class="recipes-kicker">
            SOIL GENESIS // RECIPES
        </div>

        <h1>RICETTE</h1>

        <p class="recipes-intro">
            Ricette che ho provato e si sono rivelate buone. Se ci sono riuscito io, puoi farcela anche tu. Per quanto stia cercando di ridurne il consumo e trovare alternative vegetali, sono presenti ricette che utilizzano carne.
        </p>

    </header>


    <!-- ==========================================
         SEARCH
    =========================================== -->

    <section class="recipes-search">

        <label for="recipe-search">
            CERCA INGREDIENTE
        </label>

        <input
            id="recipe-search"
            type="search"
            placeholder="pomodoro, ceci, basilico..."
            autocomplete="off">

        <div id="recipe-search-results"></div>

    </section>


    <!-- ==========================================
         CATEGORIES
    =========================================== -->

    <section class="recipe-category-section">

        <div class="section-label">
            CATEGORIE
        </div>

        <div class="recipe-category-grid">

            {% for category in site.data.recipe_categories %}

                <a
                    class="recipe-category-card"
                    href="{{ '/ricette/categoria/' | append: category.id | append: '/' | relative_url }}">

                    <span class="recipe-category-title">
                        {{ category.title }}
                    </span>

                    {% if category.subtitle %}

                        <span class="recipe-category-subtitle">
                            {{ category.subtitle }}
                        </span>

                    {% endif %}

                </a>

            {% endfor %}

        </div>

    </section>


    <!-- ==========================================
         WORLD CUISINES
    =========================================== -->

    <section class="recipe-region-section">

        <div class="section-label">
            CUCINE DEL MONDO
        </div>

        <div class="recipe-region-grid">

            {% for region in site.data.recipe_regions %}

                <a
                    class="recipe-region-card"
                    href="{{ '/ricette/regione/' | append: region.id | append: '/' | relative_url }}">

                    {{ region.title }}

                </a>

            {% endfor %}

        </div>

    </section>


    <!-- ==========================================
         SOIL GENESIS
    =========================================== -->

  <!--  <section class="recipe-soil-section">

        <div class="section-label">
            SOIL GENESIS
        </div>

        <div class="recipe-soil-intro">

            <h2>
                INGREDIENTI DELL'ARCHIVIO
            </h2>

            <p>
                Ricette che utilizzano piante e varietà
                presenti nell'archivio biologico di Soil Genesis.
            </p>

            <a
                class="recipe-soil-link"
                href="{{ '/sementi/' | relative_url }}">

                ESPLORA L'ARCHIVIO →

            </a>

        </div>

    </section> --->

    <!-- ==========================================
         RECIPE INDEX
    =========================================== -->

    <section class="recipe-index-section">

        <div class="section-label">
            RICETTE DISPONIBILI
        </div>

        <div class="recipe-index-grid">

            {% for recipe in site.recipes %}

<a
    class="recipe-index-card"
    href="{{ recipe.url | relative_url }}">

    {% if recipe.image %}

        <div class="recipe-index-card-image">

            <img
                src="{{ recipe.image | relative_url }}"
                alt="{{ recipe.title }}"
                loading="lazy">

        </div>

    {% endif %}

    <div class="recipe-index-card-content">

        <div class="recipe-index-card-title">
            {{ recipe.title }}
        </div>

        {% if recipe.description %}

            <div class="recipe-index-card-description">
                {{ recipe.description }}
            </div>

        {% endif %}

        {% if recipe.categories %}

            <div class="recipe-index-card-meta">

                {% for category in recipe.categories %}

                    <span>
                        {{ category | replace: "-", " " }}
                    </span>

                {% endfor %}

            </div>

        {% endif %}

    </div>

</a>

            {% endfor %}

        </div>

    </section>


    <!-- ==========================================
         RECIPE SEARCH INDEX
    =========================================== -->

    <script>

    window.SG_RECIPE_INDEX = [

    {% for recipe in site.recipes %}

    {
        title:
            {{ recipe.title | jsonify }},

        url:
            {{ recipe.url | relative_url | jsonify }},

        categories:
            {{ recipe.categories | jsonify }},

        ingredients: [

            {% for ingredient in recipe.ingredients %}

            {
                searchable: [

                    {{ ingredient.name
                        | downcase
                        | jsonify }}

                    {% if ingredient.aliases %}

                        {% for alias in ingredient.aliases %}

                        ,
                        {{ alias
                            | downcase
                            | jsonify }}

                        {% endfor %}

                    {% endif %}

                ]

            }

            {% unless forloop.last %},{% endunless %}

            {% endfor %}

        ]

    }

    {% unless forloop.last %},{% endunless %}

    {% endfor %}

    ];

    </script>

</div>