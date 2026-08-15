document.addEventListener("DOMContentLoaded", () => {

    const map =
        document.querySelector("#territory-map");

    if (!map) {
        return;
    }


    const data =
        window.SG_TERRITORY || {
            areas: []
        };


    const cultivations =
        window.SG_CULTIVATIONS || [];


    const cultivationLayer =
        document.querySelector(
            "#territory-cultivations"
        );


    const inspector =
        document.querySelector(
            "#territory-inspector"
        );


    let currentView =
        "structure";


  let selectedYear = 2026;

let selectedDate =
    new Date(
        selectedYear,
        5,
        29
    );


    /*
    ==========================================
    LABELS
    ==========================================
    */

    const labels = {

        "HEX-W":
            "ESAGONO OVEST",

        "SQUARE":
            "QUADRATO CENTRALE",

        "HEX-E":
            "ESAGONO EST",

        "HALF-N":
            "MEZZO ESAGONO NORD",

        "HALF-S":
            "MEZZO ESAGONO SUD",

        "HERBS":
            "AROMATICHE",

        "ROW-01":
            "FILARE AGROFORESTALE",

        "ROW-02":
            "FILA 02",

        "ROW-03":
            "FILA 03",

        "ROW-04":
            "FILA 04",

        "ROW-05":
            "FILA 05",

        "ROW-06":
            "FILA 06",

        "ROW-07":
            "SIEPE + FRUTTI MINORI",

        "EDGE-E":
            "FASCIA LATERALE EST",

        "PATH-NORTH":
            "CAMMINAMENTO NORD"

    };


    /*
    ==========================================
    INSPECTOR
    ==========================================
    */

    function inspectArea(id) {

        if (!inspector) {
            return;
        }


        inspector.innerHTML = `

            <div class="territory-inspector-label">
                AREA
            </div>

            <h2>
                ${labels[id] || id}
            </h2>

            <div class="territory-inspector-meta">
                ${id}
            </div>

        `;

    }
function inspectPermanent(
    id
) {

    if (!inspector) {
        return;
    }


    const labels = {

        "TREE-CENTER":
            "ALBERO CENTRALE",

        "TREE-HEX-W-01":
            "ALBERO DA FRUTTO",

        "TREE-HEX-W-02":
            "ALBERO DA FRUTTO",

        "TREE-HEX-W-03":
            "ALBERO DA FRUTTO",

        "TREE-HEX-W-04":
            "ALBERO DA FRUTTO",

        "TREE-HEX-W-05":
            "ALBERO DA FRUTTO",

        "TREE-HEX-W-06":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-01":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-02":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-03":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-04":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-05":
            "ALBERO DA FRUTTO",

        "TREE-HEX-E-06":
            "ALBERO DA FRUTTO"

    };


    inspector.innerHTML = `

        <div class="territory-inspector-label">
            STRUTTURA PERMANENTE
        </div>

        <h2>
            ${labels[id] || id}
        </h2>

        <div class="territory-inspector-meta">

            <div>
                ID
                <strong>
                    ${id}
                </strong>
            </div>

        </div>

    `;

}

  function inspectCultivation(
    cultivation
) {

    if (!inspector) {
        return;
    }


    const cropName =
        cultivation.crop_label ||
        cultivation.accession ||
        "ACCESSION UNKNOWN";


    const area =
        cultivation.area ||
        "—";


    const position =
        cultivation.start_m != null &&
        cultivation.end_m != null

            ? `${cultivation.start_m} → ${cultivation.end_m} m`

            : "—";


    const seedLink =
        cultivation.accession
            ? `/sementi/${cultivation.accession}/`
            : null;


    inspector.innerHTML = `

        <div class="territory-inspector-label">
            COLTIVAZIONE
        </div>


        <h2>
            ${cropName}
        </h2>


        <div class="territory-inspector-meta">

            <div>

                ACCESSION

                <strong>
                    ${cultivation.accession || "—"}
                </strong>

            </div>


            <div>

                AREA

                <strong>
                    ${area}
                </strong>

            </div>


            <div>

                POSIZIONE

                <strong>
                    ${position}
                </strong>

            </div>


            <div>

                INIZIO

                <strong>
                    ${cultivation.start_date || "—"}
                </strong>

            </div>


            <div>

                FINE

                <strong>
                    ${cultivation.end_date || "—"}
                </strong>

            </div>

        </div>


        ${
            seedLink
                ? `
                    <a
                        class="territory-seed-link"
                        href="${seedLink}">

                        APRI SCHEDA SEME →

                    </a>
                  `
                : ""
        }

    `;


    renderHistory(
        cultivation
    );

}
function renderHistory(
    cultivation
) {

    if (!inspector) {
        return;
    }


    const sameArea =
        cultivations
            .filter(
                item =>
                    item.area ===
                    cultivation.area
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.start_date
                    ) -
                    new Date(
                        b.start_date
                    )
            );


    if (!sameArea.length) {
        return;
    }


    const history =
        sameArea
            .map(
                item => `

                    <div
                        class="territory-history-item">

                        <strong>
                            ${
                                item.crop_label ||
                                item.accession ||
                                "UNKNOWN"
                            }
                        </strong>

                        <span>
                            ${item.start_date}
                            →
                            ${item.end_date}
                        </span>

                    </div>

                `
            )
            .join("");


    const block =
        document.createElement(
            "div"
        );


    block.className =
        "territory-history";


    block.innerHTML = `

        <div
            class="territory-inspector-label">

            STORICO

        </div>

        <div
            class="territory-history-list">

            ${history}

        </div>

    `;


    inspector.appendChild(
        block
    );

}
    /*
    ==========================================
    DATE
    ==========================================
    */

    function isActiveAtDate(
        cultivation
    ) {

        if (
            !cultivation.start_date ||
            !cultivation.end_date
        ) {

            return false;

        }


        const start =
            new Date(
                cultivation.start_date
            );


        const end =
            new Date(
                cultivation.end_date
            );


        return (
            selectedDate >= start &&
            selectedDate <= end
        );

    }


    const dateSlider =
        document.querySelector(
            "#territory-date"
        );


    const dateLabel =
        document.querySelector(
            "#territory-date-label"
        );


    function updateSelectedDate() {

    if (!dateSlider) {
        return;
    }


    const day =
        Number(
            dateSlider.value
        );


    selectedDate =
        new Date(
            selectedYear,
            0,
            day
        );


    if (dateLabel) {

        dateLabel.textContent =

            selectedDate

                .toLocaleDateString(
                    "it-IT",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                )

                .toUpperCase();

    }


    renderCultivations();

}


    if (dateSlider) {

        dateSlider.addEventListener(
            "input",
            updateSelectedDate
        );

    }


    /*
    ==========================================
    STATIC AREAS
    ==========================================
    */

    map
        .querySelectorAll(
            "[data-area]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    () => {

                        inspectArea(
                            element.dataset.area
                        );

                    }
                );

            }
        );
