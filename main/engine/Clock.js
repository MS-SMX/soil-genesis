export default class Clock {
  constructor() { this.time = new Date(); }
  update() { this.time = new Date(); return this.time; }
  getFormattedTime() { return this.time.toLocaleTimeString("it-IT", { hour12: false }); }
}
