document.addEventListener("DOMContentLoaded",()=>{

document

.querySelectorAll(".sg-module")

.forEach(module=>{

const button=

module.querySelector(".sg-module-header");

button.addEventListener("click",()=>{

module.classList.toggle("collapsed");

});

});

});