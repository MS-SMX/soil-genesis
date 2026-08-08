window.SG = window.SG || {};


function applyFilters(){

    const active = {};


    document
        .querySelectorAll(
            "#explorer-filters input:checked"
        )
        .forEach(box => {

            const key =
                box.dataset.filter;

            active[key] =
                active[key] || [];

            active[key].push(box.value);

        });


    SG.archive.forEach(seed => {

        let visible = true;


        /*
         * SEARCH
         */

        if(
            SG.search &&
            !seed.text.includes(SG.search)
        ){

            visible = false;

        }


        /*
         * FILTERS
         */

        Object.entries(active).forEach(
            ([key,list]) => {

                const values =
                    (seed[key] || "").split("|");

                const match =
                    values.some(
                        value => list.includes(value)
                    );

                if(!match){

                    visible = false;

                }

            }
        );


        seed.element.style.display =
            visible ? "" : "none";

    });


    /*
     * ACTIVE FILTERS
     */

    const panel =
        document.querySelector("#active-filters");


    if(panel){

        panel.innerHTML = "";


        Object.entries(active).forEach(
            ([key,list]) => {

                list.forEach(value => {

                    const badge =
                        document.createElement("div");

                    badge.className =
                        "active-filter";


                    badge.innerHTML = `

                        ${value.replaceAll("-"," ")}

                        <span>×</span>

                    `;


                    badge.addEventListener(
                        "click",
                        () => {

                            const checkbox =
                                document.querySelector(
                                    `input[data-filter="${key}"][value="${value}"]`
                                );


                            if(checkbox){

                                checkbox.checked = false;

                                applyFilters();

                            }

                        }
                    );


                    panel.appendChild(badge);

                });

            }
        );

    }


    /*
     * COUNTER
     */

    const counter =
        document.querySelector(
            "#explorer-count"
        );


    if(counter){

        counter.textContent =

            SG.archive.filter(seed =>

                seed.element.style.display !== "none"

            ).length;

    }

}


/*
 * CHECKBOX
 */

document.addEventListener(
    "change",
    event => {

        if(
            event.target.matches(
                "#explorer-filters input"
            )
        ){

            applyFilters();

        }

    }
);


/*
 * SEARCH / OTHER MODULES
 *
 * Search.js modifica SG.search e
 * genera sg:update.
 */

document.addEventListener(
    "sg:update",
    () => {

        applyFilters();

    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        SG.kernel.register("filters",{
            update:applyFilters
        });

    }
);