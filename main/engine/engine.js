
import Clock from "./Clock.js";
import World from "./world.js";
import WorldClock from "./WorldClock.js";
import EventLog from "./EventLog.js";
import Player from "./Player.js";
import ActionSystem from "./ActionSystem.js";
import ITEMS from "./ItemCatalog.js";
import LocationStorage from "./LocationStorage.js";
import { rollTravelEvent } from "./TravelEvents.js";
import { rollTravelFind } from "./TravelFinds.js";
import { rollTravelEncounter } from "./TravelEncounters.js";
import { inspectLocation, followClue } from "./Exploration.js";
import Discovery from "./Discovery.js";
import FieldNotebook from "./FieldNotebook.js";
import ContactRegistry from "./ContactRegistry.js";
import { northTrailCase } from "./InvestigationCase.js";

export default class Engine {
  constructor() {
    this.clock = new Clock();
    this.worldClock = new WorldClock(WorldClock.loadSavedTime());
    this.world = new World();
    this.eventLog = new EventLog(30);
    this.player = Player.load();
    this.actionSystem = new ActionSystem();

    this.intervalId = null;
    this.isRunning = false;
    this.isTravelling = false;
    this.isActing = false;
    this.currentClue = null;
    this.currentEncounter = null;
    this.currentContact = null;
  }

  async start() {
    if (this.isRunning) return;

    try {
      await this.world.loadLocation(this.player.locationId);
    } catch (error) {
      console.warn(
        "La località salvata non è disponibile. Ritorno a Biancavilla.",
        error
      );

      this.player.setLocation("pallet");
      await this.world.loadLocation("pallet");
    }

    this.currentClue = Discovery.clue(this.world.currentLocation.id);
    this.clock.update();

    this.eventLog.add(
      `Sistema avviato. ${this.player.name} si trova a ${this.world.currentLocation.name}.`,
      this.worldClock.getFormattedDateTime()
    );

    this.worldClock.start(() => {
      const element = document.getElementById("world-clock");

      if (element) {
        element.textContent = this.worldClock.getFormattedDateTime();
      }
    });

    this.intervalId = window.setInterval(() => {
      this.clock.update();

      const element = document.getElementById("clock");

      if (element) {
        element.textContent = this.clock.getFormattedTime();
      }
    }, 1000);

    this.isRunning = true;
    this.bindProfileForm();
    this.render();

    document.getElementById("engine-status").textContent = "RUNNING";
    document.getElementById("world-status").textContent = "ONLINE";

    console.info("Project Exodus v3.3.0 avviato.");
  }

