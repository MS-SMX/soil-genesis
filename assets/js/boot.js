const bootScreen = document.getElementById("boot-screen");
const bootOutput = document.getElementById("boot-output");

if (!sessionStorage.getItem("bios_seen")) {

    const lines = [

        "SOIL GENESIS BIOS",
        "",
        "BIOLOGICAL OPERATING SYSTEM",
        "",
        "INITIALIZING CORE.............OK",
        "CHECKING MEMORY...............OK",
        "LOADING GENETIC DATABASE......OK",
        "CONNECTING MYCORRHIZAL NETWORK",
        "",
        "VERIFYING SEED INTEGRITY",
        "",
        "[████████████████████] 100%",
        "",
        "NO PROPRIETARY GENOMES DETECTED",
        "",
        "ACCESS GRANTED"

    ];

    let line = 0;

    function printLine() {

        if (line >= lines.length) {

            sessionStorage.setItem("bios_seen", true);

            setTimeout(() => {

                bootScreen.classList.add("boot-hide");

            }, 700);

            return;

        }

        bootOutput.innerHTML += lines[line] + "<br>";

        bootOutput.scrollTop = bootOutput.scrollHeight;

        line++;

        setTimeout(printLine, 230);

    }

    setTimeout(printLine, 500);

} else {

    bootScreen.remove();

}