const boot = document.getElementById("boot-engine");
const terminal = document.getElementById("boot-terminal");
const authorize = document.getElementById("boot-authorize");
const mycelium = document.getElementById("boot-mycelium");
const myceliumSvg = document.getElementById("mycelium-svg");

if (boot && sessionStorage.getItem("bios_seen")) {

    boot.remove();

} else if (boot) {

    async function sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }


    /*
    ==========================================
    MYCELIAL NETWORK
    ==========================================
    */

    function createMycelium() {

        if (!myceliumSvg) return;

        myceliumSvg.innerHTML = "";

        const NS = "http://www.w3.org/2000/svg";

        const group = document.createElementNS(NS, "g");

        group.setAttribute(
            "class",
            "mycelium-network"
        );

        const origins = [
            [350, 310],
            [430, 280],
            [500, 330],
            [570, 285],
            [640, 315]
        ];


        function branch(
            x1,
            y1,
            angle,
            length,
            depth,
            width
        ) {

            if (depth <= 0 || length < 18) return;


            const curve =
                (Math.random() - 0.5) * 70;

            const x2 =
                x1 +
                Math.cos(angle) * length;

            const y2 =
                y1 +
                Math.sin(angle) * length;


            const cx1 =
                x1 +
                Math.cos(angle - 0.35) *
                length * .45;

            const cy1 =
                y1 +
                Math.sin(angle - 0.35) *
                length * .45;

            const cx2 =
                x1 +
                Math.cos(angle + 0.25) *
                length * .78 +
                curve;

            const cy2 =
                y1 +
                Math.sin(angle + 0.25) *
                length * .78;


            const path =
                document.createElementNS(
                    NS,
                    "path"
                );


            path.setAttribute(
                "d",
                `M ${x1} ${y1}
                 C ${cx1} ${cy1},
                   ${cx2} ${cy2},
                   ${x2} ${y2}`
            );


            path.setAttribute(
                "class",
                "mycelium-branch"
            );


            path.style.strokeWidth =
                width.toFixed(2);


            path.style.opacity =
                (
                    .25 +
                    Math.random() * .45
                ).toFixed(2);


            group.appendChild(path);


            const nextLength =
                length *
                (.62 + Math.random() * .16);


            const spread =
                .35 +
                Math.random() * .35;


            branch(
                x2,
                y2,
                angle - spread,
                nextLength,
                depth - 1,
                width * .78
            );


            branch(
                x2,
                y2,
                angle + spread,
                nextLength,
                depth - 1,
                width * .78
            );


            if (Math.random() > .45) {

                branch(
                    x2,
                    y2,
                    angle +
                    (Math.random() - .5) * .5,
                    nextLength * .72,
                    depth - 1,
                    width * .7
                );

            }

        }


        origins.forEach(
            ([x, y], index) => {

                const count =
                    5 +
                    Math.floor(
                        Math.random() * 3
                    );


                for (
                    let i = 0;
                    i < count;
                    i++
                ) {

                    const angle =
                        (
                            i /
                            count
                        ) *
                        Math.PI *
                        2 +
                        (
                            Math.random() -
                            .5
                        ) *
                        .8;


                    branch(
                        x,
                        y,
                        angle,
                        90 +
                        Math.random() * 45,
                        4,
                        1.25
                    );

                }

            }
        );


        myceliumSvg.appendChild(group);

    }


    createMycelium();


    /*
    ==========================================
    TERMINAL
    ==========================================
    */

    async function line(
        text,
        speed = 17
    ) {

        const row =
            document.createElement("div");

        row.className =
            "terminal-line";

        terminal.appendChild(row);


        for (const ch of text) {

            row.textContent += ch;

            await sleep(
                speed +
                Math.random() * 10
            );

        }

    }


    /*
    ==========================================
    MYCELIUM FLASH
    ==========================================
    */

    async function flashMycelium() {

        if (!mycelium) return;


        mycelium.classList.remove(
            "visible"
        );

        void mycelium.offsetWidth;


        mycelium.classList.add(
            "visible"
        );


        await sleep(620);


        mycelium.classList.remove(
            "visible"
        );


        await sleep(80);

    }


    /*
    ==========================================
    ACCESSION COUNT
    ==========================================
    */

    const accessions =
        boot.dataset.accessions ||
        "0";


    /*
    ==========================================
    BOOT SEQUENCE
    ==========================================
    */

    (async () => {

        await sleep(350);


        await line(
            "SOIL GENESIS BIOS"
        );


        await sleep(180);


        await line(
            "BIOLOGICAL OPERATING SYSTEM"
        );


        await sleep(300);


        await line(
            "RECOVERY PROTOCOL........ ACTIVE"
        );


        await sleep(220);


        await line(
            "INITIALIZING CORE........ OK"
        );


        await sleep(180);


        await line(
            "CHECKING MEMORY.......... 16384 MB"
        );


        await sleep(180);


        await line(
            `CHECKING GENETIC VAULT... ${accessions} ACCESSIONS FOUND`
        );


        await sleep(240);


        await line(
            "CONNECTING MYCORRHIZAL NETWORK..."
        );


        await sleep(120);


        /*
        The network appears very briefly.
        */

        await flashMycelium();


        await sleep(120);


        await line(
            "VERIFYING SEED INTEGRITY..."
        );


        await sleep(160);


        const progress =
            document.createElement("div");

        progress.className =
            "integrity-progress";

        progress.textContent =
            "████████████████████ 100%";

        terminal.appendChild(
            progress
        );


        await sleep(260);


        await line(
            "NO PROPRIETARY GENOMES DETECTED"
        );


        await sleep(450);


        terminal.style.opacity =
            ".15";


        await sleep(120);


        authorize.classList.add(
            "visible"
        );


        await sleep(1100);


        sessionStorage.setItem(
            "bios_seen",
            "true"
        );


        authorize.classList.remove(
            "visible"
        );


        boot.classList.add(
            "hide"
        );


        await sleep(800);


        boot.remove();

    })();

}