  bindProfileForm() {
    const form = document.getElementById("profile-form");
    const input = document.getElementById("player-name");

    if (!form || !input || form.dataset.bound === "true") return;

    input.value = this.player.name;
    form.dataset.bound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        this.player.rename(input.value);

        this.eventLog.add(
          `Identità aggiornata: ${this.player.name}.`,
          this.worldClock.getFormattedDateTime()
        );

        this.renderProfile();
        this.renderEventLog();
        this.showNotice("Nome del personaggio salvato.");
      } catch (error) {
        this.showError(error.message);
      }
    });
  }

  render() {
    const location = this.world.currentLocation;

    if (!location) return;
    window.dispatchEvent(new CustomEvent("exodus:location-rendered", { detail: { name: location.name, description: location.description } }));

    document.getElementById("clock").textContent =
      this.clock.getFormattedTime();

    document.getElementById("world-clock").textContent =
      this.worldClock.getFormattedDateTime();

    document.getElementById("location").textContent = location.name;
    document.getElementById("description").textContent =
      location.description;

    document.getElementById("weather").textContent =
      this.getWeatherLabel(location.weather);

    this.renderProfile();
    this.renderConnections();
    this.renderKantoMap();
    this.renderActions();
    this.renderEventLog();
    this.renderInventory();
    this.renderStorage();
    this.renderScavenging();
    this.renderExploration();
    this.renderPointsOfInterest();
    this.renderFieldNotebook();
    this.renderEncounter();
    this.renderContact();
  }

  renderProfile() {
    document.getElementById("profile-name").textContent =
      this.player.name;

    document.getElementById("profile-health").textContent =
      `${this.player.health}/100`;

    document.getElementById("profile-energy").textContent =
      `${this.player.energy}/100`;

    const hungerElement = document.getElementById("profile-hunger");
    hungerElement.textContent = `${this.player.hunger}/100`;
    hungerElement.classList.toggle("stat-warning", this.player.hunger > 20 && this.player.hunger <= 35);
    hungerElement.classList.toggle("stat-critical", this.player.hunger <= 20);

    const thirstElement = document.getElementById("profile-thirst");
    thirstElement.textContent = `${this.player.thirst}/100`;
    thirstElement.classList.toggle("stat-warning", this.player.thirst > 20 && this.player.thirst <= 35);
    thirstElement.classList.toggle("stat-critical", this.player.thirst <= 20);

    document.getElementById("profile-condition").textContent =
      this.player.getCondition();

    const woundElement = document.getElementById("profile-wounds");
    if (woundElement) {
      woundElement.textContent = this.player.getWoundLabel();
      woundElement.classList.toggle("stat-warning", this.player.woundSeverity === 1);
      woundElement.classList.toggle("stat-critical", this.player.woundSeverity >= 2);
    }

    const location = this.world.currentLocation;

    const quickStats = {
      "quick-health": `${this.player.health}/100`,
      "quick-energy": `${this.player.energy}/100`,
      "quick-hunger": `${this.player.hunger}/100`,
      "quick-thirst": `${this.player.thirst}/100`
    };
    for (const [id, value] of Object.entries(quickStats)) {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    document.getElementById("profile-location").textContent =
      location ? location.name : "Sconosciuta";

    const input = document.getElementById("player-name");

    if (input && document.activeElement !== input) {
      input.value = this.player.name;
    }
  }

  renderConnections() {
    const container = document.getElementById("connections");
    const message = document.getElementById("travel-message");
    const location = this.world.currentLocation;

    container.replaceChildren();

    if (!location || location.connections.length === 0) {
      message.textContent = "Nessun collegamento conosciuto.";
      return;
    }

    message.textContent = "Destinazioni raggiungibili:";

    for (const connection of location.connections) {
      const destination =
        typeof connection === "string"
          ? { id: connection, label: connection, travelMinutes: 0 }
          : connection;

      if (!destination || typeof destination.id !== "string") {
        console.warn("Collegamento ignorato:", connection);
        continue;
      }

      const duration = Number(destination.travelMinutes ?? 0);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "travel-button";
      button.dataset.destination = destination.id;
      const direction = this.getTravelDirection(location.id, destination.id);
      button.dataset.direction = direction.name.toLowerCase();
      button.disabled = this.isTravelling || this.isActing;
      const arrow = direction.arrow;
      const arrowElement = document.createElement("span");
      arrowElement.className = "travel-arrow";
      arrowElement.setAttribute("aria-hidden", "true");
      arrowElement.textContent = arrow;
      const copy = document.createElement("span");
      copy.className = "travel-copy";
      const title = document.createElement("strong");
      title.textContent = destination.label || destination.id;
      const meta = document.createElement("small");
      let annotation = {};
      try { annotation = JSON.parse(localStorage.getItem("exodus.map.annotations.v1") || "{}"); } catch {}
      const routeId = [location.id, destination.id].find(id => /^route\d+$/.test(id));
      const status = routeId ? annotation[routeId] : null;
      const statusLabel = { danger: "PERICOLOSO", check: "DA VERIFICARE", blocked: "INTERROTTO" }[status];
      meta.textContent = `${direction.name} · ${this.formatDuration(duration)}${statusLabel ? ` · NOTA: ${statusLabel}` : ""}`;
      if (statusLabel) button.classList.add(`route-status-${status}`);
      copy.append(title, meta);
      button.append(arrowElement, copy);

      button.addEventListener("click", () => {
        this.travelTo(destination.id);
      });

      container.appendChild(button);
    }
  }

  renderKantoMap() {
    const location = this.world.currentLocation;
    const mapPanel = document.getElementById("kanto-map-panel");
    const mapConnections = document.getElementById("map-connections");
    const mapMessage = document.getElementById("map-travel-message");
    if (!location || !mapPanel || !mapConnections || !mapMessage) return;

    const names = { pallet: "Biancavilla", route1: "Percorso 1", viridian: "Smeraldopoli" };
    const coordinates = {
      pallet: { x: "50%", y: "90%" },
      route1: { x: "50%", y: "78%" },
      viridian: { x: "50%", y: "66%" }
    };
    const activeIds = new Set([location.id]);
    for (const connection of location.connections || []) {
      activeIds.add(typeof connection === "string" ? connection : connection.id);
    }

    mapPanel.querySelectorAll("[data-map-location]").forEach(node => {
      const id = node.dataset.mapLocation;
      const isCurrent = id === location.id;
      const isAvailable = activeIds.has(id) && id !== location.id && Boolean(names[id]);
      node.classList.toggle("current", isCurrent);
      node.classList.toggle("available", isAvailable);
      node.classList.toggle("future", !isCurrent && !isAvailable);
      node.disabled = !isCurrent && !isAvailable;
      node.removeAttribute("aria-current");
      node.setAttribute("aria-label", isCurrent
        ? `${names[id] || location.name}, posizione attuale`
        : isAvailable
          ? `Viaggia verso ${names[id]}`
          : `${node.textContent.replace(/^●\s*/, "")}, non ancora raggiungibile`);
      if (isCurrent) {
        node.setAttribute("aria-current", "location");
        node.textContent = names[id] || location.name;
        node.style.setProperty("--x", coordinates[id]?.x || "50%");
        node.style.setProperty("--y", coordinates[id]?.y || "50%");
      } else if (names[id]) {
        node.textContent = names[id];
      }
    });

    mapConnections.replaceChildren();
    const connections = location.connections || [];
    mapMessage.textContent = connections.length
      ? "Scegli un collegamento effettivamente disponibile dalla posizione corrente."
      : "Nessun collegamento disponibile.";
    const directionByPair = {
      "pallet:route1": ["NORD", "↑"],
      "route1:pallet": ["SUD", "↓"],
      "route1:viridian": ["NORD", "↑"],
      "viridian:route1": ["SUD", "↓"]
    };
    for (const connection of connections) {
      const destination = typeof connection === "string"
        ? { id: connection, label: names[connection] || connection, travelMinutes: 0 }
        : connection;
      if (!destination?.id) continue;
      const [direction, arrow] = directionByPair[`${location.id}:${destination.id}`] || ["DIREZIONE DA DEFINIRE", "•"];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-connection";
      button.dataset.destination = destination.id;
      button.dataset.direction = direction.toLowerCase();
      let routeAnnotations = {};
      try { routeAnnotations = JSON.parse(localStorage.getItem("exodus.map.annotations.v1") || "{}"); } catch {}
      const routeId = [location.id, destination.id].find(id => /^route\d+$/.test(id));
      const status = routeId ? routeAnnotations[routeId] : null;
      const statusLabel = { danger: "PERICOLOSO", check: "DA VERIFICARE", blocked: "INTERROTTO" }[status];
      if (status) button.classList.add(`route-status-${status}`);
      button.disabled = this.isTravelling || this.isActing;
      if (statusLabel) button.title = `Nota personale: ${statusLabel}. Non modifica le regole del mondo.`;
      const marker = document.createElement("span");
      marker.className = "direction";
      marker.textContent = `${arrow} ${direction}`;
      const label = document.createElement("span");
      label.textContent = `${destination.label || names[destination.id] || destination.id} · ${this.formatDuration(Number(destination.travelMinutes || 0))}`;
      button.append(marker, label);
      button.addEventListener("click", () => this.travelTo(destination.id));
      mapConnections.appendChild(button);
    }
  }

  getTravelDirection(originId, destinationId) {
    const directions = {
      "pallet:route1": { name: "NORD", arrow: "↑" },
      "route1:pallet": { name: "SUD", arrow: "↓" },
      "route1:viridian": { name: "NORD", arrow: "↑" },
      "viridian:route1": { name: "SUD", arrow: "↓" }
    };
    return directions[`${originId}:${destinationId}`] || { name: "COLLEGAMENTO", arrow: "↗" };
  }

  renderActions() {
    const container = document.getElementById("actions");
    const message = document.getElementById("action-message");

    if (!container || !message) return;

    container.replaceChildren();

    const actions = this.actionSystem.getAvailableActions(this.player);

    if (actions.length === 0) {
      message.textContent =
        "Non hai bisogno di riposare e non hai abbastanza energia per esplorare.";
    } else {
      message.textContent = "Scegli un'attività:";
    }

    for (const action of actions) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "action-button";
      button.disabled = this.isTravelling || this.isActing;
      button.textContent =
        `${action.label} · ${this.formatDuration(action.durationMinutes)}`;

      button.title = action.description;

      button.addEventListener("click", () => {
        this.performAction(action.id);
      });

      container.appendChild(button);
    }

    const rest = this.actionSystem.getAction("rest");

    if (rest && this.player.energy >= 100 && this.player.health >= 100) {
      message.textContent = "Sei in buone condizioni. Al momento non hai bisogno di riposare.";
    }
  }

  async performAction(actionId) {
    if (!this.isRunning || this.isTravelling || this.isActing) return;

    const action = this.actionSystem.getAction(actionId);

    if (!this.actionSystem.canPerform(action, this.player)) {
      this.showError("Non puoi eseguire questa azione nelle condizioni attuali.");
      return;
    }

    this.isActing = true;
    this.setBusyStatus("ACTING", "BUSY");
    document.getElementById("error-message").hidden = true;

    this.renderActions();
    this.renderConnections();

    try {
      const result = this.actionSystem.perform(action, this.player);

      this.advanceWorldTime(result.durationMinutes);

      if (actionId === "rest") {
        const recoveredWounds = this.player.recoverWoundsDuringRest(result.durationMinutes);
        if (recoveredWounds > 0) {
          this.eventLog.add(
            `Il riposo ha permesso di recuperare ${recoveredWounds} livello/i di lesione.`,
            this.worldClock.getFormattedDateTime()
          );
        }
      }

      this.eventLog.add(
        result.message,
        this.worldClock.getFormattedDateTime()
      );

      this.showNotice(action.description);
      this.render();
    } catch (error) {
      console.error(error);
      this.showError(error.message || "Azione non riuscita.");
    } finally {
      this.isActing = false;
      this.setBusyStatus("RUNNING", "ONLINE");
      this.renderActions();
      this.renderConnections();
    }
  }

  async travelTo(destinationId) {
    if (!this.isRunning || this.isTravelling || this.isActing) return;

    const currentLocation = this.world.currentLocation;

    if (!currentLocation || destinationId === currentLocation.id) return;

    const connection = currentLocation.connections.find((entry) => {
      const id = typeof entry === "string" ? entry : entry?.id;
      return id === destinationId;
    });

    if (!connection) {
      this.showError("La destinazione non è collegata alla località corrente.");
      return;
    }

    const travelMinutes =
      typeof connection === "string"
        ? 0
        : Number(connection.travelMinutes ?? 0);

    if (!Number.isFinite(travelMinutes) || travelMinutes < 0) {
      this.showError("La durata del viaggio non è valida.");
      return;
    }

    this.isTravelling = true;
    this.currentContact = null;
    this.setBusyStatus("TRAVELLING", "MOVING");
    document.getElementById("error-message").hidden = true;

    this.renderActions();
    this.renderConnections();

    this.eventLog.add(
      `Partenza da ${currentLocation.name}. Durata prevista: ${this.formatDuration(travelMinutes)}.`,
      this.worldClock.getFormattedDateTime()
    );

    this.renderEventLog();

    try {
      const destination = await this.world.loadLocation(destinationId);

      this.advanceWorldTime(travelMinutes);
      // Le annotazioni della mappa sono promemoria privati: non influenzano il mondo.
      const travelEvent = rollTravelEvent(Math.random, 0.4);
      if (travelEvent) {
        this.eventLog.add(
          `Durante il viaggio: ${travelEvent}`,
          this.worldClock.getFormattedDateTime()
        );
      }

      const encounter = rollTravelEncounter(destination.id, Math.random, 0.25);
      this.currentEncounter = encounter ? { description: encounter, locationId: destination.id } : null;
      if (encounter) {
        this.eventLog.add(
          `Avvistamento: ${encounter}`,
          this.worldClock.getFormattedDateTime()
        );
      }

      const travelFind = rollTravelFind(destination.id);
      if (travelFind) {
        if (this.player.inventory.canAdd(travelFind.itemId, travelFind.quantity)) {
          this.player.collectItem(travelFind.itemId, travelFind.quantity);
          this.eventLog.add(
            `Ritrovamento lungo il percorso: ${travelFind.message} Hai raccolto ${travelFind.quantity} × ${ITEMS[travelFind.itemId].name}.`,
            this.worldClock.getFormattedDateTime()
          );
        } else {
          this.eventLog.add(
            `Noti qualcosa lungo il percorso, ma lo zaino è troppo pieno per raccoglierlo.`,
            this.worldClock.getFormattedDateTime()
          );
        }
      }
      this.player.setLocation(destination.id);
      this.currentClue = Discovery.clue(destination.id);

      this.eventLog.add(
        `Arrivo a ${destination.name}.`,
        this.worldClock.getFormattedDateTime()
      );

      this.render();
      console.info(`Arrivo: ${destination.name}`);
    } catch (error) {
      console.error(error);

      this.eventLog.add(
        "Viaggio interrotto: impossibile raggiungere la destinazione.",
        this.worldClock.getFormattedDateTime()
      );

      this.showError(
        "Spostamento non riuscito. Controlla i dati della destinazione."
      );
    } finally {
      this.isTravelling = false;
      this.setBusyStatus("RUNNING", "ONLINE");
      this.render();
    }
  }

  advanceWorldTime(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new TypeError("La durata deve essere un numero positivo.");
    }

    const previousHunger = this.player.hunger;
    const previousThirst = this.player.thirst;
    const previousHealth = this.player.health;

    this.worldClock.advanceMinutes(minutes);
    const consequences = this.player.advanceNeeds(minutes);

    const timestamp = this.worldClock.getFormattedDateTime();
    const warnings = [];

    if (previousHunger > 20 && this.player.hunger <= 20) {
      warnings.push("Le provviste scarseggiano: la fame è diventata critica.");
    }
    if (previousThirst > 20 && this.player.thirst <= 20) {
      warnings.push("L'acqua scarseggia: la sete è diventata critica.");
    }
    if (previousHunger > 0 && this.player.hunger === 0) {
      warnings.push("Non hai più riserve alimentari: devi trovare cibo.");
    }
    if (previousThirst > 0 && this.player.thirst === 0) {
      warnings.push("Sei senza acqua: trovare acqua potabile è una priorità.");
    }
    if (consequences.healthDamage > 0) {
      const causes = [];
      if (consequences.hungerDamage > 0) causes.push(`fame ${consequences.hungerDamage}`);
      if (consequences.thirstDamage > 0) causes.push(`disidratazione ${consequences.thirstDamage}`);
      warnings.push(`La salute è diminuita di ${previousHealth - this.player.health} per ${causes.join(" e ")}. Salute: ${this.player.health}/100.`);
      if (this.player.woundSeverity > 0) {
        warnings.push(`Debilitazione fisica: lesioni di livello ${this.player.woundSeverity} (${this.player.getWoundLabel().toLowerCase()}). Riposa in condizioni stabili o usa materiale medico.`);
      }
    }

    for (const warning of warnings) {
      this.eventLog.add(warning, timestamp);
    }
  }

  renderEventLog() {
    const list = document.getElementById("event-log");

    if (!list) return;

    list.replaceChildren();

    for (const entry of this.eventLog.getEntries()) {
      const item = document.createElement("li");
      const time = document.createElement("time");
      const message = document.createElement("span");

      time.textContent = entry.timestamp;
      message.textContent = entry.message;

      item.append(time, message);
      list.appendChild(item);
    }
  }

  setBusyStatus(engineStatus, worldStatus) {
    document.getElementById("engine-status").textContent = engineStatus;
    document.getElementById("world-status").textContent = worldStatus;
  }

  formatDuration(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) {
      return "durata ignota";
    }

    if (minutes === 0) return "istantaneo";

    const totalMinutes = Math.round(minutes);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const remainingMinutes = totalMinutes % 60;
    const parts = [];

    if (days > 0) parts.push(`${days} g`);
    if (hours > 0) parts.push(`${hours} h`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} min`);

    return parts.join(" ");
  }

  getWeatherLabel(weather) {
    const labels = {
      clear: "Sereno",
      cloudy: "Nuvoloso",
      rain: "Pioggia",
      storm: "Temporale",
      fog: "Nebbia",
      unknown: "Non rilevate"
    };

    return labels[weather] ?? weather;
  }

  showError(message) {
    const element = document.getElementById("error-message");

    if (element) {
      element.hidden = false;
      element.textContent = message;
    }
  }

  showNotice(message) {
    const element = document.getElementById("notice-message");

    if (element) {
      element.hidden = false;
      element.textContent = message;
    }
  }


renderInventory() {
  const container = document.getElementById("inventory-list");
  const message = document.getElementById("inventory-message");

  if (!container || !message) return;

  const items = this.player.inventory.getItems();
  container.replaceChildren();

  if (items.length === 0) {
    message.textContent = "Nessun oggetto trasportato.";
    return;
  }

  const currentWeight = this.player.inventory.getWeightKg();
  const maxWeight = this.player.inventory.constructor.MAX_WEIGHT_KG;
  message.textContent = `Tipi di oggetto: ${items.length} · Peso: ${currentWeight.toFixed(1)} / ${maxWeight} kg`;

  for (const item of items) {
    const entry = document.createElement("div");
    entry.className = "inventory-item";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const quantity = document.createElement("span");
    quantity.textContent = ` × ${item.quantity} · ${(item.weight * item.quantity).toFixed(1)} kg`;

    const description = document.createElement("p");
    description.textContent = item.description;

    entry.append(name, quantity, description);

    if (item.usable) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "action-button";
      button.textContent = "Usa oggetto";
      button.disabled = this.isTravelling || this.isActing;

      button.addEventListener("click", () => {
        this.useItem(item.id);
      });

      entry.appendChild(button);
    }

    const dropOneButton = document.createElement("button");
    dropOneButton.type = "button";
    dropOneButton.className = "action-button secondary-button";
    dropOneButton.textContent = "Abbandona 1";
    dropOneButton.disabled = this.isTravelling || this.isActing;
    dropOneButton.addEventListener("click", () => this.dropItem(item.id, 1));
    entry.appendChild(dropOneButton);

    if (item.quantity > 1) {
      const dropAllButton = document.createElement("button");
      dropAllButton.type = "button";
      dropAllButton.className = "action-button secondary-button";
      dropAllButton.textContent = `Abbandona tutti (${item.quantity})`;
      dropAllButton.disabled = this.isTravelling || this.isActing;
      dropAllButton.addEventListener("click", () => this.dropItem(item.id, item.quantity));
      entry.appendChild(dropAllButton);
    }

    const depositButton = document.createElement("button");
    depositButton.type = "button";
    depositButton.className = "action-button secondary-button";
    depositButton.textContent = "Deposita 1";
    depositButton.disabled = this.isTravelling || this.isActing;
    depositButton.addEventListener("click", () => this.depositItem(item.id, 1));
    entry.appendChild(depositButton);

    if (item.quantity > 1) {
      const depositAllButton = document.createElement("button");
      depositAllButton.type = "button";
      depositAllButton.className = "action-button secondary-button";
      depositAllButton.textContent = `Deposita tutti (${item.quantity})`;
      depositAllButton.disabled = this.isTravelling || this.isActing;
      depositAllButton.addEventListener("click", () => this.depositItem(item.id, item.quantity));
      entry.appendChild(depositAllButton);
    }

    container.appendChild(entry);
  }
}



renderStorage() {
  const container = document.getElementById("storage-list");
  const message = document.getElementById("storage-message");
  if (!container || !message) return;

  const location = this.world.currentLocation;
  if (!location) return;
  const stored = LocationStorage.load(location.id);
  const entries = Object.entries(stored).filter(([, quantity]) => quantity > 0);
  container.replaceChildren();
  message.textContent = entries.length
    ? `Deposito di ${location.name} · ${entries.length} tipi di oggetto`
    : `Il deposito di ${location.name} è vuoto.`;

  for (const [itemId, quantity] of entries) {
    const item = ITEMS[itemId];
    if (!item) continue;
    const row = document.createElement("div");
    row.className = "inventory-item";
    const label = document.createElement("strong");
    label.textContent = `${item.name} × ${quantity}`;
    const weight = document.createElement("p");
    weight.textContent = `Peso depositato: ${((item.weight ?? 0) * quantity).toFixed(1)} kg`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button secondary-button";
    button.textContent = "Ritira 1";
    button.disabled = this.isTravelling || this.isActing || !this.player.inventory.canAdd(itemId, 1);
    button.title = button.disabled && !this.isTravelling && !this.isActing
      ? "Non hai abbastanza spazio nell'inventario." : "Ritira una unità";
    button.addEventListener("click", () => this.withdrawItem(itemId, 1));
    row.append(label, weight, button);
    if (quantity > 1) {
      const allButton = document.createElement("button");
      allButton.type = "button";
      allButton.className = "action-button secondary-button";
      allButton.textContent = `Ritira tutti (${quantity})`;
      allButton.disabled = this.isTravelling || this.isActing || !this.player.inventory.canAdd(itemId, quantity);
      allButton.title = allButton.disabled && !this.isTravelling && !this.isActing
        ? "Non hai abbastanza spazio per ritirare tutto." : "Ritira tutte le unità";
      allButton.addEventListener("click", () => this.withdrawItem(itemId, quantity));
      row.appendChild(allButton);
    }
    container.appendChild(row);
  }
}

depositItem(itemId, quantity = 1) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;
  const owned = this.player.inventory.items[itemId] ?? 0;
  if (!ITEMS[itemId] || !Number.isInteger(quantity) || quantity < 1 || owned < quantity) {
    this.showError("Quantità non valida per il deposito.");
    return;
  }
  const location = this.world.currentLocation;
  if (!location) return;
  const stored = LocationStorage.load(location.id);
  try {
    this.player.inventory.remove(itemId, quantity);
    stored[itemId] = (stored[itemId] ?? 0) + quantity;
    if (!LocationStorage.save(location.id, stored)) {
      this.player.inventory.add(itemId, quantity);
      this.showError("Non è stato possibile salvare il deposito. Gli oggetti sono rimasti nell'inventario.");
      return;
    }
    const message = `Depositati ${quantity} × ${ITEMS[itemId].name} a ${location.name}.`;
    this.eventLog.add(message, this.worldClock.getFormattedDateTime());
    this.renderInventory(); this.renderStorage(); this.renderEventLog(); this.showNotice(message);
  } catch (error) {
    this.showError(error.message || "Deposito non riuscito.");
  }
}

withdrawItem(itemId, quantity = 1) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;
  const location = this.world.currentLocation;
  if (!location) return;
  const stored = LocationStorage.load(location.id);
  if (!ITEMS[itemId] || !Number.isInteger(quantity) || quantity < 1 || (stored[itemId] ?? 0) < quantity) {
    this.showError("Quantità non valida nel deposito.");
    this.renderStorage();
    return;
  }
  if (!this.player.inventory.canAdd(itemId, quantity)) {
    this.showError("Non hai abbastanza spazio nell'inventario per ritirare questa quantità.");
    return;
  }
  try {
    this.player.inventory.add(itemId, quantity);
    const remaining = stored[itemId] - quantity;
    if (remaining > 0) stored[itemId] = remaining; else delete stored[itemId];
    if (!LocationStorage.save(location.id, stored)) {
      this.player.inventory.remove(itemId, quantity);
      this.showError("Non è stato possibile aggiornare il deposito. Gli oggetti sono rimasti al loro posto.");
      return;
    }
    this.player.save();
    const message = `Ritirati ${quantity} × ${ITEMS[itemId].name} dal deposito di ${location.name}.`;
    this.eventLog.add(message, this.worldClock.getFormattedDateTime());
    this.renderInventory(); this.renderStorage(); this.renderEventLog(); this.showNotice(message);
  } catch (error) {
    this.showError(error.message || "Ritiro non riuscito.");
  }
}

dropItem(itemId, quantity = 1) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;

  const item = ITEMS[itemId];
  const owned = this.player.inventory.items[itemId] ?? 0;
  if (!item || !Number.isInteger(quantity) || quantity < 1 || owned < quantity) {
    this.showError("Quantità non valida: l'oggetto non è più disponibile nell'inventario.");
    this.renderInventory();
    return;
  }

  try {
    this.player.inventory.remove(itemId, quantity);
    const totalWeight = (item.weight ?? 0) * quantity;
    const message = quantity === 1
      ? `Hai abbandonato: ${item.name} (${totalWeight.toFixed(1)} kg). L'oggetto non è recuperabile.`
      : `Hai abbandonato ${quantity} × ${item.name} (${totalWeight.toFixed(1)} kg). Gli oggetti non sono recuperabili.`;
    this.eventLog.add(message, this.worldClock.getFormattedDateTime());
    this.renderInventory();
    this.renderEventLog();
    this.showNotice(message);
    const errorElement = document.getElementById("error-message");
    if (errorElement) errorElement.hidden = true;
  } catch (error) {
    this.showError(error.message || "Impossibile abbandonare l'oggetto.");
  }
}


