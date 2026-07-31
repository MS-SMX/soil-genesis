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

const archive=SG.archive;

document.querySelector("#stat-seeds").textContent=

archive.length;

document.querySelector("#stat-family").textContent=

new Set(

archive.map(s=>s.family)

).size;

document.querySelector("#stat-new").textContent=

archive.filter(

s=>s.status==="new_entry"

).length;

document.querySelector("#stat-critical").textContent=

archive.filter(

s=>s.status==="critico"

).length;

}

updateDashboard();

document.addEventListener(

"sg:update",

()=>{

const visible=

SG.archive.filter(

s=>s.element.style.display!=="none"

).length;

document.querySelector(

"#explorer-count"

).textContent=visible;

});