document.addEventListener("DOMContentLoaded", () => {

    const search =
        document.querySelector("#resource-search");

    const categoryButtons =
        document.querySelectorAll(
            ".resource-category"
        );

    const typeContainer =
        document.querySelector("#resource-types");

    const cards =
        document.querySelectorAll(
            ".resource-card"
        );

    const empty =
        document.querySelector("#resources-empty");


    if (!search || !cards.length) {
        return;
    }


    let activeCategory = "all";

    let activeType = "all";


    /*
     * ==========================================
     * BUILD TYPE FILTERS
     * ==========================================
     */

    const types = [
        ...new Set(

            [...cards]

                .map(card =>
                    card.dataset.type
                )

                .filter(Boolean)

        )
    ].sort();


    if (typeContainer) {

        types.forEach(type => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "resource-type-filter";

            button.dataset.type = type;

            button.textContent =
                type.replaceAll("-", " ");


            button.addEventListener(
                "click",
                () => {

                    document

                        .querySelectorAll(
                            ".resource-type-filter"
                        )

                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add("active");


                    activeType = type;

                    filterResources();

                }
            );


            typeContainer.appendChild(button);

        });

    }


    /*
     * ==========================================
     * FILTER
     * ==========================================
     */

    function filterResources() {

        const query =
            search.value
                .toLowerCase()
                .trim();


        let visible = 0;


        cards.forEach(card => {

            const category =
                card.dataset.category || "";


            const type =
                card.dataset.type || "";


            const text =
                card.dataset.search
                    .toLowerCase();


            const categoryMatch =

                activeCategory === "all" ||

                category === activeCategory;


            const typeMatch =

                activeType === "all" ||

                type === activeType;


            const searchMatch =

                !query ||

                text.includes(query);


            const show =

                categoryMatch &&

                typeMatch &&

                searchMatch;


            card.hidden = !show;


            if (show) {

                visible++;

            }

        });


        if (empty) {

            empty.hidden =
                visible !== 0;

        }


        updateCounters();

    }


    /*
     * ==========================================
     * CATEGORY BUTTONS
     * ==========================================
     */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons

                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                button.classList.add("active");


                activeCategory =
                    button.dataset.category;


                /*
                 * Reset type when changing
                 * category.
                 */

                activeType = "all";


                document

                    .querySelectorAll(
                        ".resource-type-filter"
                    )

                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                const allType =
                    document.querySelector(
                        '.resource-type-filter[data-type="all"]'
                    );


                if (allType) {

                    allType.classList.add("active");

                }


                filterResources();

            }
        );

    });


    /*
     * ==========================================
     * SEARCH
     * ==========================================
     */

    search.addEventListener(
        "input",
        filterResources
    );


    /*
     * ==========================================
     * COUNTERS
     * ==========================================
     */

    function updateCounters() {

        const total =
            cards.length;


        const core =
            [...cards]

                .filter(
                    card =>
                        card.dataset.relevance === "core"
                )

                .length;


        const active =
            [...cards]

                .filter(
                    card =>
                        card.dataset.status === "attivo"
                )

                .length;


        const totalElement =
            document.querySelector(
                "#resources-total"
            );


        const coreElement =
            document.querySelector(
                "#resources-core"
            );


        const activeElement =
            document.querySelector(
                "#resources-active"
            );


        if (totalElement) {

            totalElement.textContent =
                String(total).padStart(3, "0");

        }


        if (coreElement) {

            coreElement.textContent =
                String(core).padStart(3, "0");

        }


        if (activeElement) {

            activeElement.textContent =
                String(active).padStart(3, "0");

        }

    }


    /*
     * ==========================================
     * INITIAL STATE
     * ==========================================
     */

    filterResources();

});