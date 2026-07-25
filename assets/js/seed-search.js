document.addEventListener("DOMContentLoaded",()=>{

const input=document.querySelector("#filter-name");

if(!input)return;

const cards=document.querySelectorAll(".explorer-card");

input.addEventListener("input",()=>{

const value=input.value.toLowerCase();

cards.forEach(card=>{

card.style.display=

card.dataset.name.includes(value)

? ""

: "none";

});

});

});