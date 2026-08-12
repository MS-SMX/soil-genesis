---
layout: default
title: Territorio
permalink: /territorio/
---

<div class="territory-page">

    <header class="territory-header">

        <div class="territory-kicker">
            SOIL GENESIS // TERRITORY
        </div>

        <h1>
            TERRITORIO
        </h1>

        <p>
            Registro spaziale e temporale delle coltivazioni.
        </p>

    </header>


    <section class="territory-controls">

        <div class="territory-control">

            <span>
                ANNO
            </span>

            <select id="territory-year">

                <option value="2026">
                    2026
                </option>

            </select>

        </div>


        <div class="territory-control territory-date">

            <span>
                DATA
            </span>

            <input
                id="territory-date"
                type="range"
                min="1"
                max="365"
                value="180">

            <output id="territory-date-label">
                29 GIU
            </output>

        </div>


        <div class="territory-control">

            <span>
                VISTA
            </span>

            <div class="territory-view-buttons">

                <button
                    type="button"
                    class="territory-view active"
                    data-view="structure">

                    STRUTTURA

                </button>

                <button
                    type="button"
                    class="territory-view"
                    data-view="cultivations">

                    COLTIVAZIONI

                </button>

            </div>

        </div>

    </section>


    <section class="territory-map-wrapper">

        <svg
            id="territory-map"
            class="territory-map"
            viewBox="
                0
                0
                {{ site.data.territory.canvas.width }}
                {{ site.data.territory.canvas.height }}
            "
            preserveAspectRatio="xMidYMid meet">

        </svg>

        <aside
            id="territory-inspector"
            class="territory-inspector">

            <div class="territory-inspector-empty">

                SELEZIONA UNA AREA

            </div>

        </aside>

    </section>


    <section class="territory-legend">

        <span class="territory-legend-title">
            LEGEND
        </span>

        <span>
            STRUTTURA
        </span>

        <span>
            COLTIVAZIONE
        </span>

        <span>
            PERENNE
        </span>

    </section>


    <script>

        window.SG_TERRITORY =
            {{ site.data.territory | jsonify }};

        window.SG_CULTIVATIONS =
            {{ site.data.cultivations.cultivations
               | jsonify }};

    </script>

</div>