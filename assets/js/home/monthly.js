document.addEventListener("DOMContentLoaded", () => {

const months=document.querySelectorAll(".season-month");
const panels=document.querySelectorAll(".month-panel");

if(!months.length) return;

months.forEach(month=>{

month.addEventListener("click",()=>{

const target=month.dataset.month;

months.forEach(m=>m.classList.remove("active"));

month.classList.add("active");

panels.forEach(panel=>{

panel.classList.remove("active");

});

const current=document.querySelector(

`.month-panel[data-month="${target}"]`

);

if(current){

current.classList.add("active");

}

});

});

});