useItem(itemId) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;

  const item = ITEMS[itemId];
  const quantity = this.player.inventory.items[itemId] ?? 0;

  if (!item || !item.usable) {
    this.showError("Questo oggetto non può essere utilizzato.");
    return;
  }

  if (quantity < 1) {
    this.showError("Non possiedi questo oggetto.");
    this.renderInventory();
    return;
  }

  const hungerRecovery = Number(item.hungerRecovery ?? 0);
  const thirstRecovery = Number(item.thirstRecovery ?? 0);
  const energyRecovery = Number(item.energyRecovery ?? 0);
  const healthRecovery = Number(item.healthRecovery ?? 0);
  const woundRecovery = Number(item.woundRecovery ?? 0);

  if (
    ![hungerRecovery, thirstRecovery, energyRecovery, healthRecovery, woundRecovery].every(
      (value) => Number.isFinite(value) && value >= 0
    )
  ) {
    this.showError("L'effetto dell'oggetto non è valido.");
    return;
  }

  const nextHunger = Math.min(100, this.player.hunger + hungerRecovery);
  const nextThirst = Math.min(100, this.player.thirst + thirstRecovery);
  const nextEnergy = Math.min(100, this.player.energy + energyRecovery);
  const nextHealth = Math.min(100, this.player.health + healthRecovery);

  const hungerRecovered = nextHunger - this.player.hunger;
  const thirstRecovered = nextThirst - this.player.thirst;
  const energyRecovered = nextEnergy - this.player.energy;
  const healthRecovered = nextHealth - this.player.health;
  const woundsTreated = Math.min(this.player.woundSeverity, Math.floor(woundRecovery));

  if (
    hungerRecovered === 0 &&
    thirstRecovered === 0 &&
    energyRecovered === 0 &&
    healthRecovered === 0 &&
    woundsTreated === 0
  ) {
    this.showError("Non hai bisogno di usare questo oggetto in questo momento.");
    return;
  }

  this.isActing = true;
  this.setBusyStatus("USING ITEM", "BUSY");

  try {
    this.player.inventory.remove(itemId, 1);
    this.player.treatWounds(woundRecovery);
    this.player.updateStats({
      hunger: nextHunger,
      thirst: nextThirst,
      energy: nextEnergy,
      health: nextHealth
    });

    if (hungerRecovered > 0) {
      this.player.resetNeedClock("hunger");
    }

    if (thirstRecovered > 0) {
      this.player.resetNeedClock("thirst");
    }

    const effects = [];
    if (hungerRecovered > 0) effects.push(`sazietà +${hungerRecovered}`);
    if (thirstRecovered > 0) effects.push(`idratazione +${thirstRecovered}`);
    if (energyRecovered > 0) effects.push(`energia +${energyRecovered}`);
    if (healthRecovered > 0) effects.push(`salute +${healthRecovered}`);
    if (woundsTreated > 0) effects.push(`lesioni trattate ${woundsTreated}`);

    const message =
      `${this.player.name} ha utilizzato ${item.name}. Effetti: ${effects.join(", ")}.`;

    this.eventLog.add(
      message,
      this.worldClock.getFormattedDateTime()
    );

    this.showNotice(message);
  } catch (error) {
    console.error(error);
    this.showError(error.message || "Impossibile utilizzare l'oggetto.");
  } finally {
    this.isActing = false;
    this.setBusyStatus("RUNNING", "ONLINE");
    this.render();
  }
}


