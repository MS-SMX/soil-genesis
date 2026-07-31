document.addEventListener("DOMContentLoaded", () => {

const search = document.querySelector("#seed-search");
const cards = [...document.querySelectorAll(".explorer-card")];
const container = document.querySelector("#explorer-filters");

const counter = document.querySelector("#results-count");
const clear = document.querySelector("#clear-filters");

if (!container || cards.length === 0) return;

const FILTERS = [

{
title:"Conservazione",
attribute:"status"
},

{
title:"Famiglia",
attribute:"family"
},

{
title:"Ciclo di vita",
attribute:"cycle"
},

{
title:"Impollinazione",
attribute:"pollination"
}

];

FILTERS.forEach(filter=>{

const values=[...new Set(

cards
.map(card=>card.dataset[filter.attribute])
.filter(Boolean)

)].sort();

if(values.length===0) return;

const group=document.createElement("div");
group.className="filter-group";

const title=document.createElement("h4");
title.textContent=filter.title;

group.appendChild(title);

values.forEach(value=>{

const label=document.createElement("label");

const input=document.createElement("input");

input.type="checkbox";
input.dataset.filter=filter.attribute;
input.value=value;

label.appendChild(input);
label.append(" "+value.replaceAll("-"," "));

group.appendChild(label);

});

container.appendChild(group);

});

function update(){

const text=(search?.value||"").toLowerCase();

let visibleCount=0;

cards.forEach(card=>{

let visible=true;

if(text){

visible=card.textContent
.toLowerCase()
.includes(text);

}

FILTERS.forEach(filter=>{

const active=[

...container.querySelectorAll(

`input[data-filter="${filter.attribute}"]:checked`

)

].map(i=>i.value);

if(active.length){

visible=

visible &&

active.includes(card.dataset[filter.attribute]);

}

});

card.style.display=visible?"":"none";

if(visible){

visibleCount++;

}

});

if(counter){

counter.textContent=`${visibleCount} varietà`;

}

}

search?.addEventListener("input",update);

container.addEventListener("change",update);

clear?.addEventListener("click",()=>{

if(search){

search.value="";

}

container
.querySelectorAll('input[type="checkbox"]')
.forEach(c=>c.checked=false);

update();

});