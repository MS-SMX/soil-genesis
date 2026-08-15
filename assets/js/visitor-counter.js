document.addEventListener("DOMContentLoaded", () => {

    const todayElement =
        document.querySelector("#visitors-today");

    const totalElement =
        document.querySelector("#visitors-total");


    if (!todayElement || !totalElement) {
        return;
    }


    function todayUTC() {

        const now = new Date();

        return now
            .toISOString()
            .slice(0, 10);

    }


    function waitForGoatCounter(callback) {

        const timer =
            setInterval(() => {

                if (
                    window.goatcounter &&
                    typeof window.goatcounter.visit_count ===
                        "function"
                ) {

                    clearInterval(timer);

                    callback();

                }

            }, 100);

    }


    waitForGoatCounter(() => {

        const today =
            todayUTC();


        /*
         * Visite uniche di oggi
         */

        window.goatcounter.visit_count({

            append: "#visitors-today",

            path: "TOTAL",

            start: today,

            end: today,

            no_branding: true,

            attr: {

                "aria-label":
                    "Visitatori unici di oggi"

            }

        });


        /*
         * Visite uniche complessive
         */

        window.goatcounter.visit_count({

            append: "#visitors-total",

            path: "TOTAL",

            no_branding: true,

            attr: {

                "aria-label":
                    "Visitatori unici totali"

            }

        });

    });

});