const KEY = "exodus.hypotheses.v1";
const STATUSES = new Set(["open", "plausible", "weak", "rejected"]);

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.evidence === "string" && STATUSES.has(item.status)) : [];
  } catch { return []; }
}

export default class DeductionBoard {
  static list() { return read().map(item => ({ ...item })); }

  static add({ title, evidence, location = "general", status = "open", now = new Date().toLocaleString("it-IT") }) {
    if (typeof title !== "string" || !title.trim() || typeof evidence !== "string" || !evidence.trim() || !STATUSES.has(status)) return false;
    const items = read();
    items.unshift({ id: `hyp-${Date.now()}-${items.length}`, title: title.trim().slice(0, 100), evidence: evidence.trim().slice(0, 500), location: String(location || "general"), status, createdAt: now, updatedAt: now });
    try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100))); return true; } catch { return false; }
  }

  static updateStatus(id, status, now = new Date().toLocaleString("it-IT")) {
    if (!STATUSES.has(status)) return false;
    const items = read(); const item = items.find(entry => entry.id === id);
    if (!item) return false;
    item.status = status; item.updatedAt = now;
    try { localStorage.setItem(KEY, JSON.stringify(items)); return true; } catch { return false; }
  }

  static remove(id) {
    const items = read(); const next = items.filter(item => item.id !== id);
    if (next.length === items.length) return false;
    try { localStorage.setItem(KEY, JSON.stringify(next)); return true; } catch { return false; }
  }

  static clear() { try { localStorage.removeItem(KEY); return true; } catch { return false; } }
}
