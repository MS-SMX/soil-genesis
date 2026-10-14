(function () {
    "use strict";

    const STORAGE_KEY = "sg-ui-sounds-enabled";
    const toggle = document.getElementById("sg-sound-toggle");
    if (!toggle) return;

    let enabled = false;
    let audioContext = null;
    let master = null;
    let lastHoverAt = 0;

    try { enabled = localStorage.getItem(STORAGE_KEY) === "true"; } catch (_) {}

    function syncToggle() {
        toggle.textContent = enabled ? "UI SOUND: ON" : "UI SOUND: OFF";
        toggle.setAttribute("aria-pressed", String(enabled));
        toggle.setAttribute("aria-label", enabled ? "Disattiva i suoni dell'interfaccia" : "Attiva i suoni dell'interfaccia");
    }

    function getContext() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!audioContext) {
            audioContext = new AudioCtx();
            master = audioContext.createGain();
            master.gain.value = 0.42;
            master.connect(audioContext.destination);
        }
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        return audioContext;
    }

    function envelope(gain, now, peak, duration, attack) {
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    }

    // Soft synthetic interface sounds: a low glassy pluck with a muted digital overtone.
    function play(kind) {
        if (!enabled) return;
        const ctx = getContext();
        if (!ctx || !master) return;
        const now = ctx.currentTime;
        const config = {
            hover: { f: 1046.5, f2: 1568, duration: 0.055, volume: 0.018, type: "sine" },
            click: { f: 523.25, f2: 783.99, duration: 0.105, volume: 0.035, type: "triangle" },
            toggleOn: { f: 392, f2: 783.99, duration: 0.18, volume: 0.04, type: "sine" },
            toggleOff: { f: 523.25, f2: 349.23, duration: 0.13, volume: 0.026, type: "sine" }
        }[kind] || { f: 440, f2: 660, duration: 0.08, volume: 0.02, type: "sine" };

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = config.type;
        osc.frequency.setValueAtTime(config.f, now);
        osc.frequency.exponentialRampToValueAtTime(config.f2, now + config.duration * 0.72);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(kind === "hover" ? 2600 : 1900, now);
        filter.Q.value = 0.65;
        envelope(gain, now, config.volume, config.duration, Math.min(0.012, config.duration * 0.22));
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + config.duration + 0.015);

        if (kind !== "hover") {
            const sub = ctx.createOscillator();
            const subGain = ctx.createGain();
            sub.type = "sine";
            sub.frequency.setValueAtTime(config.f / 2, now);
            envelope(subGain, now, config.volume * 0.22, config.duration * 0.82, 0.008);
            sub.connect(subGain);
            subGain.connect(master);
            sub.start(now);
            sub.stop(now + config.duration);
        }
    }

    toggle.addEventListener("click", function () {
        enabled = !enabled;
        try { localStorage.setItem(STORAGE_KEY, String(enabled)); } catch (_) {}
        syncToggle();
        if (enabled) play("toggleOn");
        else play("toggleOff");
    });

    const hoverSelector = [
        ".navbar a", ".dropbtn", ".dropdown-content a", ".seed-card", ".resource-card",
        ".log-card", ".log-hub-card", ".passport-card", ".media-thumb", ".window-header",
        ".produce-card", ".recipe-card", "button:not(#sg-sound-toggle)", "[role='button']"
    ].join(",");

    document.addEventListener("pointerover", function (event) {
        if (!enabled || !event.target.closest) return;
        const target = event.target.closest(hoverSelector);
        if (!target || target.contains(event.relatedTarget)) return;
        const now = performance.now();
        if (now - lastHoverAt < 85) return;
        lastHoverAt = now;
        play("hover");
    });

    document.addEventListener("click", function (event) {
        if (!enabled || !event.target.closest || event.target.closest("#sg-sound-toggle")) return;
        const target = event.target.closest(".navbar a, .dropbtn, .dropdown-content a, button, .media-thumb, [role='button']");
        if (target) play("click");
    });

    syncToggle();
})();
