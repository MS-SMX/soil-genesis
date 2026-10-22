export default class Character {
  constructor(data = {}) {
    this.name =
      typeof data.name === "string" && data.name.trim()
        ? data.name.trim().slice(0, 30)
        : "Sopravvissuto";

    this.health = this.validateStat(data.health, 100);
    this.energy = this.validateStat(data.energy, 100);
    this.hunger = this.validateStat(data.hunger, 100);
    this.thirst = this.validateStat(data.thirst, 100);
  }

  validateStat(value, fallback) {
    if (!Number.isFinite(value)) return fallback;
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  getCondition() {
    if (this.health <= 0) return "Inabile";
    if (this.health <= 25) return "Gravemente ferito";
    if (this.thirst <= 15) return "Disidratato";
    if (this.hunger <= 15) return "Affamato";
    if (this.energy <= 20) return "Esausto";
    if (this.health <= 60) return "Ferito";
    if (this.thirst <= 35) return "Assetato";
    if (this.hunger <= 35) return "Affamato";
    return "Stabile";
  }
}
