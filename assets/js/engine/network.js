(function () {
    "use strict";

    const canvas = document.getElementById("network");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // The branching structure is still fully organic, but it is rasterized once
    // per resize instead of recalculated and stroked on every animation frame.
    const branchLayer = document.createElement("canvas");
    const branchCtx = branchLayer.getContext("2d", { alpha: true });
    if (!branchCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let branches = [];
    let roots = [];
    let signalBranches = [];
    let lastFrame = 0;
    let resizeFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const mobile = () => window.innerWidth < 700;
    const rand = (min, max) => min + Math.random() * (max - min);

    function addBranch(x1, y1, angle, length, depth, thickness, family) {
        if (depth <= 0 || length < 10) return;

        const bend = rand(-0.34, 0.34);
        const a2 = angle + bend;
        const x2 = x1 + Math.cos(a2) * length;
        const y2 = y1 + Math.sin(a2) * length;
        const curve = rand(-0.24, 0.24) * length;
        const nx = -Math.sin(a2);
        const ny = Math.cos(a2);
        const cx = x1 + Math.cos(angle) * length * 0.52 + nx * curve;
        const cy = y1 + Math.sin(angle) * length * 0.52 + ny * curve;

        branches.push({
            x1, y1, cx, cy, x2, y2,
            width: thickness,
            alpha: rand(0.085, 0.19) * (depth > 2 ? 1 : 0.86),
            phase: rand(0, Math.PI * 2),
            flow: rand(0, 1),
            flowSpeed: rand(0.000035, 0.000075),
            family
        });

        if (depth === 1) roots.push({ x: x2, y: y2, family });

        const nextLength = length * rand(0.62, 0.78);
        const spread = rand(0.32, 0.66);

        addBranch(x2, y2, a2 - spread, nextLength, depth - 1, thickness * 0.72, family);
        addBranch(x2, y2, a2 + spread, nextLength, depth - 1, thickness * 0.72, family);

        if (depth > 2 && Math.random() > 0.48) {
            addBranch(x2, y2, a2 + rand(-0.25, 0.25), nextLength * 0.78, depth - 2, thickness * 0.64, family);
        }
    }

    function paintBranchLayer() {
        branchLayer.width = Math.round(width * dpr);
        branchLayer.height = Math.round(height * dpr);
        branchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        branchCtx.clearRect(0, 0, width, height);
        branchCtx.lineCap = "round";
        branchCtx.lineJoin = "round";

        // Keep the original curves, irregular branching and soft glow. The
        // glow is now paid once per resize, not once for every frame.
        branchCtx.shadowBlur = 2.5;
        branchCtx.shadowColor = "rgba(121, 215, 199, 0.24)";
        for (const branch of branches) {
            branchCtx.beginPath();
            branchCtx.moveTo(branch.x1, branch.y1);
            branchCtx.quadraticCurveTo(branch.cx, branch.cy, branch.x2, branch.y2);
            branchCtx.lineWidth = branch.width;
            branchCtx.strokeStyle = `rgba(121, 215, 199, ${branch.alpha + 0.035})`;
            branchCtx.stroke();
        }
        branchCtx.shadowBlur = 0;
    }

    function buildMycelium() {
        branches = [];
        roots = [];
        const isMobile = mobile();
        const count = isMobile ? 5 : 8;
        const marginX = width * 0.07;
        const marginY = height * 0.09;

        for (let i = 0; i < count; i++) {
            const fraction = count === 1 ? 0.5 : i / (count - 1);
            const x = marginX + (width - marginX * 2) * fraction + rand(-width * 0.035, width * 0.035);
            const y = rand(marginY, height - marginY);
            const family = i;
            const shoots = isMobile ? 3 : 4;

            for (let j = 0; j < shoots; j++) {
                addBranch(
                    x, y, rand(0, Math.PI * 2),
                    rand(Math.min(width, height) * 0.12, Math.min(width, height) * 0.23),
                    isMobile ? 3 : 4,
                    rand(0.7, 1.15),
                    family
                );
            }
        }

        // Moving signals are decorative rather than structural: keep roughly
        // one third of the original signals while preserving the whole network.
        signalBranches = branches.filter((_, index) => index % 3 === 0);
        paintBranchLayer();
    }

    function resize() {
        resizeFrame = 0;
        // A slightly lower pixel ratio reduces fill and compositing cost on
        // high-density displays without changing the network's geometry.
        dpr = Math.min(window.devicePixelRatio || 1, 1.35);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildMycelium();
    }

    function scheduleResize() {
        if (!resizeFrame) resizeFrame = window.requestAnimationFrame(resize);
    }

    function pointOnBranch(branch, t) {
        const u = 1 - t;
        return {
            x: u * u * branch.x1 + 2 * u * t * branch.cx + t * t * branch.x2,
            y: u * u * branch.y1 + 2 * u * t * branch.cy + t * t * branch.y2
        };
    }

    function draw(time) {
        requestAnimationFrame(draw);
        if (document.hidden || time - lastFrame < FRAME_INTERVAL) return;
        lastFrame = time;

        ctx.clearRect(0, 0, width, height);

        // A gentle global breath keeps the hyphae alive without recalculating
        // each branch's pulse and reapplying a blur on every frame.
        ctx.globalAlpha = 0.92 + Math.sin(time * 0.0007) * 0.08;
        ctx.drawImage(branchLayer, 0, 0, width, height);
        ctx.globalAlpha = 1;

        // Batch all travelling signals into one glow pass. Their positions
        // still follow the original curved hyphae, but there are fewer of them.
        ctx.beginPath();
        for (const branch of signalBranches) {
            const progress = (branch.flow + time * branch.flowSpeed) % 1;
            const point = pointOnBranch(branch, progress);
            ctx.moveTo(point.x + 1.35, point.y);
            ctx.arc(point.x, point.y, 1.35, 0, Math.PI * 2);
        }
        ctx.fillStyle = "rgba(178, 255, 237, 0.43)";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(122, 235, 214, 0.55)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Endpoint/root pulses remain, but are drawn together in one path.
        ctx.beginPath();
        for (const root of roots) {
            const pulse = 0.07 + (Math.sin(time * 0.001 + root.family) + 1) * 0.045;
            const radius = 1.3 + pulse * 4;
            ctx.moveTo(root.x + radius, root.y);
            ctx.arc(root.x, root.y, radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = "rgba(154, 246, 223, 0.13)";
        ctx.fill();
    }

    window.addEventListener("resize", scheduleResize, { passive: true });
    document.addEventListener("visibilitychange", () => {
        // Reset the frame timer after returning to the tab so animation resumes
        // immediately instead of trying to catch up with elapsed hidden time.
        if (!document.hidden) lastFrame = 0;
    });

    resize();
    requestAnimationFrame(draw);

    window.SG = window.SG || {};
    SG.networkPulse = function () {
        document.body.classList.add("network-pulse");
        window.setTimeout(() => document.body.classList.remove("network-pulse"), 220);
    };
})();