renderExploration() {
  const container = document.getElementById("exploration-options");
  const message = document.getElementById("exploration-message");
  const card = document.getElementById("clue-card");
  if (!container || !message || !card) return;
  container.replaceChildren();
  card.replaceChildren();
  card.hidden = !this.currentClue;

  const inspectButton = document.createElement("button");
  inspectButton.type = "button";
  inspectButton.className = "action-button";
  inspectButton.textContent = "Esamina i dintorni · 10 min";
  inspectButton.disabled = this.isTravelling || this.isActing || this.player.energy < 3;
  inspectButton.addEventListener("click", () => this.inspectSurroundings());
  container.appendChild(inspectButton);

  if (this.currentClue) {
    const title = document.createElement("strong");
    title.textContent = this.currentClue.title;
    const detail = document.createElement("p");
    detail.textContent = this.currentClue.detail;
    const follow = document.createElement("button");
    follow.type = "button";
    follow.className = "action-button secondary-button";
    follow.textContent = "Segui la traccia · 20 min";
    follow.disabled = this.isTravelling || this.isActing || this.player.energy < 5;
    follow.addEventListener("click", () => this.followCurrentClue());
    const ignore = document.createElement("button");
    ignore.type = "button";
    ignore.className = "action-button secondary-button";
    ignore.textContent = "Lascia perdere";
    ignore.disabled = this.isTravelling || this.isActing;
    ignore.addEventListener("click", () => {
      this.currentClue = null;
      Discovery.setClue(this.world.currentLocation?.id, null);
      this.eventLog.add("Decidi di non seguire la traccia.", this.worldClock.getFormattedDateTime());
      this.render();
    });
    card.append(title, detail, follow, ignore);
    card.hidden = false;
    message.textContent = "Hai notato qualcosa. Puoi seguirne le tracce oppure proseguire.";
  } else {
    message.textContent = "Esamina l'ambiente per trovare indizi. Ogni osservazione richiede tempo ed energia.";
  }
}

