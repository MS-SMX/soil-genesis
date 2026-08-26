window.SG = window.SG || {};

SG.filters = SG.filters || {};


/*
==================================================
UNIQUE VALUES
==================================================
*/

function unique(field){

    return [
        ...new Set(

            SG.archive

                .flatMap(seed =>
                    (seed[field] || "").split("|")
                )

                .filter(Boolean)

        )
    ].sort();

}


/*
==================================================
BUILD FILTERS
==================================================
*/

function buildFilters(){

    const root =
        document.querySelector(
            "#explorer-filters"
        );

    if(!root) return;


    root.innerHTML = "";


    /*
    ----------------------------------------------
    SPECIAL FILTER
    ----------------------------------------------
    */

    const special =
        document.createElement("div");

    special.className =
        "filter-special";


    const specialLabel =
        document.createElement("label");


    const specialInput =
        document.createElement("input");

    specialInput.type =
        "checkbox";

    specialInput.id =
        "show-new-without-photo";


    specialLabel.appendChild(
        specialInput
    );


    specialLabel.appendChild(
        document.createTextNode(
            " Visualizza New Entry senza foto"
        )
    );


    special.appendChild(
        specialLabel
    );


    root.appendChild(
        special
    );


    /*
    ----------------------------------------------
    NORMAL FILTERS
    ----------------------------------------------
    */

    const sections = [

        ["Conservazione","status"],
        ["Famiglia","family"],
        ["Ciclo di vita","cycle"],
        ["Impollinazione","pollination"]

    ];


    sections.forEach(
        ([title,key]) => {

            const group =
                document.createElement("div");

            group.className =
                "filter-group";


            const heading =
                document.createElement("h4");

            heading.textContent =
                title;


            group.appendChild(
                heading
            );


            unique(key).forEach(
                value => {

                    const label =
                        document.createElement(
                            "label"
                        );


                    const input =
                        document.createElement(
                            "input"
                        );


                    input.type =
                        "checkbox";

                    input.dataset.filter =
                        key;

                    input.value =
                        value;

                    input.id =
                        `${key}-${value}`;


                    label.appendChild(
                        input
                    );


                    label.appendChild(
                        document.createTextNode(
                            " " +
                            value.replaceAll(
                                "-",
                                " "
                            )
                        )
                    );


                    group.appendChild(
                        label
                    );

                }
            );


            root.appendChild(
                group
            );

        }
    );

}


/*
==================================================
INIT
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        buildFilters();

        SG.kernel.register(
            "sidebar",
            {
                build: buildFilters
            }
        );

    }
);