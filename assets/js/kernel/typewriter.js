window.SG = window.SG || {};

SG.typewriter = {

sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
},

async write(target,text,speed=20){

    target.textContent="";

    for(let i=0;i<text.length;i++){

        target.textContent+=text[i];

        await this.sleep(speed);

    }

},

async line(container,text,speed=20){

    const row=document.createElement("div");

    container.appendChild(row);

    await this.write(row,text,speed);

    return row;

}

};