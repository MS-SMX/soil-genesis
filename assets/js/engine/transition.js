document.addEventListener("DOMContentLoaded",()=>{

const layer=document.createElement("div");

layer.id="transition-layer";

layer.innerHTML=`
<div class="transition-box">

<div class="transition-title">

<span id="transition-text">

LOADING MODULE

</span>

<span class="transition-cursor">

_

</span>

</div>

<div class="transition-status">

NODE VERIFIED

</div>

<div class="transition-bar">

<div class="transition-progress"></div>

</div>

</div>
`;

document.body.appendChild(layer);

document.querySelectorAll("a").forEach(link=>{

const href=link.getAttribute("href");

if(

!href ||

href.startsWith("#") ||

href.startsWith("http") ||

link.target==="_blank"

){

return;

}

link.addEventListener("click",e=>{

e.preventDefault();

if(window.SG && SG.networkPulse){

SG.networkPulse();

}

layer.classList.add("active");

setTimeout(()=>{
document.querySelector("#transition-text").textContent=

"SYNCING MYCORRHIZAL NETWORK";
window.location.href=href;

},180);

});

});

});