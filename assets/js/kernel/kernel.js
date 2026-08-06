window.SG = window.SG || {};

SG.version = "SG-OS 1.01";

SG.kernel = {

modules:{},

effects:{},

services:{},

state:{

module:null,

network:"connected",

boot:false

},

register(name,module){

this.modules[name]=module;

console.log("[SG] module:",name);

},

service(name,obj){

this.services[name]=obj;

console.log("[SG] service:",name);

},

get(name){

return this.modules[name];

},

use(name){

return this.services[name];

}

};