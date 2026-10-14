(function () {
    "use strict";

    const canvas = document.getElementById("network");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let branches = [];
    let roots = [];

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

    function buildMycelium() {
        branches = [];
        roots = [];
        const count = mobile() ? 5 : 8;
        const marginX = width * 0.07;
        const marginY = height * 0.09;

        for (let i = 0; i < count; i++) {
            const fraction = count === 1 ? 0.5 : i / (count - 1);
            const x = marginX + (width - marginX * 2) * fraction + rand(-width * 0.035, width * 0.035);
            const y = rand(marginY, height - marginY);
            const family = i;
            const shoots = mobile() ? 3 : 4;

            for (let j = 0; j < shoots; j++) {
                addBranch(
                    x, y, rand(0, Math.PI * 2),
                    rand(Math.min(width, height) * 0.12, Math.min(width, height) * 0.23),
                    mobile() ? 3 : 4,
                    rand(0.7, 1.15),
                    family
                );
            }
        }
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.7);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildMycelium();
    }

    function pointOnBranch(branch, t) {
        const u = 1 - t;
        return {
            x: u * u * branch.x1 + 2 * u * t * branch.cx + t * t * branch.x2,
            y: u * u * branch.y1 + 2 * u * t * branch.cy + t * t * branch.y2
        };
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (const branch of branches) {
            const pulse = (Math.sin(time * 0.0007 + branch.phase) + 1) / 2;
            ctx.beginPath();
            ctx.moveTo(branch.x1, branch.y1);
            ctx.quadraticCurveTo(branch.cx, branch.cy, branch.x2, branch.y2);
            ctx.lineWidth = branch.width;
            ctx.strokeStyle = `rgba(121, 215, 199, ${branch.alpha + pulse * 0.075})`;
            ctx.shadowBlur = 1 + pulse * 4;
            ctx.shadowColor = "rgba(121, 215, 199, 0.28)";
            ctx.stroke();

            // A small living signal travels along each hypha.
            const progress = (branch.flow + time * branch.flowSpeed) % 1;
            const point = pointOnBranch(branch, progress);
            const glow = 0.22 + pulse * 0.28;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 1.1 + pulse * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(178, 255, 237, ${glow})`;
            ctx.shadowBlur = 5 + pulse * 5;
            ctx.shadowColor = "rgba(122, 235, 214, 0.7)";
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        for (const root of roots) {
            const pulse = 0.07 + (Math.sin(time * 0.001 + root.family) + 1) * 0.045;
            ctx.beginPath();
            ctx.arc(root.x, root.y, 1.3 + pulse * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(154, 246, 223, ${pulse})`;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    requestAnimationFrame(draw);

    window.SG = window.SG || {};
    SG.networkPulse = function () {
        document.body.classList.add("network-pulse");
        window.setTimeout(() => document.body.classList.remove("network-pulse"), 220);
    };
})();
