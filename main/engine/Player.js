import Character from "./Character.js";
import Inventory from "./Inventory.js";

const SAVE_KEY = "project-exodus-save-v1";

function validRemainder(value, maximum, fallback = 0) {
  if (!Number.isFinite(value) || value < 0 || value >= maximum) {
    return fallback;
  }
  return Math.floor(value);
}

export default class Player extends Character {
  constructor(data = {}) {
    super(data);

    this.locationId =
      typeof data.locationId === "string" &&
      /^[a-z0-9-]+$/.test(data.locationId)
        ? data.locationId
        : "pallet";

    this.inventory = new Inventory(data.inventory ?? {});

    this.collectedSources = Array.isArray(data.collectedSources)
      ? data.collectedSources.filter((id) => typeof id === "string")
      : [];

    // Minuti accumulati tra una diminuzione del bisogno e la successiva.
    // Consentono anche alle azioni da 30 minuti di contribuire al consumo.
    this.hungerElapsedMinutes = validRemainder(data.hungerElapsedMinutes, 90);
    this.thirstElapsedMinutes = validRemainder(data.thirstElapsedMinutes, 60);

    // Tempo trascorso con fame/sete a zero prima di subire danni.
    this.starvationElapsedMinutes = validRemainder(data.starvationElapsedMinutes, 360);
    this.dehydrationElapsedMinutes = validRemainder(data.dehydrationElapsedMinutes, 180);

    // Lesioni persistenti: 0 nessuna, 1 lieve, 2 seria, 3 critica.
    this.woundSeverity = Number.isInteger(data.woundSeverity)
      ? Math.max(0, Math.min(3, data.woundSeverity))
      : 0;
    this.woundRecoveryElapsedMinutes = validRemainder(
      data.woundRecoveryElapsedMinutes,
      720
    );
  }

  rename(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Il nome non può essere vuoto.");
    }

