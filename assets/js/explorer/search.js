window.SG = window.SG || {};

SG.search="";

const input=document.querySelector("#seed-search");

if(input){

input.addEventListener("input",e=>{

SG.search=e.target.value.toLowerCase();

document.dispatchEvent(

new CustomEvent("sg:update")

);

});

}