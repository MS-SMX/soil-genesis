console.log("Transition engine loaded");
document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll("a");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return;
        }

        link.addEventListener("click", e => {

            if (e.ctrlKey || e.metaKey || e.shiftKey) return;

            e.preventDefault();
            console.log("Transition click:", href);

            const loadingMessages = [
                "SYNCING MYCORRHIZAL NETWORK",
                "MOUNTING SEED ARCHIVE",
                "VERIFYING BOTANICAL MEMORY",
                "RECOVERING GENETIC INDEX",
                "LOADING ACCESSION DATABASE",
                "SYNCHRONIZING NODE"
            ];

            const message =
                loadingMessages[
                    Math.floor(Math.random() * loadingMessages.length)
                ];

            document.body.classList.add("module-switch");

            setTimeout(() => {
                document.body.classList.remove("module-switch");
            }, 120);

            const layer = document.createElement("div");
            layer.id = "transition-layer";

            layer.innerHTML = `
                <div class="transition-box">

                    <div class="transition-title">
                        LOADING MODULE
                        <span class="transition-cursor">█</span>
                    </div>

                    <div
                        id="transition-text"
                        class="transition-status">
                        ${message}
                    </div>

                    <div class="transition-bar">
                        <div class="transition-progress"></div>
                    </div>

                </div>
            `;

            document.body.appendChild(layer);
console.log(layer);
            const progress =
                layer.querySelector(".transition-progress");

            requestAnimationFrame(() => {

                layer.classList.add("active");

                requestAnimationFrame(() => {
                    progress.style.width = "100%";
                });

            });

            if (window.SG && typeof SG.networkPulse === "function") {
                SG.networkPulse();
            }

            setTimeout(() => {
                window.location.href = href;
            }, 420);

        });

    });

});