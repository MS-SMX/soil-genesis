document.addEventListener("DOMContentLoaded",()=>{

const clear=document.querySelector("#clear-filters");

if(!clear) return;

clear.addEventListener("click",()=>{

document
.querySelectorAll("#explorer-filters input[type=checkbox]")
.forEach(box=>box.checked=false);

const search=document.querySelector("#seed-search");

if(search){

search.value="";

SG.search="";

}

document.dispatchEvent(

new CustomEvent("sg:update")

);

});

});