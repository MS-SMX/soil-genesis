import ITEMS from "./ItemCatalog.js";

export default class Inventory {
  constructor(data = {}) {
    this.items = {};

    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const [id, quantity] of Object.entries(data)) {
        if (
          ITEMS[id] &&
          Number.isInteger(quantity) &&
          quantity > 0
        ) {
          this.items[id] = quantity;
        }
      }
    }
  }

  static get MAX_WEIGHT_KG() {
    return 12;
  }

  getWeightKg() {
    return this.getItems().reduce((total, item) => total + (item.weight ?? 0) * item.quantity, 0);
  }

  canAdd(itemId, quantity = 1) {
    const item = ITEMS[itemId];
    if (!item || !Number.isInteger(quantity) || quantity < 1) return false;
    return this.getWeightKg() + (item.weight ?? 0) * quantity <= Inventory.MAX_WEIGHT_KG + 1e-9;
  }

  add(itemId, quantity = 1) {
    if (!ITEMS[itemId]) {
      throw new Error("Oggetto non riconosciuto.");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("La quantità deve essere un intero positivo.");
    }

    if (!this.canAdd(itemId, quantity)) {
      throw new Error(`Peso massimo superato: limite ${Inventory.MAX_WEIGHT_KG} kg.`);
    }

    this.items[itemId] = (this.items[itemId] ?? 0) + quantity;
    return this.items[itemId];
  }

  remove(itemId, quantity = 1) {
    if (!ITEMS[itemId]) {
      throw new Error("Oggetto non riconosciuto.");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("La quantità deve essere un intero positivo.");
    }

    const currentQuantity = this.items[itemId] ?? 0;

    if (currentQuantity < quantity) {
      throw new Error("Non possiedi una quantità sufficiente.");
    }

    const remaining = currentQuantity - quantity;

    if (remaining === 0) {
      delete this.items[itemId];
    } else {
      this.items[itemId] = remaining;
    }

    return remaining;
  }

  getItems() {
    return Object.entries(this.items)
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        ...ITEMS[id],
        quantity
      }));
  }

  toJSON() {
    return { ...this.items };
  }
}
