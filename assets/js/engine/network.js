document.body.dataset.node
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let width;
let height;

const nodes = [];
const links = [];

const MOBILE = window.innerWidth < 700;

const NODE_COUNT = MOBILE ? 25 : 65;

function resize(){

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

window.addEventListener("resize",resize);

resize();

class Node{

    constructor(id){

        this.id=id;

        this.x=Math.random()*width;
        this.y=Math.random()*height;

        this.baseX=this.x;
        this.baseY=this.y;

        this.phase=Math.random()*Math.PI*2;

        this.radius=2;

        this.glow=0;

        this.neighbors=[];

    }

    update(){

        this.phase+=0.003;

        this.x=this.baseX+Math.sin(this.phase)*4;

        this.y=this.baseY+Math.cos(this.phase)*4;

        this.glow*=0.96;

    }

}

function buildNetwork(){

    links.length=0;

    for(const node of nodes){

        node.neighbors=[];

    }

    for(let i=0;i<nodes.length;i++){

        let distances=[];

        for(let j=0;j<nodes.length;j++){

            if(i===j) continue;

            const dx=nodes[i].x-nodes[j].x;
            const dy=nodes[i].y-nodes[j].y;

            const dist=Math.sqrt(dx*dx+dy*dy);

            distances.push({
                node:j,
                dist:dist
            });

        }

        distances.sort((a,b)=>a.dist-b.dist);

        for(let k=0;k<3;k++){

            const target=distances[k].node;

            if(!nodes[i].neighbors.includes(target)){

                nodes[i].neighbors.push(target);

            }

            if(!nodes[target].neighbors.includes(i)){

                nodes[target].neighbors.push(i);

            }

            links.push([i,target]);
const existing = links.some(link =>
    (link[0]===i && link[1]===target) ||
    (link[0]===target && link[1]===i)
);

if(!existing){

    links.push([i,target]);

}

        }

    }

}


for(let i=0;i<NODE_COUNT;i++){
nodes.push(new Node(i));
if(i===0){

    nodes[i].radius=4;

}


}

buildNetwork();

function drawConnections(){

    ctx.lineWidth=1;

    for(const link of links){

        const a=nodes[link[0]];
        const b=nodes[link[1]];

        ctx.beginPath();

        if(a.glow>0 || b.glow>0){

            ctx.strokeStyle="rgba(138,255,238,.35)";

            ctx.shadowBlur=2;
            ctx.shadowColor="#8affee";

        }else{

            ctx.strokeStyle="rgba(122,216,202,.08)";
            ctx.shadowBlur=0;

        }

        ctx.moveTo(a.x,a.y);

        ctx.lineTo(b.x,b.y);

        ctx.stroke();

    }

}

function drawNodes(){

    for(const node of nodes){

        const glow=4+node.glow*8;

        ctx.beginPath();

        ctx.fillStyle="rgba(122,216,202,.95)";

        ctx.shadowBlur=glow;

        ctx.shadowColor="#7ad8ca";

        ctx.arc(node.x,node.y,node.radius,0,Math.PI*2);

        ctx.fill();

    }

    ctx.shadowBlur=0;

}
let pulse=null;

function createPulse(){

    pulse={

        current:0, // Soil Genesis

        history:[0],

        timer:0

    };

}

function updatePulse(){

    if(!pulse){

        if(Math.random()<0.003){

            createPulse();

        }

        return;

    }

    pulse.timer++;

    const currentNode=nodes[pulse.current];

    currentNode.glow=1;

    if(pulse.timer>20){

        pulse.timer=0;

        const possible=currentNode.neighbors.filter(
            n => !pulse.history.includes(n)
        );

        if(possible.length===0){

            pulse=null;
            return;

        }

        const next=
            possible[Math.floor(Math.random()*possible.length)];

        pulse.history.push(next);

        pulse.current=next;

    }

    if(pulse.history.length>12){

        pulse=null;

    }

}

function animate(){

    ctx.clearRect(0,0,width,height);

    for(const node of nodes){

node.update();

    }
updatePulse();

    drawConnections();

    drawNodes();

    requestAnimationFrame(animate);

}

animate();