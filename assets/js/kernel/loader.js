window.SG = window.SG || {};
function typeLine(element,text,speed=18){

return new Promise(resolve=>{

element.textContent="";

let i=0;

const timer=setInterval(()=>{

element.textContent+=text.charAt(i);

i++;

if(i>=text.length){

clearInterval(timer);

resolve();

}

},speed);

});

}
async function printLine(output,text){

const line=document.createElement("div");

output.appendChild(line);

await typeLine(line,text);

}
SG.loader={

messages:{

"/":"ENTERING NODE",

"/sementi/":"MOUNTING ARCHIVE",

"/risorse/":"INDEXING KNOWLEDGE BASE"

},

async open(url){

const overlay=document.querySelector("#module-loader");

if(!overlay){

window.location=url;

return;

}

const output=document.querySelector("#loader-output");

output.innerHTML="";

overlay.classList.add("visible");

const path=new URL(url).pathname;

const module=this.messages[path] || "OPENING MODULE";

await printLine(output,"> REQUEST RECEIVED");

await printLine(output,"NODE........ONLINE");

await printLine(output,module);

await printLine(output,"VERIFYING LINK...");

await printLine(output,"LINK ESTABLISHED");

setTimeout(()=>{

window.location=url;

},140);

}
}; 

document.addEventListener("DOMContentLoaded",()=>{

document.querySelectorAll("nav a").forEach(link=>{

const href=link.href;

if(!href)return;

link.addEventListener("click",e=>{

if(

e.ctrlKey ||

e.metaKey ||

e.shiftKey ||

link.target==="_blank"

){

return;

}

e.preventDefault();

SG.loader.open(href);

});

});

});