inspectSurroundings() {
  if (!this.isRunning || this.isTravelling || this.isActing) return;
  if (this.player.energy < 3) { this.showError("Sei troppo stanco per esaminare attentamente i dintorni."); return; }
  this.isActing = true;
  try {
    this.player.updateStats({ energy: this.player.energy - 3 });
    this.advanceWorldTime(10);
    this.currentClue = inspectLocation(this.world.currentLocation?.id);
    Discovery.setClue(this.world.currentLocation?.id, this.currentClue);
    const message = `Osservazione: ${this.currentClue.title}. ${this.currentClue.detail}`;
    this.eventLog.add(message, this.worldClock.getFormattedDateTime());
    FieldNotebook.add({
      locationId: this.world.currentLocation?.id,
      locationName: this.world.currentLocation?.name,
      title: this.currentClue.title,
      detail: this.currentClue.detail,
      category: "Indizio",
      sourceType: "direct",
      context: "Osservazione personale dell’ambiente",
      timestamp: this.worldClock.getFormattedDateTime()
    });
    this.showNotice("Hai individuato una traccia. Decidi se seguirla.");
  } catch (error) { this.showError(error.message || "Non riesci a esaminare i dintorni."); }
  finally { this.isActing = false; this.render(); }
}

followCurrentClue() {
  if (!this.isRunning || this.isTravelling || this.isActing || !this.currentClue) return;
  if (this.player.energy < 5) { this.showError("Non hai energia sufficiente per seguire la traccia."); return; }
  this.isActing = true;
  try {
    const result = followClue(this.currentClue);
    this.player.updateStats({ energy: this.player.energy - 5 });
    this.advanceWorldTime(20);
    let message = result.message;
    if (result.itemId && ITEMS[result.itemId]) {
      if (this.player.inventory.canAdd(result.itemId, result.quantity)) {
        this.player.collectItem(result.itemId, result.quantity);
        message += ` Hai raccolto ${result.quantity} × ${ITEMS[result.itemId].name}.`;
      } else {
        message += " Lo zaino è troppo pieno per raccogliere ciò che hai trovato.";
      }
    }
    this.eventLog.add(`Traccia seguita: ${message}`, this.worldClock.getFormattedDateTime());
    FieldNotebook.add({
      locationId: this.world.currentLocation?.id,
      locationName: this.world.currentLocation?.name,
      title: `Esito: ${this.currentClue.title}`,
      detail: message,
      category: "Indizio collegato",
      sourceType: "event",
      context: "Esito dell’esame di una traccia",
      timestamp: this.worldClock.getFormattedDateTime()
    });
    this.currentClue = null;
    Discovery.setClue(this.world.currentLocation?.id, null);
    this.showNotice("Hai completato l'esplorazione della traccia.");
  } catch (error) { this.showError(error.message || "Non riesci a seguire la traccia."); }
  finally { this.isActing = false; this.render(); }
}

