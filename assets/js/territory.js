document.addEventListener("DOMContentLoaded", () => {

    const map =
        document.querySelector("#territory-map");

    if (!map || !window.SG_TERRITORY) {
        return;
    }


    const data =
        window.SG_TERRITORY;

    const cultivations =
        window.SG_CULTIVATIONS || [];


    const NS =
        "http://www.w3.org/2000/svg";


    let currentView =
        "structure";


    /*
    ==========================================
    HELPERS
    ==========================================
    */

    function polygonPoints(points) {

        return points
            .map(point => point.join(","))
            .join(" ");

    }


    function createElement(
        name,
        attributes = {}
    ) {

        const element =
            document.createElementNS(
                NS,
                name
            );

        Object.entries(attributes)
            .forEach(
                ([key, value]) => {

                    element.setAttribute(
                        key,
                        value
                    );

                }
            );

        return element;

    }


    /*
    ==========================================
    MAP
    ==========================================
    */

    function renderMap() {

        map.innerHTML = "";

console.log(
    "TERRITORY AREAS:",
    data.areas
);
        const ground =
            createElement(
                "rect",
                {
                    x: data.ground.x,
                    y: data.ground.y,
                    width: data.ground.width,
                    height: data.ground.height,
                    class: "territory-ground"
                }
            );


        map.appendChild(
            ground
        );


        data.areas.forEach(
            area => {

                renderArea(
                    area
                );

            }
        );


        renderPermanent();
        renderCultivations();

    }


    /*
    ==========================================
    AREAS
    ==========================================
    */

    function renderArea(area) {

        let element;


        if (area.type === "square") {

            element =
                createElement(
                    "rect",
                    {
                        x: area.x,
                        y: area.y,
                        width: 200,
                        height: 200,
                        class:
                            "territory-area territory-square"
                    }
                );

        }


        else if (
            area.type === "polygon"
        ) {

            element =
                createElement(
                    "polygon",
                    {
                        points:
                            polygonPoints(
                                area.points
                            ),

                        class:
                            "territory-area territory-polygon"
                    }
                );

        }


        else if (
            area.type === "row"
        ) {

            element =
                createElement(
                    "line",
                    {
                        x1: area.x1,
                        y1: area.y1,
                        x2: area.x2,
                        y2: area.y2,

                        class:
                            "territory-row"
                    }
                );

        }


        else if (
            area.type === "semicircle"
        ) {

            const r =
                100;

            const start =
                polarPoint(
                    area.cx,
                    area.cy,
                    r,
                    area.start_angle
                );

            const end =
                polarPoint(
                    area.cx,
                    area.cy,
                    r,
                    area.end_angle
                );


            const path =
                `M ${start.x} ${start.y}
                 A ${r} ${r} 0 0 1
                 ${end.x} ${end.y}
                 L ${area.cx} ${area.cy}
                 Z`;


            element =
                createElement(
                    "path",
                    {
                        d: path,
                        class:
                            "territory-area territory-herbs"
                    }
                );

        }


        else if (
            area.type === "radial"
        ) {

            const points =
                regularPolygon(
                    area.cx,
                    area.cy,
                    125,
                    6
                );


            element =
                createElement(
                    "polygon",
                    {
                        points:
                            polygonPoints(
                                points
                            ),

                        class:
                            "territory-area territory-radial"
                    }
                );

        }


        if (!element) {
            return;
        }


        element.dataset.area =
            area.id;


        element.addEventListener(
            "click",
            () => {

                inspectArea(
                    area
                );

            }
        );


        map.appendChild(
            element
        );

    }


    function polarPoint(
        cx,
        cy,
        radius,
        degrees
    ) {

        const rad =
            degrees *
            Math.PI /
            180;


        return {

            x:
                cx +
                Math.cos(rad) *
                radius,

            y:
                cy +
                Math.sin(rad) *
                radius

        };

    }


    function regularPolygon(
        cx,
        cy,
        radius,
        sides
    ) {

        const points = [];


        for (
            let i = 0;
            i < sides;
            i++
        ) {

            points.push(
                polarPoint(
                    cx,
                    cy,
                    radius,
                    -90 +
                    i *
                    (360 / sides)
                )
            );

        }


        return points;

    }


    /*
    ==========================================
    PERMANENT
    ==========================================
    */

    function renderPermanent() {

        if (
            !data.permanent
        ) {
            return;
        }


        (
            data.permanent.trees ||
            []
        ).forEach(
            tree => {

                const circle =
                    createElement(
                        "circle",
                        {
                            cx: tree.x,
                            cy: tree.y,
                            r: 8,
                            class:
                                "territory-tree"
                        }
                    );


                map.appendChild(
                    circle
                );

            }
        );

    }


    /*
    ==========================================
    CULTIVATIONS
    ==========================================
    */

    function renderCultivations() {

        if (
            currentView !==
            "cultivations"
        ) {
            return;
        }


        cultivations.forEach(
            cultivation => {

                const area =
                    data.areas.find(
                        item =>
                            item.id ===
                            cultivation.area
                    );


                if (!area) {
                    return;
                }


                const marker =
                    createElement(
                        "circle",
                        {
                            cx:
                                area.cx ||
                                600,

                            cy:
                                area.cy ||
                                area.y1 ||
                                600,

                            r: 16,

                            class:
                                "territory-cultivation"
                        }
                    );


                marker.dataset.cultivation =
                    cultivation.id;


                marker.addEventListener(
                    "click",
                    () => {

                        inspectCultivation(
                            cultivation
                        );

                    }
                );


                map.appendChild(
                    marker
                );

            }
        );

    }


    /*
    ==========================================
    INSPECTOR
    ==========================================
    */

    function inspectArea(area) {

        const inspector =
            document.querySelector(
                "#territory-inspector"
            );

        if (!inspector) {
            return;
        }


        inspector.innerHTML = `

            <div class="territory-inspector-label">
                AREA
            </div>

            <h2>
                ${area.label || area.id}
            </h2>

            <div class="territory-inspector-meta">
                ${area.id}
            </div>

        `;

    }


    function inspectCultivation(
        cultivation
    ) {

        const inspector =
            document.querySelector(
                "#territory-inspector"
            );

        if (!inspector) {
            return;
        }


        inspector.innerHTML = `

            <div class="territory-inspector-label">
                CULTIVATION
            </div>

            <h2>
                ${cultivation.accession}
            </h2>

            <div class="territory-inspector-meta">
                ${cultivation.start_date}
                →
                ${cultivation.end_date}
            </div>

        `;

    }


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


                        renderMap();

                    }
                );

            }
        );


    renderMap();

});