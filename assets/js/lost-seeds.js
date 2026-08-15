document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.querySelector("#lost-search");

    const cards =
        document.querySelectorAll(
            ".lost-seed-card"
        );

    const empty =
        document.querySelector("#lost-empty");


    if (!input || !cards.length) {
        return;
    }


    function normalize(value){

        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }


    function filter(){

        const query =
            normalize(input.value);

        let visible = 0;


        cards.forEach(card => {

            const text =
                normalize(
                    card.dataset.search
                );


            const match =
                !query ||
                text.includes(query);


            card.hidden = !match;


            if(match){

                visible++;

            }

        });


        if(empty){

            empty.hidden =
                visible !== 0;

        }

    }


    input.addEventListener(
        "input",
        filter
    );


    filter();

});