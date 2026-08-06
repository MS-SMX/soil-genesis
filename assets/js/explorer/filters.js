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

const panel=document.querySelector("#active-filters");

if(panel){

panel.innerHTML="";

Object.entries(active).forEach(([key,list])=>{

list.forEach(value=>{

const badge=document.createElement("div");

badge.className="active-filter";

badge.innerHTML=`

${value.replaceAll("-"," ")}

<span>×</span>

`;

badge.onclick=()=>{

const checkbox=document.querySelector(

`input[data-filter="${key}"][value="${value}"]`

);

if(checkbox){

checkbox.checked=false;

document.dispatchEvent(

new CustomEvent("sg:update")

);

}

};

panel.appendChild(badge);

});

});

}

Object.entries(active).forEach(([key, list]) => {

    if (!list.length) return;

    const values = (seed[key] || "").split("|");

    const match = values.some(v => list.includes(v));

    if (!match) {

        visible = false;

    }

});

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

SG.kernel.register("filters",{});