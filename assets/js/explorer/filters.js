window.SG = window.SG || {};

document.addEventListener("change",()=>{

document.dispatchEvent(

new CustomEvent("sg:update")

);

});

document.addEventListener("sg:update",()=>{

const active={};

document

.querySelectorAll(

"#explorer-filters input:checked"

)

.forEach(box=>{

const key=box.dataset.filter;

active[key]=active[key]||[];

active[key].push(box.value);

});

SG.archive.forEach(seed=>{

let visible=true;

if(

SG.search.length &&

!seed.text.includes(SG.search)

){

visible=false;

}

Object.entries(active).forEach(

([key,list])=>{

if(

list.length &&

!list.includes(seed[key])

){

visible=false;

}

}

);

seed.element.style.display=

visible

? ""

:"none";

});


const counter=document.querySelector("#explorer-count");

if(counter){

counter.textContent=

SG.archive.filter(seed=>

seed.element.style.display !== "none"

).length;

}

});

