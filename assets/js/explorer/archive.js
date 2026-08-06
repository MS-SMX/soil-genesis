window.SG = window.SG || {};

SG.archive = [];

document.querySelectorAll(".explorer-card").forEach(card=>{

SG.archive.push({

element:card,

text:card.textContent.toLowerCase(),

status:card.dataset.status || "",

family:card.dataset.family || "",

cycle:card.dataset.cycle || "",

pollination:card.dataset.pollination || ""

});

});

document.addEventListener(
"DOMContentLoaded",
()=>{

const counter=document.querySelector("#explorer-count");

if(counter){

counter.textContent=SG.archive.length;

}

});

function updateDashboard(){

const visible = SG.archive.filter(s=>{

return getComputedStyle(s.element).display !== "none";

});

const statSeeds = document.querySelector("#stat-seeds");
if(statSeeds){
    statSeeds.textContent = visible.length;
}

const statFamily = document.querySelector("#stat-family");
if(statFamily){
    statFamily.textContent =
    new Set(
        visible.map(s => s.family)
    ).size;
}

const statNew = document.querySelector("#stat-new");
if(statNew){
    statNew.textContent =
   visible.filter(
    s => s.status === "new-entry"
).length;
}

const statCritical = document.querySelector("#stat-critical");
if(statCritical){
    statCritical.textContent =
    visible.filter(
        s => s.status === "critico"
    ).length;
}

}


updateDashboard();

document.addEventListener("sg:update",()=>{

updateDashboard();

const visible =

SG.archive.filter(

s=>getComputedStyle(s.element).display !== "none"

).length;
const counter=document.querySelector("#explorer-count");

if(counter){

counter.textContent=visible;

}

});

function visibleSeeds(){

return SG.archive.filter(

s=>getComputedStyle(s.element).display !== "none"

);

}

const visible=visibleSeeds();

SG.kernel.register("archive",{

update:updateDashboard

});