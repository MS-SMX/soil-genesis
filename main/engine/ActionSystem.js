
export default class ActionSystem {
  constructor() {
    this.actions = {
      rest: {
        id: "rest",
        label: "Riposa",
        description: "Recupera energia e una piccola quantità di salute. Trascorrono due ore, durante le quali fame e sete aumentano.",
        durationMinutes: 120,
        energyCost: 0,
        energyRecovery: 40,
        healthRecovery: 5
      },
      explore: {
        id: "explore",
        label: "Esplora i dintorni",
        description: "Dedica mezz'ora a osservare l'area circostante. Il tempo trascorso aumenta fame e sete.",
        durationMinutes: 30,
        energyCost: 15,
        energyRecovery: 0,
        healthRecovery: 0
      }
    };
  }

  getAvailableActions(player) {
    return Object.values(this.actions).filter((action) =>
      this.canPerform(action, player)
    );
  }

  getAction(actionId) {
    return this.actions[actionId] ?? null;
  }

  canPerform(action, player) {
    if (!action || !player) return false;

    if (action.id === "rest") {
      return player.energy < 100 || player.health < 100;
    }

    return player.energy >= action.energyCost;
  }

  perform(action, player) {
    if (!this.canPerform(action, player)) {
      throw new Error(
        "Non puoi eseguire questa azione nelle condizioni attuali."
      );
    }

    player.updateStats({
      energy: player.energy - action.energyCost + action.energyRecovery,
      health: player.health + action.healthRecovery
    });

    return {
      durationMinutes: action.durationMinutes,
      actionId: action.id,
      message: this.getResultMessage(action, player)
    };
  }

  getResultMessage(action, player) {
    if (action.id === "rest") {
      return `${player.name} ha riposato. Salute: ${player.health}/100. Energia: ${player.energy}/100.`;
    }

    if (action.id === "explore") {
      return `${player.name} ha esplorato i dintorni. Energia: ${player.energy}/100.`;
    }

    return `${player.name} ha completato un'attività.`;
  }
}
