const KEY = "project-exodus-field-notebook-v1";
const LIMIT = 40;

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value.filter(entry => entry && typeof entry.title === "string" && typeof entry.detail === "string") : [];
  } catch {
    return [];
  }
}

export default class FieldNotebook {
  static entries() {
    return read().map(entry => ({ ...entry }));
  }

  static add({ locationId, locationName, title, detail, category = "Osservazione", timestamp = "", sourceType = "unclassified", sourceName = "", context = "" }) {
    if (typeof title !== "string" || !title.trim() || typeof detail !== "string" || !detail.trim()) return false;
    const entries = read();
    const signature = `${locationId}|${title.trim()}|${detail.trim()}`;
    if (entries.some(entry => entry.signature === signature)) return true;
    entries.unshift({
      signature,
      locationId: String(locationId || "unknown"),
      locationName: String(locationName || "Località sconosciuta"),
      title: title.trim().slice(0, 100),
      detail: detail.trim().slice(0, 500),
      category: String(category || "Osservazione").slice(0, 40),
      sourceType: ["direct", "character", "event", "inference", "unclassified"].includes(sourceType) ? sourceType : "unclassified",
      sourceName: String(sourceName || "").trim().slice(0, 100),
      context: String(context || "").trim().slice(0, 200),
      timestamp: String(timestamp || "")
    });
    try {
      localStorage.setItem(KEY, JSON.stringify(entries.slice(0, LIMIT)));
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
        window.dispatchEvent(new CustomEvent("exodus:notebook-updated", { detail: { signature } }));
      }
      return true;
    } catch {
      return false;
    }
  }

  static clear() {
    try { localStorage.removeItem(KEY); return true; }
    catch { return false; }
  }
}
