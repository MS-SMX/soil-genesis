(function () {

    "use strict";


    const STORAGE_KEY =
        "soil-genesis-ortofrutta-admin";


    const app =
        document.getElementById(
            "produce-admin-app"
        );


    const message =
        document.getElementById(
            "produce-admin-message"
        );


    const database =
        Array.isArray(
            window.SOIL_PRODUCE_DATABASE
        )
            ? window.SOIL_PRODUCE_DATABASE
            : [];


    const sources =
        window.SOIL_PRODUCE_SOURCES || {};


    const sourceLabels = {

        seeds: "SEMENTI",

        perennial: "PERENNI",

        spontaneous: "SPONTANEE"

    };


    function clone(data) {

        return JSON.parse(
            JSON.stringify(data)
        );

    }


    function getStoredData() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (stored) {

                return JSON.parse(
                    stored
                );

            }

        } catch (error) {

            console.error(
                "Unable to read admin data:",
                error
            );

        }


        return clone(database);

    }


    let products =
        getStoredData();


    function save() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(products)
            );

        } catch (error) {

            console.error(
                "Unable to save admin data:",
                error
            );

        }

    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function getSourceName(
        archive,
        slug
    ) {

        const list =
            sources[archive] || [];


        const source =
            list.find(
                item =>
                    item.slug === slug
            );


        return source
            ? source.nome
            : slug;

    }


    function sourceExists(
        archive,
        slug
    ) {

        const list =
            sources[archive] || [];


        return list.some(
            item =>
                item.slug === slug
        );

    }


    function getProductSourceKey(
        product
    ) {

        if (
            !product.source ||
            !product.source.archivio ||
            !product.source.slug
        ) {

            return null;

        }


        return (
            product.source.archivio
            + "::"
            + product.source.slug
        );

    }


    function render() {

        const groups = {};


        products.forEach(
            (product, index) => {

                const key =
                    getProductSourceKey(
                        product
                    )
                    || "unassigned::"
                    + index;


                if (!groups[key]) {

                    groups[key] = {

                        archive:
                            product.source
                                ?.archivio
                            || "",

                        slug:
                            product.source
                                ?.slug
                            || "",

                        products: []

                    };

                }


                groups[key]
                    .products
                    .push({
                        product,
                        index
                    });

            }
        );


        let html = "";


        Object.values(groups)
            .forEach(group => {

                const sourceName =
                    getSourceName(
                        group.archive,
                        group.slug
                    );


                html += `

                    <section
                        class="produce-admin-group">

                        <div
                            class="produce-admin-group-header">

                            <div>

                                <div
                                    class="produce-admin-source-type">

                                    ${escapeHtml(
                                        sourceLabels[
                                            group.archive
                                        ]
                                        || "ARCHIVIO"
                                    )}

                                </div>

                                <h2>
                                    ${escapeHtml(
                                        sourceName
                                    )}
                                </h2>

                            </div>

                        </div>


                        <div
                            class="produce-admin-products">

                `;


                group.products
                    .forEach(item => {

                        html += renderProduct(
                            item.product,
                            item.index
                        );

                    });


                html += `

                        </div>

                    </section>

                `;

            });


        html += `

            <section
                class="produce-admin-new">

                <button
                    type="button"
                    data-action="new-product">

                    + NUOVO PRODOTTO

                </button>

            </section>

        `;


        app.innerHTML = html;


        bindEvents();

    }

function renderSourceOptions(current) {

    const options = [

        {
            value: "seeds",
            label: "SEMENTI"
        },

        {
            value: "perennial",
            label: "PERENNI"
        },

        {
            value: "spontaneous",
            label: "SPONTANEE"
        }

    ];


    return options.map(
        option => `

            <option
                value="${option.value}"
                ${option.value === current
                    ? "selected"
                    : ""}>

                ${option.label}

            </option>

        `
    ).join("");

}


