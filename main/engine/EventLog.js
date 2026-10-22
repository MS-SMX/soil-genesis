const SAVE_KEY = "project-exodus-event-log-v1";

function normalizeEntries(value, maxEntries) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry) =>
      entry &&
      typeof entry === "object" &&
      typeof entry.message === "string" &&
      typeof entry.timestamp === "string"
    )
    .slice(0, maxEntries)
    .map((entry, index) => ({
      id: typeof entry.id === "string" ? entry.id : `restored-${index}`,
      message: entry.message.slice(0, 2000),
      timestamp: entry.timestamp.slice(0, 100)
    }));
}

export default class EventLog {
  constructor(maxEntries = 30) {
    this.maxEntries = Number.isInteger(maxEntries) && maxEntries > 0
      ? maxEntries
      : 30;
    this.entries = this.load();
    this.nextId = 0;
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return [];
      return normalizeEntries(JSON.parse(raw), this.maxEntries);
    } catch (error) {
      console.warn("Registro eventi assente o illeggibile.", error);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.entries));
      return true;
    } catch (error) {
      console.warn("Salvataggio del registro eventi non riuscito.", error);
      return false;
    }
  }

  add(message, timestamp) {
    const entry = {
      id: `${Date.now()}-${this.nextId++}`,
      message: String(message).slice(0, 2000),
      timestamp: String(timestamp).slice(0, 100)
    };

    this.entries.unshift(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries.length = this.maxEntries;
    }

    this.save();
    return entry;
  }

  getEntries() {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
    this.save();
  }
}
