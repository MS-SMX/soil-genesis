(() => {
  "use strict";
  const root = document.getElementById("sg-mycelium-map");
  if (!root) return;
  const seeds = Array.isArray(window.SG_MYceliumSeeds) ? window.SG_MYceliumSeeds : [];
  const svg = root.querySelector("#mycelium-svg");
  const search = root.querySelector("#mycelium-search");
  const familySelect = root.querySelector("#mycelium-family");
  const countLabel = root.querySelector("#mycelium-visible-count");
  const inspectorTitle = root.querySelector("#mycelium-inspector-title");
  const inspectorCopy = root.querySelector("#mycelium-inspector-copy");
  const inspectorData = root.querySelector("#mycelium-inspector-data");
  const dossierLink = root.querySelector("#mycelium-open-dossier");
  const NS = "http://www.w3.org/2000/svg";
  const W = 1400, H = 1080, COLS = 4, CELL_W = 350, CELL_H = 270;
  const normalize = value => String(value || "").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const familyName = value => String(value || "non classificata").trim().toLocaleLowerCase("it");
  const statusKey = value => normalize(value).replace(/[\s-]+/g, "_");
  const families = new Map();
  seeds.forEach((seed, index) => {
    seed.family = familyName(seed.family);
    seed.statusKey = statusKey(seed.status);
    seed.index = index;
    if (!families.has(seed.family)) families.set(seed.family, []);
    families.get(seed.family).push(seed);
  });
  const sortedFamilies = [...families.keys()].sort((a,b) => a.localeCompare(b, "it"));
  sortedFamilies.forEach(family => {
    const option = document.createElement("option");
    option.value = family; option.textContent = family.toLocaleUpperCase("it");
    familySelect.appendChild(option);
  });
  const make = (tag, attrs = {}, text = "") => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key,value]) => el.setAttribute(key, String(value)));
    if (text) el.textContent = text;
    return el;
  };
  const edges = new Map(), nodes = new Map(), hubs = new Map();
  const familyOrder = new Map(sortedFamilies.map((f,i) => [f,i]));
  sortedFamilies.forEach(family => {
    const familyIndex = familyOrder.get(family);
    const col = familyIndex % COLS, row = Math.floor(familyIndex / COLS);
    const cx = col * CELL_W + CELL_W / 2;
    const cy = row * CELL_H + CELL_H / 2 + 8;
    const group = make("g", {class:"mycelium-family-group", "data-family":family});
    const edgeGroup = make("g", {"aria-hidden":"true"});
    const nodeGroup = make("g", {});
    const hub = make("g", {class:"mycelium-hub", tabindex:"0", role:"button", "aria-label":"Filtra famiglia " + family, "data-family":family});
    hub.appendChild(make("circle", {cx,cy,r:33}));
    const label = family.toLocaleUpperCase("it").replace(/&/g,"&amp;");
    const text = make("text", {x:cx,y:cy-2}, label.length > 19 ? label.slice(0,17) + "…" : label);
    hub.appendChild(text);
    hub.appendChild(make("text", {class:"hub-count",x:cx,y:cy+15}, String(families.get(family).length) + " ACCESSIONI"));
    const groupSeeds = families.get(family);
    groupSeeds.forEach((seed, i) => {
      const ring = Math.floor(i / 8);
      const inRing = i % 8;
      const nInRing = Math.min(8, groupSeeds.length - ring * 8);
      const angle = (Math.PI * 2 * inRing / nInRing) - Math.PI / 2 + (ring ? Math.PI / nInRing : 0);
      const radiusX = ring === 0 ? (groupSeeds.length > 8 ? 76 : 92) : 115;
      const radiusY = ring === 0 ? (groupSeeds.length > 8 ? 53 : 68) : 78;
      const x = cx + Math.cos(angle) * radiusX;
      const y = cy + Math.sin(angle) * radiusY;
      const edge = make("line", {class:"mycelium-edge",x1:cx,y1:cy,x2:x,y2:y,"data-family":family,"data-seed":seed.slug});
      edgeGroup.appendChild(edge); edges.set(seed.slug, edge);
      const node = make("g", {class:"mycelium-node",tabindex:"0",role:"button","aria-label":"Apri dettagli " + seed.name,"data-family":family,"data-seed":seed.slug,"data-status":seed.statusKey});
      node.appendChild(make("circle",{cx:x,cy:y,r:5.2}));
      const title = make("title",{},seed.name + (seed.scientific ? " · " + seed.scientific : "")); node.appendChild(title);
      node.addEventListener("click", () => selectSeed(seed));
      node.addEventListener("keydown", event => { if(event.key === "Enter" || event.key === " "){event.preventDefault();selectSeed(seed);} });
      nodeGroup.appendChild(node); nodes.set(seed.slug,node);
    });
    hub.addEventListener("click", () => {familySelect.value = family; renderFilter(); selectFamily(family);});
    hub.addEventListener("keydown", event => {if(event.key === "Enter" || event.key === " "){event.preventDefault();familySelect.value=family;renderFilter();selectFamily(family);}});
    group.append(edgeGroup,nodeGroup,hub); svg.appendChild(group); hubs.set(family,hub);
  });
  function addData(label, value) {
    const row = document.createElement("div"); row.className = "mycelium-data-row";
    const name = document.createElement("span"); name.className = "mycelium-data-label"; name.textContent = label;
    const content = document.createElement("span"); content.className = "mycelium-data-value"; content.textContent = value || "Non registrato";
    row.append(name,content); inspectorData.appendChild(row);
  }
  function selectSeed(seed) {
    inspectorTitle.textContent = seed.name || "Accessione";
    inspectorCopy.textContent = seed.scientific || "Nome scientifico non registrato";
    inspectorData.replaceChildren();
    addData("Famiglia botanica", seed.family);
    addData("Ciclo di vita", seed.life);
    addData("Stato di conservazione", seed.status);
    dossierLink.href = seed.url || "#"; dossierLink.hidden = !seed.url;
    nodes.forEach((node, slug) => node.classList.toggle("is-selected", slug === seed.slug));
    edges.forEach((edge, slug) => edge.classList.toggle("is-active", slug === seed.slug));
    hubs.forEach((hub, family) => hub.classList.toggle("is-active", family === seed.family));
  }
  function selectFamily(family) {
    inspectorTitle.textContent = family.toLocaleUpperCase("it");
    inspectorCopy.textContent = "Nucleo botanico · " + families.get(family).length + " accessioni nell’archivio.";
    inspectorData.replaceChildren();
    addData("Accessioni", String(families.get(family).length));
    addData("Relazione mostrata", "Appartenenza alla stessa famiglia botanica");
    dossierLink.hidden = true;
    nodes.forEach((node, slug) => node.classList.toggle("is-selected", false));
    edges.forEach(edge => edge.classList.toggle("is-active", edge.getAttribute("data-family") === family));
    hubs.forEach((hub, key) => hub.classList.toggle("is-active", key === family));
  }
  function renderFilter() {
    const q = normalize(search.value), family = familySelect.value;
    let visible = 0;
    seeds.forEach(seed => {
      const match = (!family || seed.family === family) && (!q || normalize([seed.name,seed.scientific,seed.family].join(" ")).includes(q));
      const node = nodes.get(seed.slug), edge = edges.get(seed.slug);
      node.classList.toggle("is-muted", !match);
      edge.classList.toggle("is-muted", !match);
      if (match) visible++;
    });
    hubs.forEach((hub,key) => {
      const familyMatches = !family || key === family;
      const queryMatches = !q || normalize(key).includes(q) || families.get(key).some(seed => normalize(seed.name + " " + seed.scientific).includes(q));
      hub.style.opacity = familyMatches && queryMatches ? "1" : ".24";
      hub.style.pointerEvents = familyMatches && queryMatches ? "auto" : "none";
    });
    countLabel.textContent = visible + " / " + seeds.length + " ACCESSIONI VISIBILI";
  }
  search.addEventListener("input", renderFilter);
  familySelect.addEventListener("change", () => {renderFilter(); if(familySelect.value) selectFamily(familySelect.value); else {inspectorTitle.textContent="RETE COMPLETA";inspectorCopy.textContent="Seleziona una famiglia o un’accessione per ispezionare i dettagli.";inspectorData.replaceChildren();dossierLink.hidden=true;hubs.forEach(h=>h.classList.remove("is-active"));edges.forEach(e=>e.classList.remove("is-active"));nodes.forEach(n=>n.classList.remove("is-selected"));}});
  root.querySelector("#mycelium-reset").addEventListener("click", () => {search.value="";familySelect.value="";renderFilter();inspectorTitle.textContent="SELEZIONA UN NODO";inspectorCopy.textContent="Seleziona un nucleo familiare per filtrare la rete oppure un nodo per aprire i dati dell’accessione.";inspectorData.replaceChildren();dossierLink.hidden=true;hubs.forEach(h=>h.classList.remove("is-active"));edges.forEach(e=>e.classList.remove("is-active"));nodes.forEach(n=>n.classList.remove("is-selected"));});
  renderFilter();
  if (!seeds.length) { countLabel.textContent = "NESSUNA ACCESSIONE TROVATA"; inspectorCopy.textContent = "Il grafo verrà popolato quando Jekyll renderizzerà i dossier della collezione seeds."; }
})();
