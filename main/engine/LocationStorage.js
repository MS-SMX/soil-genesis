import ITEMS from "./ItemCatalog.js";

const PREFIX = "project-exodus-location-storage-v1";

export default class LocationStorage {
  static key(locationId) {
    if (typeof locationId !== "string" || !/^[a-z0-9-]+$/.test(locationId)) {
      throw new Error("ID della località non valido.");
    }
    return `${PREFIX}:${locationId}`;
  }

  static load(locationId) {
    try {
      const raw = localStorage.getItem(this.key(locationId));
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
      const clean = {};
      for (const [id, quantity] of Object.entries(parsed)) {
        if (ITEMS[id] && Number.isInteger(quantity) && quantity > 0) clean[id] = quantity;
      }
      return clean;
    } catch (error) {
      console.warn("Deposito locale illeggibile; verrà ignorato.", error);
      return {};
    }
  }

  static save(locationId, items) {
    const clean = {};
    for (const [id, quantity] of Object.entries(items ?? {})) {
      if (ITEMS[id] && Number.isInteger(quantity) && quantity > 0) clean[id] = quantity;
    }
    try {
      localStorage.setItem(this.key(locationId), JSON.stringify(clean));
      return true;
    } catch (error) {
      console.error("Salvataggio del deposito locale non riuscito.", error);
      return false;
    }
  }
}
