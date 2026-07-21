const input=document.getElementById("searchBox");

if(input){

input.addEventListener("input",()=>{

const value=input.value.toLowerCase();

document.querySelectorAll(".seed-list li")

.forEach(li=>{

li.style.display=

li.textContent

.toLowerCase()

.includes(value)

?

"block"

:

"none";

});

});

}