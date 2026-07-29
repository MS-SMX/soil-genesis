window.SG = window.SG || {};

SG.filters={};

function unique(field){

return [...new Set(

SG.archive

.map(seed=>seed[field])

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

buildFilters();