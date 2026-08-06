window.SG = window.SG || {};

SG.events={

emit(name,data={}){

document.dispatchEvent(

new CustomEvent(

"sg:"+name,

{detail:data}

)

);

},

on(name,callback){

document.addEventListener(

"sg:"+name,

callback

);

}

};