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

        <h1>TERRITORIO</h1>

        <p>
            Registro spaziale e temporale delle coltivazioni.
        </p>

    </header>


    <section class="territory-controls">

        <div class="territory-control">

            <span>ANNO</span>

            <select id="territory-year">

                <option value="2026">
                    2026
                </option>

            </select>

        </div>

<div class="territory-control territory-date">

    <span>DATA</span>

    <div class="territory-timeline">

        <div class="territory-timeline-years">

            <button
                type="button"
                class="territory-year-button active"
                data-year="2026">

                2026

            </button>

            <button
                type="button"
                class="territory-year-button"
                data-year="2025">

                2025

            </button>

            <button
                type="button"
                class="territory-year-button"
                data-year="2024">

                2024

            </button>

        </div>


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

</div>


        <div class="territory-control">

            <span>VISTA</span>

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

        <div class="territory-map-container">

            <svg
                id="territory-map"
                class="territory-map"
                viewBox="0 0 1200 1100"
                preserveAspectRatio="xMidYMid meet"
                aria-label="Mappa del terreno Soil Genesis">


                <!-- ==========================================
                     TERRENO
                =========================================== -->

               <rect
    x="40"
    y="40"
    width="1120"
    height="1020"
    class="territory-ground"
/>


<!-- ==========================================
     NUCLEO CENTRALE
     Scala: 24 px = 1 m
========================================== -->

<!-- ESAGONO OVEST -->

<polygon
    id="HEX-W"
    class="territory-area territory-radial"
    data-area="HEX-W"
    points="
        272.2,110
        480,230
        480,470
        272.2,590
        64.4,470
        64.4,230
    "
/>


<!-- QUADRATO CENTRALE -->

<rect
    id="SQUARE"
    class="territory-area territory-square"
    data-area="SQUARE"
    x="480"
    y="230"
    width="240"
    height="240"
/>


<!-- ESAGONO EST -->

<polygon
    id="HEX-E"
    class="territory-area territory-radial"
    data-area="HEX-E"
    points="
        927.8,110
        1135.6,230
        1135.6,470
        927.8,590
        720,470
        720,230
    "
/>

<!-- ==========================================
     MEZZO ESAGONO NORD
========================================== -->

<polygon
    id="HALF-N"
    class="territory-area territory-polygon"
    data-area="HALF-N"
    points="
        272.2,110
        500,20
        720,20
        927.8,110
        720,230
        480,230
    "
/>

<!-- ==========================================
     MEZZO ESAGONO SUD
========================================== -->

<polygon
    id="HALF-S"
    class="territory-area territory-polygon"
    data-area="HALF-S"
    points="
        272.2,590
        480,470
        720,470
        927.8,590
        700,680
        500,680
    "
/>

<!-- ==========================================
     SETTE FILE
     Lunghezza reale: circa 30 m
     Larghezza aiuola: 0.8 m
========================================== -->

<g
    id="territory-rows"
    class="territory-rows">

    <line
        class="territory-row"
        data-area="ROW-01"
        x1="240"
        y1="720"
        x2="960"
        y2="720"
    />

    <line
        class="territory-row"
        data-area="ROW-02"
        x1="240"
        y1="748"
        x2="960"
        y2="748"
    />

    <line
        class="territory-row"
        data-area="ROW-03"
        x1="240"
        y1="776"
        x2="960"
        y2="776"
    />

    <line
        class="territory-row"
        data-area="ROW-04"
        x1="240"
        y1="804"
        x2="960"
        y2="804"
    />

    <line
        class="territory-row"
        data-area="ROW-05"
        x1="240"
        y1="832"
        x2="960"
        y2="832"
    />

    <line
        class="territory-row"
        data-area="ROW-06"
        x1="240"
        y1="860"
        x2="960"
        y2="860"
    />

    <line
        class="territory-row row-hedge"
        data-area="ROW-07"
        x1="240"
        y1="888"
        x2="960"
        y2="888"
    />

</g>


                <!-- ==========================================
                     FASCIA LATERALE
                =========================================== -->

                <polygon
    id="EDGE-E"
    class="territory-area territory-polygon"
    data-area="EDGE-E"
    points="
        950,150
        1080,170
        1080,690
        950,650
    "
