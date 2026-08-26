window.SG = window.SG || {};


/*
==================================================
APPLY FILTERS
==================================================
*/

function applyFilters(){

    const active = {};


    const showNewWithoutPhoto =
        document.querySelector(
            "#show-new-without-photo"
        )?.checked || false;


    /*
    ----------------------------------------------
    ACTIVE CHECKBOX FILTERS
    ----------------------------------------------
    */

    document
        .querySelectorAll(
            "#explorer-filters input[data-filter]:checked"
        )
        .forEach(box => {

            const key =
                box.dataset.filter;


            active[key] =
                active[key] || [];


            active[key].push(
                box.value
            );

        });


    /*
    ----------------------------------------------
    APPLY TO ARCHIVE
    ----------------------------------------------
    */

    SG.archive.forEach(
        seed => {

            let visible = true;


            /*
            ======================================
            PHOTO VISIBILITY
            ======================================
            */

            if(!seed.hasImage){

                const isNewEntry =
                    seed.status === "new-entry";


                /*
                 * No image:
                 *
                 * stable / critical / etc.
                 * → ALWAYS HIDDEN
                 *
                 * new-entry
                 * → HIDDEN BY DEFAULT
                 * → VISIBLE when checkbox is active
                 */

                if(
                    !isNewEntry ||
                    !showNewWithoutPhoto
                ){

                    visible = false;

                }

            }


            /*
            ======================================
            SEARCH
            ======================================
            */

            if(
                SG.search &&
                !seed.text.includes(
                    SG.search
                )
            ){

                visible = false;

            }


            /*
            ======================================
            NORMAL FILTERS
            ======================================
            */

            Object.entries(active)
                .forEach(
                    ([key,list]) => {

                        const values =
                            (seed[key] || "")
                                .split("|");


                        const match =
                            values.some(
                                value =>
                                    list.includes(
                                        value
                                    )
                            );


                        if(!match){

                            visible = false;

                        }

                    }
                );


            /*
            ======================================
            DISPLAY
            ======================================
            */

            seed.element.style.display =
                visible
                    ? ""
                    : "none";

        }
    );


    /*
    ----------------------------------------------
    ACTIVE FILTER BADGES
    ----------------------------------------------
    */

    const panel =
        document.querySelector(
            "#active-filters"
        );


    if(panel){

        panel.innerHTML = "";


        Object.entries(active)
            .forEach(
                ([key,list]) => {

                    list.forEach(
                        value => {

                            const badge =
                                document.createElement(
                                    "div"
                                );


                            badge.className =
                                "active-filter";


                            badge.innerHTML = `
                                ${value.replaceAll(
                                    "-",
                                    " "
                                )}
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

                                        checkbox.checked =
                                            false;


                                        applyFilters();

                                    }

                                }
                            );


                            panel.appendChild(
                                badge
                            );

                        }
                    );

                }
            );

    }


    /*
    ----------------------------------------------
    COUNTER
    ----------------------------------------------
    */

    const counter =
        document.querySelector(
            "#explorer-count"
        );


    if(counter){

        counter.textContent =

            SG.archive.filter(
                seed =>
                    seed.element.style.display !==
                    "none"
            ).length;

    }

}


/*
==================================================
CHECKBOX CHANGES
==================================================
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
==================================================
SEARCH / OTHER MODULES
==================================================
*/

document.addEventListener(
    "sg:update",
    () => {

        applyFilters();

    }
);


/*
==================================================
INITIAL APPLICATION
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * archive.js has already built SG.archive
         * by this point, so the initial visibility
         * can be applied immediately.
         */

        applyFilters();


        SG.kernel.register(
            "filters",
            {
                update: applyFilters
            }
        );

    }
);