renderPointsOfInterest() {
  const container = document.getElementById("points-of-interest");
  const message = document.getElementById("poi-message");
  if (!container || !message) return;
  container.replaceChildren();
  const location = this.world.currentLocation;
  const points = Discovery.points(location?.id);
  if (!points.length) {
    message.textContent = "Nessun punto d'interesse censito in questa località.";
    return;
  }
  const completed = Discovery.completed(location.id);
  const remaining = points.filter(point => !completed.includes(point.id));
  message.textContent = remaining.length
    ? `${remaining.length} punto/i d'interesse ancora da esaminare. Le scoperte già registrate restano tali anche dopo aver lasciato la zona.`
    : "Hai già esaminato tutti i punti d'interesse noti di questa località.";

  // Gli stessi punti d'interesse sono disponibili anche dal feed centrale:
  // la scena diventa un ingresso funzionale al sistema, non una semplice illustrazione.
  const hotspots = document.getElementById("scene-hotspots");
  if (hotspots) {
    hotspots.replaceChildren();
    if (!points.length) {
      const empty = document.createElement("span");
      empty.className = "hotspot-empty";
      empty.textContent = "NESSUN PUNTO D'INTERESSE MAPPATO";
      hotspots.appendChild(empty);
    } else {
      const label = document.createElement("div");
      label.className = "hotspot-heading";
      label.textContent = "PUNTI D'INTERESSE // FEED LOCALE";
      hotspots.appendChild(label);
      for (const point of points) {
        const done = completed.includes(point.id);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "scene-hotspot";
        button.dataset.pointId = point.id;
        button.disabled = done || this.isTravelling || this.isActing || this.player.energy < point.energy;
        const marker = document.createElement("span");
        marker.className = `hotspot-marker${done ? " is-done" : ""}`;
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = done ? "✓" : "+";
        const title = document.createElement("span");
        title.className = "hotspot-title";
        title.textContent = point.title;
        const state = document.createElement("small");
        state.textContent = done ? "REGISTRATO" : `${point.minutes} MIN · ${point.energy} EN`; 
        button.append(marker, title, state);
        button.addEventListener("click", () => this.examinePoint(point));
        hotspots.appendChild(button);
      }
    }
  }

  for (const point of points) {
    const card = document.createElement("article");
    card.className = "poi-card";
    const title = document.createElement("strong");
    title.textContent = point.title;
    const description = document.createElement("p");
    description.textContent = point.description;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button secondary-button";
    const done = completed.includes(point.id);
    button.textContent = done ? "ESAMINATO" : `${point.action} · ${point.minutes} min`;
    button.disabled = done || this.isTravelling || this.isActing || this.player.energy < point.energy;
    button.addEventListener("click", () => this.examinePoint(point));
    card.append(title, description, button);
    container.appendChild(card);
  }
}

examinePoint(point) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;
  const locationId = this.world.currentLocation?.id;
  if (!locationId || Discovery.completed(locationId).includes(point.id)) return;
  if (this.player.energy < point.energy) {
    this.showError("Non hai energia sufficiente per esaminare questo luogo.");
    return;
  }
  this.isActing = true;
  try {
    this.player.updateStats({ energy: this.player.energy - point.energy });
    this.advanceWorldTime(point.minutes);
    Discovery.complete(locationId, point.id);
    FieldNotebook.add({
      locationId,
      locationName: this.world.currentLocation.name,
      title: point.title,
      detail: point.result,
      category: "Punto d'interesse",
      sourceType: "direct",
      context: `Esame diretto di un punto d'interesse a ${this.world.currentLocation.name}`,
      timestamp: this.worldClock.getFormattedDateTime()
    });
    this.eventLog.add(`Punto d'interesse: ${point.title}. ${point.result}`, this.worldClock.getFormattedDateTime());
    this.showNotice(point.result);
  } catch (error) {
    this.showError(error.message || "Non riesci a esaminare il luogo.");
  } finally {
    this.isActing = false;
    this.render();
  }
}

renderFieldNotebook() {
  const container = document.getElementById("field-notebook");
  const message = document.getElementById("notebook-message");
  if (!container || !message) return;
  container.replaceChildren();
  const entries = FieldNotebook.entries();
  message.textContent = entries.length
    ? `${entries.length} annotazione/i conservate nel taccuino. Le osservazioni più recenti compaiono per prime.`
    : "Le scoperte, le tracce e gli avvistamenti importanti verranno annotati qui.";

  // Primo caso giocabile: obiettivi derivati dalle testimonianze e dalle scoperte reali.
  const caseData = northTrailCase();
  const caseCard = document.createElement("article");
  caseCard.className = "investigation-case";
  const caseLabel = document.createElement("div");
  caseLabel.className = "readout-label";
  caseLabel.textContent = "DOSSIER ATTIVO // INDAGINE LOCALE";
  const caseTitle = document.createElement("h3");
  caseTitle.textContent = caseData.title;
  const caseStatus = document.createElement("p");
  caseStatus.className = "investigation-case-status";
  caseStatus.textContent = `${caseData.progress}/3 tappe · ${caseData.status}`;
  const caseSteps = document.createElement("ol");
  caseSteps.className = "investigation-case-steps";
  for (const step of caseData.steps) {
    const item = document.createElement("li");
    item.dataset.complete = String(step.done);
    const mark = document.createElement("span");
    mark.className = "case-step-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = step.done ? "[x]" : "[ ]";
    const text = document.createElement("span");
    text.textContent = step.text;
    item.append(mark, text);
    caseSteps.appendChild(item);
  }
  const conclusion = document.createElement("p");
  conclusion.className = "investigation-case-conclusion";
  conclusion.textContent = caseData.conclusion;
  caseCard.append(caseLabel, caseTitle, caseStatus, caseSteps, conclusion);
  container.appendChild(caseCard);

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "notebook-empty";
    empty.textContent = "Nessuna annotazione. Il territorio non è ancora stato documentato.";
    container.appendChild(empty);
    return;
  }
  for (const entry of entries) {
    const card = document.createElement("article");
    card.className = "notebook-entry";
    card.dataset.category = String(entry.category || "Osservazione");
    const title = document.createElement("strong");
    title.textContent = entry.title;
    const meta = document.createElement("span");
    meta.className = "notebook-meta";
    meta.textContent = [entry.category, entry.locationName, entry.timestamp].filter(Boolean).join(" / ");
    const detail = document.createElement("p");
    detail.textContent = entry.detail;
    card.append(title, meta, detail);
    container.appendChild(card);
  }
  const search = document.getElementById("notebook-search");
  const query = (search?.value || "").trim().toLocaleLowerCase("it");
  for (const card of container.querySelectorAll(".notebook-entry")) {
    const haystack = card.textContent.toLocaleLowerCase("it");
    card.hidden = Boolean(query) && !haystack.includes(query);
  }
}

renderEncounter() {
  const section = document.getElementById("encounter-section");
  const description = document.getElementById("encounter-description");
  const message = document.getElementById("encounter-message");
  const options = document.getElementById("encounter-options");
  if (!section || !description || !message || !options) return;
  options.replaceChildren();
  section.hidden = !this.currentEncounter;
  const card = section.closest(".context-card");
  if (card) card.hidden = !this.currentEncounter;
  if (!this.currentEncounter) return;
  if (card) card.open = true;
  description.textContent = this.currentEncounter.description;
  message.textContent = "Non sai ancora se si tratti di un pericolo, di un Pokémon spaventato o di un altro viaggiatore.";
  const choices = [
    { id: "observe", label: "Osserva da lontano · 10 min, 2 energia" },
    { id: "approach", label: "Avvicinati con cautela · 20 min, 5 energia" },
    { id: "retreat", label: "Allontanati senza attirare attenzione" }
  ];
  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button secondary-button";
    button.textContent = choice.label;
    const cost = choice.id === "observe" ? 2 : choice.id === "approach" ? 5 : 0;
    button.disabled = this.isTravelling || this.isActing || this.player.energy < cost;
    button.addEventListener("click", () => this.resolveEncounter(choice.id));
    options.appendChild(button);
  }
}

