
const SAVE_KEY = "project-exodus-world-time-v1";

export default class WorldClock {
  constructor(initialTime = null) {
    const parsed = initialTime ? new Date(initialTime) : new Date();

    this.currentTime = Number.isNaN(parsed.getTime())
      ? new Date()
      : parsed;

    this.intervalId = null;
    this.lastTick = Date.now();
  }

  start(onTick) {
    if (this.intervalId !== null) return;

    this.lastTick = Date.now();

    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastTick;

      this.currentTime = new Date(
        this.currentTime.getTime() + elapsed
      );

      this.lastTick = now;
      this.save();

      if (typeof onTick === "function") {
        onTick(this.getFormattedDateTime());
      }
    }, 1000);
  }

  advanceMinutes(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new TypeError("La durata del viaggio deve essere positiva.");
    }

    this.currentTime = new Date(
      this.currentTime.getTime() + minutes * 60 * 1000
    );

    this.lastTick = Date.now();
    this.save();

    return this.getFormattedDateTime();
  }

  getFormattedDateTime() {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).format(this.currentTime);
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, this.currentTime.toISOString());
      return true;
    } catch (error) {
      console.error("Salvataggio dell'ora del mondo non riuscito.", error);
      return false;
    }
  }

  static loadSavedTime() {
    try {
      return localStorage.getItem(SAVE_KEY);
    } catch (error) {
      console.warn("Impossibile leggere l'ora salvata.", error);
      return null;
    }
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.save();
  }
}