function renderSourceSlugOptions(
    archive,
    current
) {

    const list =
        sources[archive] || [];


    if (!list.length) {

        return `

            <option value="${escapeHtml(current)}">
                ${escapeHtml(current)}
            </option>

        `;

    }


    return list.map(
        item => `

            <option
                value="${escapeHtml(item.slug)}"
                ${item.slug === current
                    ? "selected"
                    : ""}>

                ${escapeHtml(item.slug)}

            </option>

        `
    ).join("");

}

    function renderProduct(
        product,
        index
    ) {

        const sourceArchive =
            product.source?.archivio
            || "";


        const sourceSlug =
            product.source?.slug
            || "";

            const sourceOptions =
    renderSourceOptions(sourceArchive);

const sourceSlugOptions =
    renderSourceSlugOptions(
        sourceArchive,
        sourceSlug
    );

        const image =
            product.immagine
            || "";


        const price =
            product.prezzo?.valore
            ?? "";


        const unit =
            product.prezzo?.unita
            || "kg";


        return `

        <article
            class="produce-admin-product"
            data-index="${index}">


            <div
                class="produce-admin-product-top">


                <label
                    class="produce-admin-switch">

                    <input
                        type="checkbox"
                        data-field="disponibile"
                        ${product.disponibile
                            ? "checked"
                            : ""}>

                    <span></span>

                    DISPONIBILE

                </label>


                <button
                    type="button"
                    class="produce-admin-delete"
                    data-action="delete">

                    ELIMINA

                </button>


            </div>


            <div
                class="produce-admin-fields">


                <div
                    class="produce-admin-field">

                    <label>
                        NOME
                    </label>

                    <input
                        type="text"
                        data-field="nome"
                        value="${escapeHtml(
                            product.nome
                        )}">

                </div>


                <div
                    class="produce-admin-field">

                    <label>
                        CATEGORIA
                    </label>

                    <input
                        type="text"
                        data-field="categoria"
                        value="${escapeHtml(
                            product.categoria
                        )}">

                </div>


                <div
                    class="produce-admin-field">

                    <label>
                        PREZZO
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        data-field="price"
                        value="${escapeHtml(
                            price
                        )}">

                </div>


                <div
                    class="produce-admin-field">

                    <label>
                        UNITÀ
                    </label>

                    <select
                        data-field="unit">

                        ${renderUnit(
                            "kg",
                            unit
                        )}

                        ${renderUnit(
                            "etto",
                            unit
                        )}

                        ${renderUnit(
                            "pezzo",
                            unit
                        )}

                        ${renderUnit(
                            "mazzo",
                            unit
                        )}

                        ${renderUnit(
                            "vaschetta",
                            unit
                        )}

                    </select>

                </div>


                <div
                    class="produce-admin-field">

                    <label>
                        FOTO
                    </label>

                    <input
                        type="text"
                        data-field="immagine"
                        placeholder="es. zucchine-evo.jpg"
                        value="${escapeHtml(
                            image
                        )}">

                </div>


            </div>


           <div
    class="produce-admin-source-fields">


    <div
        class="produce-admin-field">

        <label>
            ARCHIVIO ORIGINE
        </label>

        <select
            data-field="sourceArchive">

            ${sourceOptions}

        </select>

    </div>


    <div
        class="produce-admin-field">

        <label>
            SLUG SCHEDA ARCHIVIO
        </label>

        <select
            data-field="sourceSlug">

            ${sourceSlugOptions}

        </select>

    </div>


    <div
        class="produce-admin-source-status">

        ${
            sourceExists(
                sourceArchive,
                sourceSlug
            )

            ? `

                <span>
                    SOURCE OK
                </span>

            `

            : `

                <span
                    class="produce-admin-warning">

                    SOURCE NON TROVATA

                </span>

            `
        }

    </div>

</div>


        </article>

        `;

    }


    function renderUnit(
        value,
        current
    ) {

        return `

            <option
                value="${value}"
                ${value === current
                    ? "selected"
                    : ""}>

                ${value}

            </option>

        `;

    }


    function updateProduct(
        index,
        field,
        value
    ) {

        const product =
            products[index];


        if (!product) return;


        if (field === "disponibile") {

            product.disponibile =
                Boolean(value);

        }


        else if (field === "nome") {

            product.nome = value;

        }


        else if (field === "categoria") {

            product.categoria = value;

        }


        else if (field === "immagine") {

            product.immagine = value;

        }


        else if (field === "price") {

            if (!product.prezzo) {

                product.prezzo = {};

            }


            product.prezzo.valore =
                Number(value);

        }


        else if (field === "unit") {

            if (!product.prezzo) {

                product.prezzo = {};

            }


            product.prezzo.unita =
                value;

        }

        else if (field === "sourceArchive") {

    if (!product.source) {

        product.source = {};

    }


    product.source.archivio =
        value;


    /*
     * Quando cambio archivio,
     * provo a mantenere lo slug solo
     * se esiste ancora nel nuovo archivio.
     */

    if (
        !sourceExists(
            value,
            product.source.slug
        )
    ) {

        const firstSource =
            (
                sources[value]
                || []
            )[0];


        product.source.slug =
            firstSource
                ? firstSource.slug
                : "";

    }

}

else if (field === "sourceSlug") {

    if (!product.source) {

        product.source = {};

    }


    product.source.slug =
        value;

}

        save();

    }


    function deleteProduct(index) {

        if (
            !confirm(
                "Eliminare questo prodotto?"
            )
        ) {

            return;

        }


        products.splice(
            index,
            1
        );


        save();

        render();

    }


    function createProduct() {

        products.push({

            id:
                "nuovo-prodotto-"
                + Date.now(),

            nome:
                "Nuovo prodotto",

            categoria:
                "ortaggio",

source: {

    archivio:
        "seeds",

    slug:
        (
            sources.seeds
            && sources.seeds.length
        )
            ? sources.seeds[0].slug
            : ""

},

            immagine:
                "",

            disponibile:
                false,

            prezzo: {

                valore:
                    0,

                unita:
                    "kg"

            }

        });


        save();

        render();

    }


    function bindEvents() {

        app.querySelectorAll(
            ".produce-admin-product"
        ).forEach(
            card => {

                const index =
                    Number(
                        card.dataset.index
                    );


                card.querySelectorAll(
                    "[data-field]"
                ).forEach(
                    input => {

                        input.addEventListener(
                            "change",
                            function () {

                                let value =
                                    this.value;


                                if (
                                    this.type ===
                                    "checkbox"
                                ) {

                                    value =
                                        this.checked;

                                }


                                updateProduct(
                                    index,
                                    this.dataset.field,
                                    value
                                );

                            }
                        );

                    }
                );


                const deleteButton =
                    card.querySelector(
                        "[data-action='delete']"
                    );


                if(deleteButton){

                    deleteButton.addEventListener(
                        "click",
                        function(){

                            deleteProduct(
                                index
                            );

                        }
                    );

                }

            }
        );


        const newButton =
            app.querySelector(
                "[data-action='new-product']"
            );


        if(newButton){

            newButton.addEventListener(
                "click",
                createProduct
            );

        }

    }


    function yamlString(value) {

        return String(value ?? "")
            .replace(
                /\\/g,
                "\\\\"
            )
            .replace(
                /"/g,
                '\\"'
            );

    }


    function generateYaml() {

        let yaml =
            "prodotti:\n\n";


        products.forEach(
            product => {

                yaml +=
                    "  - id: "
                    + yamlString(
                        product.id
                    )
                    + "\n";


                yaml +=
                    "    nome: \""
                    + yamlString(
                        product.nome
                    )
                    + "\"\n";


                yaml +=
                    "    categoria: "
                    + yamlString(
                        product.categoria
                    )
                    + "\n\n";


                yaml +=
                    "    source:\n";


                yaml +=
                    "      archivio: "
                    + yamlString(
                        product.source
                            ?.archivio
                        || ""
                    )
                    + "\n";


                yaml +=
                    "      slug: "
                    + yamlString(
                        product.source
                            ?.slug
                        || ""
                    )
                    + "\n\n";


                yaml +=
                    "    immagine: "
                    + (
                        product.immagine
                            ? '"'
                                + yamlString(
                                    product.immagine
                                )
                                + '"'
                            : '""'
                    )
                    + "\n\n";


                yaml +=
                    "    disponibile: "
                    + (
                        product.disponibile
                            ? "true"
                            : "false"
                    )
                    + "\n\n";


                yaml +=
                    "    prezzo:\n";


                yaml +=
                    "      valore: "
                    + Number(
                        product.prezzo
                            ?.valore
                        || 0
                    ).toFixed(2)
                    + "\n";


                yaml +=
                    "      unita: "
                    + yamlString(
                        product.prezzo
                            ?.unita
                        || "kg"
                    )
                    + "\n\n";

            }
        );


        return yaml;

    }


    function downloadYaml() {

        const yaml =
            generateYaml();


        const blob =
            new Blob(
                [yaml],
                {
                    type:
                        "text/yaml;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "ortofrutta.yml";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        URL.revokeObjectURL(
            url
        );


        showMessage(
            "ORTOFRUTTA.YML GENERATO."
        );

    }


    function showMessage(
        text
    ) {

        message.textContent =
            text;


        message.hidden =
            false;


        setTimeout(
            function(){

                message.hidden =
                    true;

            },
            2500
        );

    }


    document
        .getElementById(
            "generate-produce-yaml"
        )
        .addEventListener(
            "click",
            downloadYaml
        );


    document
        .getElementById(
            "reset-produce-admin"
        )
        .addEventListener(
            "click",
            function(){

                if(
                    !confirm(
                        "Ripristinare i dati presenti nel repository?"
                    )
                ){

                    return;

                }


                localStorage.removeItem(
                    STORAGE_KEY
                );


                products =
                    clone(database);


                render();


                showMessage(
                    "DATI RIPRISTINATI."
                );

            }
        );


    render();

})();