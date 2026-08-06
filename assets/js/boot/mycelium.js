window.SG = window.SG || {};

SG.mycelium = {

container:null,

svg:null,

branches:[],

init(){

this.container=document.querySelector("#boot-mycelium");

if(!this.container)return;

this.svg=document.createElementNS(
"http://www.w3.org/2000/svg",
"svg"
);

this.svg.setAttribute("viewBox","0 0 1000 600");

this.svg.style.width="100%";
this.svg.style.height="100%";

this.container.appendChild(this.svg);

},

grow(){

if(!this.svg)return;

const x=500+(Math.random()-0.5)*220;
const y=300+(Math.random()-0.5)*180;

const line=document.createElementNS(
"http://www.w3.org/2000/svg",
"line"
);

line.setAttribute("x1",500);
line.setAttribute("y1",300);

line.setAttribute("x2",500);
line.setAttribute("y2",300);

line.setAttribute("stroke","var(--primary)");
line.setAttribute("stroke-width","1");

this.svg.appendChild(line);

requestAnimationFrame(()=>{

line.setAttribute("x2",x);
line.setAttribute("y2",y);

});

}

};

document.addEventListener(

"DOMContentLoaded",

()=>{

SG.mycelium.init();

});

window.SG=window.SG||{};

SG.mycelium={

start(){

const el=document.querySelector("#boot-mycelium");

if(el){

el.style.opacity=.45;

}

}

};