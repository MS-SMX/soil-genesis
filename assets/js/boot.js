const boot=document.getElementById("boot-engine");
const terminal=document.getElementById("boot-terminal");
const authorize=document.getElementById("boot-authorize");
const mycelium=document.getElementById("boot-mycelium");

if(sessionStorage.getItem("bios_seen")){

    boot.remove();

}else{

async function sleep(ms){

    return new Promise(r=>setTimeout(r,ms));

}

function syncPulse(){

    boot.classList.add("sync");

    terminal.classList.add("sync");

    setTimeout(()=>{

        boot.classList.remove("sync");

        terminal.classList.remove("sync");

    },220);

}

async function line(text,speed=18){

    const row=document.createElement("div");

    row.className="terminal-line";

    terminal.appendChild(row);

    for(const ch of text){

        row.textContent+=ch;

          if(ch==="."){

        await sleep(120);

    }

        await sleep(speed + Math.random()*12);

    }

}

(async()=>{

    await sleep(350);

    await line("SOIL GENESIS BIOS");

    await sleep(180);

    await line("BIOLOGICAL OPERATING SYSTEM");

    await sleep(260);

    await line("Initializing biological kernel...");

    await sleep(200);

    await line("Loading genetic database...");

    await sleep(200);

await line("Establishing mycorrhizal link...");

await sleep(220);

mycelium.classList.add("visible");

await sleep(850);

mycelium.classList.remove("visible");

await sleep(120);

    await line("Mounting seed archive...");

    await sleep(200);

    await line("Recovering botanical memory...");

    await sleep(220);

    await line("Verifying node identity...");

    await sleep(500);

terminal.style.opacity=".15";

syncPulse();

authorize.classList.add("visible");

await sleep(1300);

    sessionStorage.setItem("bios_seen",true);
authorize.classList.remove("visible");
    boot.classList.add("hide");

    await sleep(800);

    boot.remove();

})();

}