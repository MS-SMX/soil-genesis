const mesi = [
    "GENNAIO",
    "FEBBRAIO",
    "MARZO",
    "APRILE",
    "MAGGIO",
    "GIUGNO",
    "LUGLIO",
    "AGOSTO",
    "SETTEMBRE",
    "OTTOBRE",
    "NOVEMBRE",
    "DICEMBRE"
];

function updateMonth(){

    const el=document.getElementById("month");

    if(!el) return;

    el.textContent=mesi[new Date().getMonth()];

}

updateMonth();

document
.getElementById("season")
.textContent=currentSeason();

const activities=[

"IDLE",

"INDEXING",

"VERIFYING",

"SYNCING",

"CATALOGING"

];

function randomActivity(){

const el=document.getElementById("activity");

if(!el) return;

el.textContent=

activities[
Math.floor(
Math.random()*activities.length
)
];

}

setInterval(randomActivity,8000);

randomActivity();

function updateVitality(){

const el=document.getElementById("vitality");

if(!el) return;

const value=

96+

Math.floor(
Math.random()*4
);

el.textContent=value+"%";

}

setInterval(updateVitality,4000);

updateVitality();