window.SG = window.SG || {};

SG.filters={};

function unique(field){

return [...new Set(

SG.archive

.flatMap(seed =>

(seed[field] || "").split("|")

)

.filter(Boolean)

)].sort();

}
function buildFilters(){

const root=document.querySelector("#explorer-filters");

if(!root)return;

const sections=[

["Conservazione","status"],

["Famiglia","family"],

["Ciclo di vita","cycle"],

["Impollinazione","pollination"]

];

sections.forEach(([title,key])=>{

const group=document.createElement("div");

group.className="filter-group";

group.innerHTML=`<h4>${title}</h4>`;

unique(key).forEach(value=>{

const id=`${key}-${value}`;

group.innerHTML+=`

<label>

<input
type="checkbox"

data-filter="${key}"

value="${value}"

id="${id}">

${value.replaceAll("-"," ")}

</label>

`;

});

root.appendChild(group);

});

}

function buildFilters(){

const root=document.querySelector("#explorer-filters");

if(!root)return;

root.innerHTML="";}

SG.kernel.register("sidebar",{

build:buildFilters

});