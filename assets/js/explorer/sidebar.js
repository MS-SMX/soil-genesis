window.SG = window.SG || {};

SG.filters = SG.filters || {};

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


function buildFilters(){

    const root =
        document.querySelector("#explorer-filters");

    if(!root) return;

    root.innerHTML = "";

    const sections = [

        ["Conservazione","status"],
        ["Famiglia","family"],
        ["Ciclo di vita","cycle"],
        ["Impollinazione","pollination"]

    ];


    sections.forEach(([title,key]) => {

        const group =
            document.createElement("div");

        group.className = "filter-group";


        const heading =
            document.createElement("h4");

        heading.textContent = title;

        group.appendChild(heading);


        unique(key).forEach(value => {

            const label =
                document.createElement("label");

            const input =
                document.createElement("input");

            input.type = "checkbox";

            input.dataset.filter = key;

            input.value = value;

            input.id = `${key}-${value}`;


            label.appendChild(input);

            label.appendChild(
                document.createTextNode(
                    " " + value.replaceAll("-"," ")
                )
            );


            group.appendChild(label);

        });


        root.appendChild(group);

    });

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        buildFilters();

        SG.kernel.register("sidebar",{
            build:buildFilters
        });

    }
);