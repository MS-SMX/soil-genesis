const canvas=document.getElementById("crt-layer");

const ctx=canvas.getContext("2d");

function resizeCRT(){

    canvas.width=window.innerWidth;

    canvas.height=window.innerHeight;

}

window.addEventListener("resize",resizeCRT);

resizeCRT();

function drawCRT(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Scanlines

    ctx.strokeStyle="rgba(140,255,230,.035)";

    ctx.lineWidth=1;

    for(let y=0;y<canvas.height;y+=3){

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(canvas.width,y);

        ctx.stroke();

    }

    // Rumore

    for(let i=0;i<350;i++){

        ctx.fillStyle="rgba(255,255,255,.025)";

        ctx.fillRect(

            Math.random()*canvas.width,

            Math.random()*canvas.height,

            1,

            1

        );

    }

ctx.fillStyle="rgba(255,255,255,.008)";

ctx.fillRect(

0,

Math.random()*canvas.height,

canvas.width,

1

);

    requestAnimationFrame(drawCRT);

}

drawCRT();