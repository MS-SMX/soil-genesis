window.SG = window.SG || {};

SG.bootEngine={

container:null,

cursor:null,

speed:18,

wait(ms){

return new Promise(r=>setTimeout(r,ms));

},

async type(text){

const line=document.createElement("div");

line.className="boot-line";

this.container.appendChild(line);

for(const c of text){

line.textContent+=c;

await this.wait(

this.speed+

Math.random()*12


);
}

},

async execute(step){

switch(step.type){

case "typing":

await this.type(step.text);

break;

case "pause":

await this.wait(step.time);

break;

case "quote":

document.querySelector("#boot-quote").textContent=

SG.randomQuote();

break;

case "mycelium":

SG.mycelium.start();

break;

case "authorize":

document.querySelector("#boot-authorize")

.classList.add("visible");

break;

case "fade":

document.querySelector("#boot-engine")

.classList.add("boot-fade");

await this.wait(700);

break;

}

},

async run(){

this.container=document.querySelector("#boot-terminal");

if(!this.container)return;

for(const step of SG.bootSequence){

await this.execute(step);

}

}

};

document.addEventListener(

"DOMContentLoaded",

()=>{

SG.bootEngine.run();

});