/>


                <!-- ==========================================
                     AROMATICHE
                =========================================== -->

        <path
    id="HERBS"
    class="territory-area territory-herbs"
    data-area="HERBS"
    d="
        M 80 180
        A 120 120 0 0 1 320 180
        L 200 180
        Z
    "
/>

<!-- ==========================================
     CAMMINAMENTI RADIALI
========================================== -->

<g
    id="territory-radial-paths"
    class="territory-radial-paths">

    <!-- ESAGONO OVEST -->

    <line
        x1="272.2"
        y1="350"
        x2="64.4"
        y2="230"
        class="territory-radial-path"
    />

    <line
        x1="272.2"
        y1="350"
        x2="209"
        y2="470"
        class="territory-radial-path"
    />

    <line
        x1="272.2"
        y1="350"
        x2="480"
        y2="470"
        class="territory-radial-path"
    />

    <line
        x1="272.2"
        y1="350"
        x2="480"
        y2="230"
        class="territory-radial-path"
    />

    <line
        x1="272.2"
        y1="350"
        x2="209"
        y2="230"
        class="territory-radial-path"
    />

    <line
        x1="272.2"
        y1="350"
        x2="335"
        y2="590"
        class="territory-radial-path"
    />


    <!-- ESAGONO EST -->

    <line
        x1="927.8"
        y1="350"
        x2="720"
        y2="230"
        class="territory-radial-path"
    />

    <line
        x1="927.8"
        y1="350"
        x2="669"
        y2="470"
        class="territory-radial-path"
    />

    <line
        x1="927.8"
        y1="350"
        x2="720"
        y2="470"
        class="territory-radial-path"
    />

    <line
        x1="927.8"
        y1="350"
        x2="1135.6"
        y2="470"
        class="territory-radial-path"
    />

    <line
        x1="927.8"
        y1="350"
        x2="1135.6"
        y2="230"
        class="territory-radial-path"
    />

    <line
        x1="927.8"
        y1="350"
        x2="790"
        y2="590"
        class="territory-radial-path"
    />

</g>

<g
    id="territory-gates"
    class="territory-gates">

    <rect
        x="263"
        y="106"
        width="18"
        height="8"
        class="territory-gate"
    />

    <rect
        x="198"
        y="226"
        width="8"
        height="18"
        class="territory-gate"
    />

    <rect
        x="198"
        y="456"
        width="8"
        height="18"
        class="territory-gate"
    />


    <rect
        x="919"
        y="106"
        width="18"
        height="8"
        class="territory-gate"
    />

    <rect
        x="1124"
        y="226"
        width="8"
        height="18"
        class="territory-gate"
    />

    <rect
        x="1124"
        y="456"
        width="8"
        height="18"
        class="territory-gate"
    />

</g>

                <!-- ==========================================
                     COLTIVAZIONI DINAMICHE
                =========================================== -->

                <g
                    id="territory-cultivations">
                </g>


                <!-- ==========================================
                     ELEMENTI PERMANENTI
                =========================================== -->

               <g
    id="territory-permanent"
    class="territory-permanent">

    <g
        class="territory-tree-marker"
        data-permanent="TREE-CENTER">

        <circle
            cx="600"
            cy="350"
            r="11"
        />

        <circle
            cx="600"
            cy="350"
            r="4"
            class="territory-tree-core"
        />

    </g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-01">
    <circle cx="272.2" cy="110" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-02">
    <circle cx="64.4" cy="230" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-03">
    <circle cx="64.4" cy="470" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-04">
    <circle cx="272.2" cy="590" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-05">
    <circle cx="480" cy="470" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-W-06">
    <circle cx="480" cy="230" r="8"/>
</g>


<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-01">
    <circle cx="927.8" cy="110" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-02">
    <circle cx="1135.6" cy="230" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-03">
    <circle cx="1135.6" cy="470" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-04">
    <circle cx="927.8" cy="590" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-05">
    <circle cx="720" cy="470" r="8"/>
</g>

<g
    class="territory-tree-marker"
    data-permanent="TREE-HEX-E-06">
    <circle cx="720" cy="230" r="8"/>
</g>

</g>

            </svg>

        </div>


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