resolveEncounter(choice) {
  if (!this.isRunning || this.isTravelling || this.isActing || !this.currentEncounter) return;
  const costs = { observe: { minutes: 10, energy: 2 }, approach: { minutes: 20, energy: 5 }, retreat: { minutes: 0, energy: 0 } };
  const cost = costs[choice];
  if (!cost) return;
  if (this.player.energy < cost.energy) {
    this.showError("Non hai energia sufficiente per gestire l'incontro.");
    return;
  }
  this.isActing = true;
  try {
    if (cost.energy) this.player.updateStats({ energy: this.player.energy - cost.energy });
    if (cost.minutes) this.advanceWorldTime(cost.minutes);
    const encounterText = this.currentEncounter.description.toLowerCase();
    const locationId = this.currentEncounter.locationId || this.world.currentLocation?.id;
    const locationName = this.world.currentLocation?.name || "Località sconosciuta";
    let title = "Presenza non identificata";
    let category = "Avvistamento";
    let result;
    if (/impronte umane|persona|viaggiator|finestra|muro|segno recente|edificio/.test(encounterText)) {
      title = "Possibile presenza umana";
      category = "Traccia umana";
      if (choice === "observe") result = "Da una posizione riparata distingui un passaggio recente, ma non riesci a stabilire quante persone siano coinvolte. Annoti il punto e non lasci segnali della tua presenza.";
      else if (choice === "approach") result = "Ti avvicini abbastanza da trovare segni di un passaggio, ma nessuno si mostra. La zona potrebbe essere frequentata: non lasci oggetti in vista e ti allontani senza insistere.";
      else result = "Eviti il contatto. La presenza resta non identificata; annoti mentalmente la zona senza avvicinarti.";
    } else if (/pokémon|verso di pok|sagoma di pok|piccolo pok/.test(encounterText)) {
      title = "Comportamento di un Pokémon";
      category = "Fauna";
      if (choice === "observe") result = "Restando immobile, noti che il Pokémon cerca riparo e mantiene una via di fuga. Non sembra interessato a seguirti. Evitare movimenti bruschi è la scelta più prudente.";
      else if (choice === "approach") result = "Il Pokémon si ritira nella vegetazione prima che tu possa avvicinarti. Non lo insegui: forzare il contatto potrebbe ferire entrambi.";
      else result = "Ti allontani lentamente e lasci libera la via di fuga. Il Pokémon scompare senza seguirti.";
    } else {
      title = "Segnale ambientale";
      category = "Ambiente";
      if (choice === "observe") result = "Aspetti in silenzio e cerchi di distinguere il rumore dal fondo ambientale. Il segnale non si ripete; registri l'area come incerta, non come sicura.";
      else if (choice === "approach") result = "Controlli il punto da cui proveniva il rumore, senza trovare una causa certa. Non ti addentri oltre: l'assenza di prove non significa assenza di rischio.";
      else result = "Decidi di non verificare il segnale e ti sposti verso un tratto più aperto. La causa resta sconosciuta.";
    }
    FieldNotebook.add({ locationId, locationName, title, detail: result, category, timestamp: this.worldClock.getFormattedDateTime() });
    this.eventLog.add(`Incontro gestito: ${result}`, this.worldClock.getFormattedDateTime());
    this.currentContact = null;
    if (choice === "approach" && category === "Traccia umana") {
      const contact = ContactRegistry.meet(locationId);
      if (contact) {
        this.currentContact = contact;
        this.eventLog.add(`Contatto stabilito: ${contact.name}, ${contact.role}.`, this.worldClock.getFormattedDateTime());
        FieldNotebook.add({ locationId, locationName, title: `Contatto incontrato: ${contact.name}`, detail: `${contact.role}. ${contact.intro}`, category: "Contatto", sourceType: "character", sourceName: contact.name, context: "Primo incontro con il personaggio", timestamp: this.worldClock.getFormattedDateTime() });
      }
    }
    this.currentEncounter = null;
    this.showNotice(this.currentContact ? `Hai incontrato ${this.currentContact.name}. Puoi parlare senza pretendere subito fiducia.` : result);
  } catch (error) {
    this.showError(error.message || "Non riesci a gestire l'incontro.");
  } finally {
    this.isActing = false;
    this.render();
  }
}

renderContact() {
  const section = document.getElementById("contact-section");
  const name = document.getElementById("contact-name");
  const role = document.getElementById("contact-role");
  const intro = document.getElementById("contact-intro");
  const message = document.getElementById("contact-message");
  const options = document.getElementById("contact-options");
  if (!section || !name || !role || !intro || !message || !options) return;
  options.replaceChildren();

  const localContact = ContactRegistry.at(this.world.currentLocation?.id);
  const contact = this.currentContact || localContact;
  section.hidden = !contact;
  const card = section.closest(".context-card");
  if (card) card.hidden = !contact;
  if (!contact) return;
  if (card && this.currentContact) card.open = true;

  name.textContent = contact.name;
  role.textContent = contact.role;
  intro.textContent = contact.intro;

  if (!this.currentContact) {
    message.textContent = contact.metAt
      ? "Sei già stato qui. Puoi riprendere il contatto, senza ricominciare da zero."
      : "Una persona si trova in questa zona. Puoi provare ad avvicinarti: non è necessario aspettare un avvistamento casuale.";
    const approach = document.createElement("button");
    approach.type = "button";
    approach.className = "action-button";
    approach.textContent = contact.metAt ? `Raggiungi ${contact.name}` : `Avvicinati a ${contact.name} · 5 min`;
    approach.disabled = this.isTravelling || this.isActing || (!contact.metAt && this.player.energy < 1);
    approach.addEventListener("click", () => this.approachLocalContact());
    options.appendChild(approach);
    return;
  }

  message.textContent = contact.informationHeard
    ? "Avete già scambiato le informazioni disponibili per ora. Non c'è motivo di ripetere la stessa domanda."
    : "Il contatto è prudente. Puoi ascoltare quello che ha da dire oppure lasciarlo in pace.";
  const talk = document.createElement("button");
  talk.type = "button"; talk.className = "action-button secondary-button"; talk.textContent = "Scambia qualche parola · 5 min";
  talk.disabled = this.isTravelling || this.isActing;
  talk.addEventListener("click", () => this.talkToContact());
  const ask = document.createElement("button");
  ask.type = "button"; ask.className = "action-button secondary-button"; ask.textContent = contact.informationHeard ? "Informazioni già condivise" : "Chiedi informazioni · 10 min, 2 energia";
  ask.disabled = contact.informationHeard || this.isTravelling || this.isActing || this.player.energy < 2;
  ask.addEventListener("click", () => this.askContactInformation());
  options.append(talk, ask);
  if (ContactRegistry.canCompareTrailClues(contact.id)) {
    const compare = document.createElement("button");
    compare.type = "button";
    compare.className = "action-button secondary-button";
    compare.textContent = "Confronta gli indizi · 5 min";
    compare.disabled = this.isTravelling || this.isActing;
    compare.addEventListener("click", () => this.compareTrailClues());
    options.appendChild(compare);
  }
  const leave = document.createElement("button");
  leave.type = "button"; leave.className = "action-button secondary-button"; leave.textContent = "Concludi l'incontro";
  leave.disabled = this.isTravelling || this.isActing;
  leave.addEventListener("click", () => { this.currentContact = null; this.render(); });
  options.appendChild(leave);
}

