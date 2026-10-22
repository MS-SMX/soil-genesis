
import Location from "./location.js";

export default class World {
  constructor() {
    this.locations = new Map();
    this.currentLocation = null;
  }

  async loadLocation(locationId) {
    if (typeof locationId !== "string" || !locationId.trim()) {
      throw new TypeError("ID della località non valido.");
    }

    const safeId = locationId.trim();

    if (!/^[a-z0-9-]+$/.test(safeId)) {
      throw new Error(`ID della località non consentito: ${safeId}`);
    }

    let location = this.locations.get(safeId);

    if (!location) {
      const jsonPath = `./main/data/locations/${safeId}.json`;
      const response = await fetch(jsonPath);

      if (!response.ok) {
        throw new Error(
          `Impossibile caricare la località "${safeId}" (${response.status}).`
        );
      }

      const data = await response.json();
      location = new Location(data);

      if (location.id !== safeId) {
        throw new Error(
          `L'ID nel file JSON non corrisponde a "${safeId}".`
        );
      }

      this.locations.set(location.id, location);
    }

    this.currentLocation = location;
    return location;
  }
}
