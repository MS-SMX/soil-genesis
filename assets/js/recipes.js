document.addEventListener("DOMContentLoaded", () => {

    const input = document.querySelector("#recipe-search");

    if (!input) return;

    const recipeIndex = window.SG_RECIPE_INDEX || [];

    let resultsContainer =
        document.querySelector("#recipe-search-results");

    if (!resultsContainer) {

        resultsContainer =
            document.createElement("div");

        resultsContainer.id =
            "recipe-search-results";

        input.parentElement.appendChild(
            resultsContainer
        );

    }


    function normalize(value) {

        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    function searchRecipes(query) {

        const normalizedQuery =
            normalize(query);

        if (!normalizedQuery) {

            resultsContainer.innerHTML = "";

            resultsContainer.classList.remove(
                "has-results"
            );

            return;

        }


        const results =
            recipeIndex.filter(recipe => {

                return recipe.ingredients.some(
                    ingredient => {

                        return ingredient
                            .searchable
                            .some(value =>
                                value.includes(
                                    normalizedQuery
                                )
                            );

                    }
                );

            });


        renderResults(results);

    }


    function renderResults(results) {

        resultsContainer.innerHTML = "";

        resultsContainer.classList.add(
            "has-results"
        );


        const heading =
            document.createElement("div");

        heading.className =
            "recipe-search-heading";

        heading.textContent =
            `${results.length} ${
                results.length === 1
                    ? "RICETTA TROVATA"
                    : "RICETTE TROVATE"
            }`;

        resultsContainer.appendChild(
            heading
        );


        if (!results.length) {

            const empty =
                document.createElement("div");

            empty.className =
                "recipe-search-empty";

            empty.textContent =
                "NESSUNA RICETTA CORRISPONDENTE";

            resultsContainer.appendChild(
                empty
            );

            return;

        }


        const list =
            document.createElement("div");

        list.className =
            "recipe-search-list";


        results.forEach(recipe => {

            const card =
                document.createElement("a");

            card.className =
                "recipe-search-result";

            card.href =
                recipe.url;


            const title =
                document.createElement("strong");

            title.textContent =
                recipe.title;


            const meta =
                document.createElement("span");

            meta.textContent =
                recipe.categories
                    .join(" · ");


            card.appendChild(title);
            card.appendChild(meta);

            list.appendChild(card);

        });


        resultsContainer.appendChild(
            list
        );

    }


    input.addEventListener(
        "input",
        () => {

            searchRecipes(
                input.value
            );

        }
    );

});