document.addEventListener("DOMContentLoaded",()=>{

const viewer=document.querySelector(".sg-media-viewer");

if(!viewer)return;

const main=document.getElementById("media-main-image");
const title=document.getElementById("media-title");
const desc=document.getElementById("media-description");
const meta=document.getElementById("media-meta");

const thumbs=document.querySelectorAll(".media-thumb");

thumbs.forEach(thumb=>{

thumb.addEventListener("click",()=>{

main.src=thumb.dataset.full;

title.textContent=thumb.dataset.title;

desc.textContent=thumb.dataset.description || "";

meta.textContent=

thumb.dataset.author+

(thumb.dataset.year ? " • "+thumb.dataset.year : "");

thumbs.forEach(t=>t.classList.remove("active"));

thumb.classList.add("active");

});

});

});