map
    .querySelectorAll(
        "[data-permanent]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    inspectPermanent(
                        element.dataset.permanent
                    );

                }
            );

        }
    );

    /*
    ==========================================
    CULTIVATION LAYER
    ==========================================
    */

    function clearCultivations() {

        if (!cultivationLayer) {
            return;
        }


        cultivationLayer.innerHTML = "";

    }


    /*
    ==========================================
    RADIAL SECTOR GEOMETRY
    ==========================================
    */

    function sectorPath(
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle
    ) {

        function point(
            radius,
            angle
        ) {

            const radians =
                angle *
                Math.PI /
                180;


            return {

                x:
                    cx +
                    Math.cos(radians) *
                    radius,

                y:
                    cy +
                    Math.sin(radians) *
                    radius

            };

        }


        const outerStart =
            point(
                outerRadius,
                startAngle
            );


        const outerEnd =
            point(
                outerRadius,
                endAngle
            );


        const innerEnd =
            point(
                innerRadius,
                endAngle
            );


        const innerStart =
            point(
                innerRadius,
                startAngle
            );


        const largeArc =
            endAngle - startAngle > 180
                ? 1
                : 0;


        return `
            M ${outerStart.x} ${outerStart.y}

            A ${outerRadius}
              ${outerRadius}
              0
              ${largeArc}
              1
              ${outerEnd.x}
              ${outerEnd.y}

            L ${innerEnd.x} ${innerEnd.y}

            A ${innerRadius}
              ${innerRadius}
              0
              ${largeArc}
              0
              ${innerStart.x}
              ${innerStart.y}

            Z
        `;

    }


    /*
    ==========================================
    CULTIVATION RENDERER
    ==========================================
    */

    function renderCultivations() {

        clearCultivations();


        if (
            currentView !==
            "cultivations"
        ) {

            return;

        }


        if (!cultivationLayer) {
            return;
        }


        const NS =
            "http://www.w3.org/2000/svg";


        cultivations.forEach(
            cultivation => {

                if (
                    !isActiveAtDate(
                        cultivation
                    )
                ) {

                    return;

                }


                const area =
                    data.areas.find(
                        item =>
                            item.id ===
                            cultivation.area
                    );


                if (!area) {
                    return;
                }


                /*
                ==================================
                ROW
                ==================================
                */

                if (
                    area.type === "row"
                ) {

                    const rowLength =
                        Math.abs(
                            area.x2 -
                            area.x1
                        );


                    const startRatio =
                        Number(
                            cultivation.start_m
                        ) / 30;


                    const endRatio =
                        Number(
                            cultivation.end_m
                        ) / 30;


                    const startX =
                        area.x1 +
                        rowLength *
                        startRatio;


                    const endX =
                        area.x1 +
                        rowLength *
                        endRatio;


                    const segment =
                        document.createElementNS(
                            NS,
                            "line"
                        );


                    segment.setAttribute(
                        "x1",
                        startX
                    );


                    segment.setAttribute(
                        "y1",
                        area.y1
                    );


                    segment.setAttribute(
                        "x2",
                        endX
                    );


                    segment.setAttribute(
                        "y2",
                        area.y2
                    );


                    segment.setAttribute(
                        "class",
                        "territory-cultivation-segment"
                    );


                    segment.dataset.cultivation =
                        cultivation.id;


                    segment.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            inspectCultivation(
                                cultivation
                            );

                        }
                    );


                    cultivationLayer.appendChild(
                        segment
                    );


                    return;

                }


                /*
                ==================================
                RADIAL AREA
                ==================================
                */

                if (
                    area.type === "radial"
                ) {

                    if (
                        cultivation.ring == null ||
                        cultivation.sector == null
                    ) {

                        return;

                    }


                    const ring =
                        Number(
                            cultivation.ring
                        );


                    const sectorNumber =
                        Number(
                            cultivation.sector
                        );


                    /*
                     * 6 settori da 60°
                     */

                    const sectorGap =
                        3;


                    const sectorSize =
                        60;


                    const startAngle =
                        -90 +

                        (
                            sectorNumber - 1
                        ) *
                        sectorSize +

                        sectorGap / 2;


                    const endAngle =
                        -90 +

                        sectorNumber *
                        sectorSize -

                        sectorGap / 2;


                    /*
                     * Scala provvisoria:
                     * 24 px = 1 m
                     */

                    const bedWidth =
                        0.8 * 24;


                    const pathWidth =
                        0.35 * 24;


                    const outerRadius =
                        205 -

                        (
                            ring - 1
                        ) *

                        (
                            bedWidth +
                            pathWidth
                        );


                    const innerRadius =
                        outerRadius -
                        bedWidth;


                    if (
                        innerRadius <= 20 ||
                        outerRadius <= innerRadius
                    ) {

                        return;

                    }


                    const sectorPathElement =
                        document.createElementNS(
                            NS,
                            "path"
                        );


                    sectorPathElement.setAttribute(
                        "d",
                        sectorPath(
                            area.cx,
                            area.cy,
                            innerRadius,
                            outerRadius,
                            startAngle,
                            endAngle
                        )
                    );


                    sectorPathElement.setAttribute(
                        "class",
                        "territory-cultivation-sector"
                    );


                    sectorPathElement.dataset.cultivation =
                        cultivation.id;


                    sectorPathElement.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            inspectCultivation(
                                cultivation
                            );

                        }
                    );


                    cultivationLayer.appendChild(
                        sectorPathElement
                    );

                }

            }
        );

    }

    document
    .querySelectorAll(
        ".territory-year-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".territory-year-button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedYear =
                        Number(
                            button.dataset.year
                        );


                    dateSlider.value =
                        1;


                    updateSelectedDate();

                }
            );

        }
    );

    /*
    ==========================================
    VIEW SWITCH
    ==========================================
    */

    document
        .querySelectorAll(
            ".territory-view"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".territory-view"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        currentView =
                            button.dataset.view;


                        renderCultivations();

                    }
                );

            }
        );


    /*
    ==========================================
    INITIAL STATE
    ==========================================
    */

    if (dateSlider) {

        updateSelectedDate();

    } else {

        renderCultivations();

    }

});