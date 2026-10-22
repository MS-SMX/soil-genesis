
export default class Location {
  constructor(data) {
    if (
      !data ||
      typeof data.id !== "string" ||
      typeof data.name !== "string"
    ) {
      throw new TypeError(
        "Dati della località non validi: servono id e name."
      );
    }

    this.id = data.id;
    this.name = data.name;
    this.description = data.description ?? "";
    this.connections = Array.isArray(data.connections)
      ? data.connections
      : [];
    this.weather = data.weather ?? "unknown";
    this.scavenging = Array.isArray(data.scavenging)
      ? data.scavenging
      : [];
  }
}