approachLocalContact() {
  if (!this.isRunning || this.isTravelling || this.isActing || this.currentContact) return;
  const contact = ContactRegistry.at(this.world.currentLocation?.id);
  if (!contact) return;
  this.isActing = true;
  try {
    if (!contact.metAt) {
      if (this.player.energy < 1) throw new Error("Non hai energia sufficiente per avvicinarti.");
      this.player.updateStats({ energy: this.player.energy - 1 });
      this.advanceWorldTime(5);
      this.currentContact = ContactRegistry.meet(contact.locationId);
      this.currentContact.metAt = this.worldClock.getFormattedDateTime();
      ContactRegistry.recordMeeting(this.currentContact.id, this.currentContact.metAt);
      const locationName = this.world.currentLocation?.name || "Località sconosciuta";
      this.eventLog.add(`Contatto stabilito: ${contact.name}, ${contact.role}.`, this.worldClock.getFormattedDateTime());
      FieldNotebook.add({ locationId: contact.locationId, locationName, title: `Contatto incontrato: ${contact.name}`, detail: `${contact.role}. ${contact.intro}`, category: "Contatto", sourceType: "character", sourceName: contact.name, context: "Primo incontro con il personaggio", timestamp: this.worldClock.getFormattedDateTime() });
      this.showNotice(`Ti avvicini a ${contact.name}. La conversazione è iniziata.`);
    } else {
      this.currentContact = ContactRegistry.meet(contact.locationId);
      this.showNotice(`Riprendi il contatto con ${contact.name}.`);
    }
  } catch (error) {
    this.showError(error.message || "Non riesci ad avvicinarti.");
  } finally {
    this.isActing = false;
    this.render();
  }
}

talkToContact() {
  if (!this.isRunning || this.isTravelling || this.isActing || !this.currentContact) return;
  this.isActing = true;
  try {
    this.advanceWorldTime(5);
    const contact = this.currentContact;
    const text = ContactRegistry.dialogueFor(contact.id);
    ContactRegistry.recordConversation(contact.id);
    contact.conversationCount = Number(contact.conversationCount || 0) + 1;
    this.eventLog.add(`${contact.name}: «${text}»`, this.worldClock.getFormattedDateTime());
    this.showNotice(`${this.currentContact.name}: ${text}`);
  } catch (error) { this.showError(error.message || "La conversazione si interrompe."); }
  finally { this.isActing = false; this.render(); }
}

compareTrailClues() {
  if (!this.isRunning || this.isTravelling || this.isActing || !this.currentContact) return;
  const contact = this.currentContact;
  const comparison = ContactRegistry.trailClueComparisonFor(contact.id);
  if (!comparison) {
    this.showNotice("Non hai ancora raccolto entrambe le testimonianze necessarie.");
    return;
  }
  this.isActing = true;
  try {
    this.advanceWorldTime(5);
    ContactRegistry.markTrailCluesCompared(contact.id);
    const locationName = this.world.currentLocation?.name || "Località sconosciuta";
    FieldNotebook.add({
      locationId: this.world.currentLocation?.id,
      locationName,
      title: `Confronto di testimonianze con ${contact.name}`,
      detail: comparison,
      category: "Confronto di fonti",
      sourceType: "mixed",
      sourceName: `${contact.name} e Mara/Elio`,
      context: "Confronto esplicito tra testimonianze raccolte in località diverse; compatibilità non equivale a conferma indipendente.",
      timestamp: this.worldClock.getFormattedDateTime()
    });
    this.eventLog.add(`${contact.name} confronta con te le testimonianze: ${comparison}`, this.worldClock.getFormattedDateTime());
    this.showNotice(comparison);
  } catch (error) {
    this.showError(error.message || "Non riesci a confrontare le testimonianze.");
  } finally {
    this.isActing = false;
    this.render();
  }
}

askContactInformation() {
  if (!this.isRunning || this.isTravelling || this.isActing || !this.currentContact) return;
  if (this.currentContact.informationHeard || this.player.energy < 2) {
    this.showError(this.currentContact.informationHeard ? "Hai già raccolto le informazioni disponibili." : "Non hai energia sufficiente.");
    return;
  }
  this.isActing = true;
  try {
    this.player.updateStats({ energy: this.player.energy - 2 });
    this.advanceWorldTime(10);
    const contact = this.currentContact;
    const information = ContactRegistry.informationFor(contact.id);
    ContactRegistry.markInformationHeard(contact.id);
    contact.informationHeard = true;
    contact.information = information;
    FieldNotebook.add({ locationId: contact.locationId, locationName: this.world.currentLocation?.name, title: `Informazione da ${contact.name}`, detail: information, category: "Informazione", sourceType: "character", sourceName: contact.name, context: `Informazione ricevuta durante un colloquio a ${this.world.currentLocation?.name || "località sconosciuta"}`, timestamp: this.worldClock.getFormattedDateTime() });
    this.eventLog.add(`${contact.name} condivide un'informazione: ${information}`, this.worldClock.getFormattedDateTime());
    this.showNotice(information);
  } catch (error) { this.showError(error.message || "Non riesci a raccogliere informazioni."); }
  finally { this.isActing = false; this.render(); }
}

renderScavenging() {
  const container = document.getElementById("scavenging-options");
  const message = document.getElementById("scavenging-message");

  if (!container || !message) return;

  container.replaceChildren();

  // La località è già stata caricata da start() o travelTo().
  const location = this.world.currentLocation;
  const sources = location?.scavenging ?? [];

  if (sources.length === 0) {
    message.textContent = "Non risultano risorse censite qui.";
    return;
  }

  let availableCount = 0;

  for (const source of sources) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button";
    button.textContent = source.label ?? "Risorsa da cercare";

    const collected = this.player.hasCollectedSource(source.id);
    const itemExists = Boolean(ITEMS[source.itemId]);

    if (collected) {
      button.textContent += " [ESAURITO]";
      button.disabled = true;
    } else if (!itemExists) {
      button.textContent += " [DATI NON VALIDI]";
      button.disabled = true;
    } else {
      availableCount += 1;
      button.disabled =
        this.isTravelling ||
        this.isActing ||
        this.player.energy < 10;
    }

    button.addEventListener("click", () => {
      this.scavenge(source.id);
    });

    container.appendChild(button);
  }

  message.textContent =
    availableCount > 0
      ? `La ricerca costa 10 energia e richiede 30 minuti. Capacità inventario: ${this.player.inventory.getWeightKg().toFixed(1)} / ${this.player.inventory.constructor.MAX_WEIGHT_KG} kg.`
      : "Non ci sono altre risorse disponibili in questa località.";
}


scavenge(sourceId) {
  if (!this.isRunning || this.isTravelling || this.isActing) return;

  const location = this.world.currentLocation;
  const sources = location?.scavenging ?? [];

  const source = sources.find((entry) => entry.id === sourceId);

  if (!source || !ITEMS[source.itemId]) {
    this.showError("Risorsa non valida o non disponibile.");
    return;
  }

  if (this.player.hasCollectedSource(source.id)) {
    this.showError("Questa risorsa è già stata raccolta.");
    this.renderScavenging();
    return;
  }

  if (this.player.energy < 10) {
    this.showError("Non hai energia sufficiente per cercare risorse.");
    return;
  }

  if (!this.player.inventory.canAdd(source.itemId, source.quantity)) {
    this.showError(`Non hai spazio sufficiente. Peso attuale: ${this.player.inventory.getWeightKg().toFixed(1)} / ${this.player.inventory.constructor.MAX_WEIGHT_KG} kg.`);
    return;
  }

  this.isActing = true;
  this.setBusyStatus("SCAVENGING", "BUSY");

  try {
    this.player.updateStats({
      energy: this.player.energy - 10
    });

    this.player.collectItem(source.itemId, source.quantity);
    this.player.markSourceCollected(source.id);

    this.advanceWorldTime(30);

    const item = ITEMS[source.itemId];
    const message =
      `${this.player.name} ha trovato ${source.quantity} × ${item.name}.`;

    this.eventLog.add(
      message,
      this.worldClock.getFormattedDateTime()
    );

    this.showNotice(message);
  } catch (error) {
    console.error(error);
    this.showError(error.message || "La ricerca non è riuscita.");
  } finally {
    this.isActing = false;
    this.setBusyStatus("RUNNING", "ONLINE");
    this.render();
  }
}

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.worldClock.stop();
    this.isRunning = false;

    const status = document.getElementById("engine-status");

    if (status) {
      status.textContent = "STOPPED";
    }
  }
}
