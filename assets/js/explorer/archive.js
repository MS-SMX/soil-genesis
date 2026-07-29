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