    this.name = name.trim().slice(0, 30);
    this.save();
  }

  setLocation(locationId) {
    if (
      typeof locationId !== "string" ||
      !/^[a-z0-9-]+$/.test(locationId)
    ) {
      throw new Error("ID della località non valido.");
    }

    this.locationId = locationId;
    this.save();
  }

  updateStats({
    health = this.health,
    energy = this.energy,
    hunger = this.hunger,
    thirst = this.thirst
  } = {}) {
    this.health = this.validateStat(health, this.health);
    this.energy = this.validateStat(energy, this.energy);
    this.hunger = this.validateStat(hunger, this.hunger);
    this.thirst = this.validateStat(thirst, this.thirst);
    this.save();
  }

  advanceNeeds(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new TypeError("Il tempo trascorso deve essere un numero positivo.");
    }

    const elapsed = Math.floor(minutes);
    if (elapsed === 0) {
      return { hungerDamage: 0, thirstDamage: 0, healthDamage: 0 };
    }

    const hungerBefore = this.hunger;
    const thirstBefore = this.thirst;
    const hungerRemainderBefore = this.hungerElapsedMinutes;
    const thirstRemainderBefore = this.thirstElapsedMinutes;

    const hungerTotal = hungerRemainderBefore + elapsed;
    const hungerLoss = Math.floor(hungerTotal / 90);
    this.hunger = Math.max(0, hungerBefore - hungerLoss);
    this.hungerElapsedMinutes = this.hunger === 0 ? 0 : hungerTotal % 90;

    const thirstTotal = thirstRemainderBefore + elapsed;
    const thirstLoss = Math.floor(thirstTotal / 60);
    this.thirst = Math.max(0, thirstBefore - thirstLoss);
    this.thirstElapsedMinutes = this.thirst === 0 ? 0 : thirstTotal % 60;

    // Conta solo il tempo effettivamente trascorso con il bisogno già a zero.
    const minutesAtZero = (needBefore, remainderBefore, interval) => {
      if (needBefore === 0) return elapsed;
      const minutesUntilZero = Math.max(0, needBefore * interval - remainderBefore);
      return Math.max(0, elapsed - minutesUntilZero);
    };

    const hungerZeroMinutes = this.hunger === 0
      ? minutesAtZero(hungerBefore, hungerRemainderBefore, 90)
      : 0;
    const thirstZeroMinutes = this.thirst === 0
      ? minutesAtZero(thirstBefore, thirstRemainderBefore, 60)
      : 0;

    if (this.hunger === 0) {
      const total = this.starvationElapsedMinutes + hungerZeroMinutes;
      var hungerDamage = Math.floor(total / 360);
      this.starvationElapsedMinutes = total % 360;
    } else {
      this.starvationElapsedMinutes = 0;
      var hungerDamage = 0;
    }

    if (this.thirst === 0) {
      const total = this.dehydrationElapsedMinutes + thirstZeroMinutes;
      var thirstDamage = Math.floor(total / 180);
      this.dehydrationElapsedMinutes = total % 180;
    } else {
      this.dehydrationElapsedMinutes = 0;
      var thirstDamage = 0;
    }

    const healthDamage = hungerDamage + thirstDamage;
    if (healthDamage > 0) {
      this.health = Math.max(0, this.health - healthDamage);

      // La privazione prolungata può lasciare il personaggio debilitato.
      // Le lesioni non vengono inventate per danni minimi: compaiono solo
      // quando la salute è già scesa sotto la metà.
      if (this.health <= 10) {
        this.woundSeverity = Math.max(this.woundSeverity, 3);
      } else if (this.health <= 25) {
        this.woundSeverity = Math.max(this.woundSeverity, 2);
      } else if (this.health <= 50) {
        this.woundSeverity = Math.max(this.woundSeverity, 1);
      }
      if (this.woundSeverity > 0) this.woundRecoveryElapsedMinutes = 0;
    }

    this.save();
    return { hungerDamage, thirstDamage, healthDamage };
  }

  recoverWoundsDuringRest(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new TypeError("Il tempo di recupero deve essere un numero positivo.");
    }

    if (
      this.woundSeverity === 0 ||
      this.health <= 0 ||
      this.hunger <= 20 ||
      this.thirst <= 20
    ) {
      return 0;
    }

    const total = this.woundRecoveryElapsedMinutes + Math.floor(minutes);
    const recoveredLevels = Math.min(this.woundSeverity, Math.floor(total / 720));
    this.woundSeverity -= recoveredLevels;
    this.woundRecoveryElapsedMinutes = this.woundSeverity > 0 ? total % 720 : 0;
    this.save();
    return recoveredLevels;
  }

  treatWounds(levels = 1) {
    if (!Number.isFinite(levels) || levels < 0) {
      throw new TypeError("Il trattamento non è valido.");
    }

    const treated = Math.min(this.woundSeverity, Math.floor(levels));
    if (treated > 0) {
      this.woundSeverity -= treated;
      this.woundRecoveryElapsedMinutes = 0;
      this.save();
    }
    return treated;
  }

  getWoundLabel() {
    const labels = ["Nessuna", "Lieve", "Seria", "Critica"];
    return labels[this.woundSeverity] ?? "Non rilevata";
  }

  resetNeedClock(need) {
    if (need === "hunger") {
      this.hungerElapsedMinutes = 0;
      this.starvationElapsedMinutes = 0;
    }
    if (need === "thirst") {
      this.thirstElapsedMinutes = 0;
      this.dehydrationElapsedMinutes = 0;
    }
    this.save();
  }

  collectItem(itemId, quantity = 1) {
    this.inventory.add(itemId, quantity);
    this.save();
  }

  hasCollectedSource(sourceId) {
    return this.collectedSources.includes(sourceId);
  }

  markSourceCollected(sourceId) {
    if (!this.hasCollectedSource(sourceId)) {
      this.collectedSources.push(sourceId);
      this.save();
    }
  }

  toJSON() {
    return {
      name: this.name,
      health: this.health,
      energy: this.energy,
      hunger: this.hunger,
      thirst: this.thirst,
      locationId: this.locationId,
      inventory: this.inventory.toJSON(),
      collectedSources: [...this.collectedSources],
      hungerElapsedMinutes: this.hungerElapsedMinutes,
      thirstElapsedMinutes: this.thirstElapsedMinutes,
      starvationElapsedMinutes: this.starvationElapsedMinutes,
      dehydrationElapsedMinutes: this.dehydrationElapsedMinutes,
      woundSeverity: this.woundSeverity,
      woundRecoveryElapsedMinutes: this.woundRecoveryElapsedMinutes
    };
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.toJSON()));
      return true;
    } catch (error) {
      console.error("Salvataggio del personaggio non riuscito.", error);
      return false;
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return new Player();

      const data = JSON.parse(raw);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return new Player();
      }

      return new Player(data);
    } catch (error) {
      console.warn(
        "Salvataggio assente o illeggibile. Verrà creato un nuovo personaggio.",
        error
      );
      return new Player();
    }
  }
}
